import { create } from 'zustand';

import { GENERATION_CONCURRENCY } from '@/config/limits';
import { getModel } from '@/config/models';
import { getProvider, ProviderError, type Listing, type TokenUsage } from '@/providers';
import { forEachWithConcurrency } from '@/utils/concurrency';
import { blobToDataUrl } from '@/utils/imageCompression';
import { withRetry } from '@/utils/retry';

import type { Photo } from './photoStore';

export type ItemStatus = 'queued' | 'generating' | 'done' | 'error';

export interface ListingItem {
  id: string;
  photoIds: string[];
  /** The item's compressed photos. Kept here so removing a photo doesn't break the listing. */
  images: Blob[];
  /** Object URL of the first photo's thumbnail, owned by this item. */
  thumbUrl: string;
  status: ItemStatus;
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
  /** Queue one listing per photo (photos already listed are skipped) and run. */
  start: (photos: Photo[], config: RunConfig) => void;
  /** Re-run failed and stopped items. */
  retry: (config: RunConfig) => void;
  stop: () => void;
}

let controller: AbortController | null = null;

export const useListingStore = create<ListingState>()((set, get) => {
  const update = (id: string, patch: Partial<ListingItem>) =>
    set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));

  const run = async (ids: string[], { apiKey, modelId }: RunConfig) => {
    if (ids.length === 0 || get().running) return;
    controller = new AbortController();
    const { signal } = controller;
    const provider = getProvider(getModel(modelId).provider);
    set({ running: true, fatalError: null, modelId });

    await forEachWithConcurrency(ids, GENERATION_CONCURRENCY, async (id) => {
      const item = get().items.find((i) => i.id === id);
      if (!item || signal.aborted) return;

      update(id, { status: 'generating', error: undefined });
      try {
        // Base64 only exists for the length of the request.
        const images = await Promise.all(item.images.map(blobToDataUrl));
        const result = await withRetry(
          () => provider.generateListing({ apiKey, modelId, images, signal }),
          { signal }
        );
        update(id, { status: 'done', listing: result.listing, usage: result.usage });
      } catch (err) {
        if (signal.aborted) {
          update(id, { status: 'queued' });
          return;
        }
        const message = err instanceof Error ? err.message : 'Something went wrong';
        update(id, { status: 'error', error: message });
        if (err instanceof ProviderError && (err.kind === 'auth' || err.kind === 'quota')) {
          set({ fatalError: message });
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

    start: (photos, config) => {
      const listed = new Set(get().items.flatMap((i) => i.photoIds));
      const fresh: ListingItem[] = photos
        .filter((p) => p.status === 'ready' && p.image && !listed.has(p.id))
        .map((p) => ({
          id: crypto.randomUUID(),
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
