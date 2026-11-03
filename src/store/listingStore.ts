import { create } from 'zustand';

import { GENERATION_CONCURRENCY } from '@/config/limits';
import { getModel, MODELS } from '@/config/models';
import { getSettings } from '@/lib/settings';
import { getProvider, ProviderError, type Listing, type TokenUsage } from '@/providers';
import { forEachWithConcurrency } from '@/utils/concurrency';
import { blobToDataUrl } from '@/utils/imageCompression';
import { startPacing, waitForSlot } from '@/utils/pacer';
import { withRetry } from '@/utils/retry';

import type { Photo } from './photoStore';

export type ItemStatus = 'queued' | 'generating' | 'done' | 'error';

export interface ListingItem {
  id: string;
  /** AI-<batch>-0001: unique per page session, used in the Excel file and photo names. */
  sku: string;
  photoIds: string[];
  /** The item's compressed photos. Kept here so removing a photo doesn't break the listing. */
  images: Blob[];
  /** Object URL of the first photo's thumbnail, owned by this item. */
  thumbUrl: string;
  status: ItemStatus;
  /** Model that wrote the listing. */
  modelId?: string;
  /** Google is overloaded or rate limiting; we're waiting to retry. */
  busy?: boolean;
  listing?: Listing;
  error?: string;
  usage?: TokenUsage;
}

export interface RunConfig {
  apiKey: string;
  modelId: string;
}

interface ListingState {
  items: ListingItem[];
  running: boolean;
  /** Model used for the last run, for actual cost. */
  modelId: string | null;
  /** Auth or billing problem: stops the whole run, since every request would fail. */
  fatalError: string | null;
  /** True when the run stopped on Google's free daily limit. */
  dailyLimitHit: boolean;
  /** Google rate limited us (free tier), so requests are spaced out. */
  paced: boolean;
  /** Queue one listing per photo (photos already listed are skipped) and run. */
  start: (photos: Photo[], config: RunConfig) => void;
  /** Re-run failed and stopped items. */
  retry: (config: RunConfig) => void;
  stop: () => void;
}

let controller: AbortController | null = null;

/**
 * SKUs: a short random code per page session, so two batches imported into the
 * same Estate Flow sale never collide (its importer skips duplicate SKUs).
 */
const SKU_BATCH = Math.random().toString(36).slice(2, 5).toUpperCase();
let skuCounter = 0;
const nextSku = () => `AI-${SKU_BATCH}-${String(++skuCounter).padStart(4, '0')}`;

/**
 * Models that failed (overloaded, timed out, unavailable, or out of free quota)
 * are dropped for the rest of the session: index of the first model still in use.
 */
let firstHealthyModel = 0;

export const useListingStore = create<ListingState>()((set, get) => {
  const update = (id: string, patch: Partial<ListingItem>) =>
    set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));

  const run = async (ids: string[], { apiKey, modelId }: RunConfig) => {
    if (ids.length === 0 || get().running) return;
    controller = new AbortController();
    const { signal } = controller;
    const provider = getProvider(getModel(modelId).provider);
    set({ running: true, fatalError: null, dailyLimitHit: false, modelId });

    // Fallback chain. The first time a model fails, move on and never use it again.
    const chain = MODELS.map((m) => m.id);

    await forEachWithConcurrency(ids, GENERATION_CONCURRENCY, async (id) => {
      const item = get().items.find((i) => i.id === id);
      if (!item || signal.aborted) return;

      update(id, { status: 'generating', error: undefined, busy: false });
      try {
        // Base64 only exists for the length of the request.
        const images = await Promise.all(item.images.map(blobToDataUrl));
        const { imageQuality } = getSettings();
        let done = false;
        for (let k = firstHealthyModel; k < chain.length && !done; k++) {
          const last = k === chain.length - 1;
          try {
            const result = await withRetry(
              async () => {
                await waitForSlot(signal);
                return provider.generateListing({ apiKey, modelId: chain[k], images, imageQuality, signal });
              },
              // With a backup model left, no second chances. The last one gets a few retries.
              {
                signal,
                serverRetries: last ? undefined : 0,
                onRetry: (retryErr) => {
                  update(id, { busy: true });
                  // Free tier: drop to Google's per-minute pace for the rest of the session.
                  if (retryErr.kind === 'rate_limit' && !get().paced) {
                    startPacing();
                    set({ paced: true });
                  }
                },
              }
            );
            update(id, {
              status: 'done',
              busy: false,
              listing: result.listing,
              usage: result.usage,
              modelId: chain[k],
            });
            done = true;
          } catch (err) {
            if (err instanceof ProviderError) {
              console.warn(`[listing] ${chain[k]} failed: ${err.kind}`, err.detail ?? err.message);
            }
            const rotate =
              !last &&
              err instanceof ProviderError &&
              (err.kind === 'server' || err.kind === 'unavailable' || err.kind === 'quota');
            if (!rotate || signal.aborted) throw err;
            firstHealthyModel = Math.max(firstHealthyModel, k + 1);
            update(id, { busy: true });
          }
        }
      } catch (err) {
        if (signal.aborted) {
          update(id, { status: 'queued', busy: false });
          return;
        }
        const message = err instanceof Error ? err.message : 'Something went wrong';
        update(id, { status: 'error', busy: false, error: message });
        if (err instanceof ProviderError && (err.kind === 'auth' || err.kind === 'quota')) {
          set({ fatalError: message, dailyLimitHit: err.kind === 'quota' });
          controller?.abort();
        }
      }
    });

    set({ running: false });
  };

  return {
    items: [],
    running: false,
    modelId: null,
    fatalError: null,
    dailyLimitHit: false,
    paced: false,

    start: (photos, config) => {
      const listed = new Set(get().items.flatMap((i) => i.photoIds));
      const fresh: ListingItem[] = photos
        .filter((p) => p.status === 'ready' && p.image && !listed.has(p.id))
        .map((p) => ({
          id: crypto.randomUUID(),
          sku: nextSku(),
          photoIds: [p.id],
          images: [p.image!.blob],
          thumbUrl: URL.createObjectURL(p.image!.thumb),
          status: 'queued',
        }));
      set((s) => ({ items: [...s.items, ...fresh] }));
      void run(fresh.map((i) => i.id), config);
    },

    retry: (config) => {
      const ids = get()
        .items.filter((i) => i.status === 'error' || i.status === 'queued')
        .map((i) => i.id);
      void run(ids, config);
    },

    stop: () => controller?.abort(),
  };
});

/** Photos that don't have a listing yet. */
export function unlistedPhotos(photos: Photo[], items: ListingItem[]) {
  const listed = new Set(items.flatMap((i) => i.photoIds));
  return photos.filter((p) => p.status === 'ready' && !listed.has(p.id));
}
