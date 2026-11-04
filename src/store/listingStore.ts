import { create } from 'zustand';

import { GENERATION_CONCURRENCY } from '@/config/limits';
import { getModel, MODELS } from '@/config/models';
import { getSettings } from '@/lib/settings';
import { getProvider, ProviderError, type Listing, type TokenUsage } from '@/providers';
import { forEachWithConcurrency } from '@/utils/concurrency';
import { blobToDataUrl } from '@/utils/imageCompression';
import { sleep, startPacing, waitForSlot } from '@/utils/pacer';

import type { Photo } from './photoStore';

export type ItemStatus = 'queued' | 'generating' | 'done' | 'error';

export interface ListingItem {
  id: string;
  /** AI-<batch>-0001: unique per page session, used in the Excel file and photo names. */
  sku: string;
  photoIds: string[];
  /** The item's compressed photos. Kept here so removing a photo doesn't break the listing. */
  images: Blob[];
  /** First photo's small thumbnail, and an object URL for it owned by this item. */
  thumb: Blob;
  thumbUrl: string;
  /** Keeps the original order when restored from browser storage. */
  order: number;
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
const newSkuBatch = () => Math.random().toString(36).slice(2, 5).toUpperCase();
let skuBatch = newSkuBatch();
let skuCounter = 0;
const nextSku = () => `AI-${skuBatch}-${String(++skuCounter).padStart(4, '0')}`;

export interface SkuState {
  batch: string;
  counter: number;
}
export const getSkuState = (): SkuState => ({ batch: skuBatch, counter: skuCounter });
/** Restored batch keeps its SKU series; `null` starts a fresh one. */
export function setSkuState(state: SkuState | null) {
  skuBatch = state?.batch ?? newSkuBatch();
  skuCounter = state?.counter ?? 0;
}

/**
 * Model routing. Items alternate between models, and a failed item moves to the
 * other model right away instead of waiting. A model that's overloaded or rate
 * limited sits out briefly; one that's out of free quota or unavailable sits out
 * for the rest of the session.
 */
const BENCH_MS = 60_000;
/** Total tries per item, across all models. */
const MAX_ATTEMPTS = 6;
/** Longest wait when every model is benched, in seconds. */
const MAX_WAIT = 30;

const benchedUntil = new Map<string, number>();
const droppedModels = new Set<string>();
let nextStartModel = 0;

const MODEL_IDS = MODELS.map((m) => m.id);

/** First usable model, starting from `from`: prefers one that isn't benched. */
function pickModel(from: number): string | null {
  const order = MODEL_IDS.map((_, i) => MODEL_IDS[(from + i) % MODEL_IDS.length]).filter(
    (id) => !droppedModels.has(id)
  );
  if (order.length === 0) return null;
  const now = Date.now();
  return (
    order.find((id) => (benchedUntil.get(id) ?? 0) <= now) ??
    order.reduce((a, b) => ((benchedUntil.get(a) ?? 0) <= (benchedUntil.get(b) ?? 0) ? a : b))
  );
}

/** Kinds worth another try, on the other model if there is one. */
const TRY_AGAIN = new Set(['server', 'rate_limit', 'network', 'bad_response']);

export const useListingStore = create<ListingState>()((set, get) => {
  const update = (id: string, patch: Partial<ListingItem>) =>
    set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));

  /** One item, routed across models until it succeeds or runs out of tries. */
  const generate = async (
    provider: ReturnType<typeof getProvider>,
    apiKey: string,
    images: string[],
    signal: AbortSignal,
    onBusy: () => void
  ) => {
    const { imageQuality } = getSettings();
    let from = nextStartModel++ % MODEL_IDS.length;
    let lastError: ProviderError | null = null;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; ) {
      const modelId = pickModel(from);
      if (!modelId) throw lastError ?? new ProviderError('unavailable', 'Google Gemini is unavailable right now.');

      // Every model is sitting out: back off before trying anyway.
      const benched = (benchedUntil.get(modelId) ?? 0) > Date.now();
      if (benched) {
        await sleep((Math.min(2 ** Math.max(attempt, 1), MAX_WAIT) + Math.random()) * 1000, signal);
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      }

      try {
        await waitForSlot(modelId, signal);
        const result = await provider.generateListing({ apiKey, modelId, images, imageQuality, signal });
        return { ...result, modelId };
      } catch (err) {
        if (!(err instanceof ProviderError) || signal.aborted) throw err;
        console.warn(`[listing] ${modelId} failed: ${err.kind}`, err.detail ?? err.message);
        lastError = err;

        if (err.kind === 'quota' || err.kind === 'unavailable') {
          // Out of free quota today, or this model can't serve us: stop using it.
          droppedModels.add(modelId);
          continue;
        }
        if (!TRY_AGAIN.has(err.kind)) throw err; // auth, bad request: retrying won't help

        attempt++;
        if (err.kind === 'rate_limit' && !get().paced) {
          startPacing();
          set({ paced: true });
        }
        if (err.kind === 'server' || err.kind === 'rate_limit') {
          benchedUntil.set(modelId, Date.now() + Math.max(BENCH_MS, (err.retryAfter ?? 0) * 1000));
        }
        onBusy();
        from = MODEL_IDS.indexOf(modelId) + 1; // next try goes to the other model
      }
    }
    throw lastError ?? new ProviderError('server', 'Google is seeing high demand. Try again in a few minutes.');
  };

  const run = async (ids: string[], { apiKey, modelId }: RunConfig) => {
    if (ids.length === 0 || get().running) return;
    controller = new AbortController();
    const { signal } = controller;
    const provider = getProvider(getModel(modelId).provider);
    set({ running: true, fatalError: null, dailyLimitHit: false, modelId });

    await forEachWithConcurrency(ids, GENERATION_CONCURRENCY, async (id) => {
      const item = get().items.find((i) => i.id === id);
      if (!item || signal.aborted) return;

      update(id, { status: 'generating', error: undefined, busy: false });
      try {
        // Base64 only exists for the length of the request.
        const images = await Promise.all(item.images.map(blobToDataUrl));
        const result = await generate(provider, apiKey, images, signal, () => update(id, { busy: true }));
        update(id, {
          status: 'done',
          busy: false,
          listing: result.listing,
          usage: result.usage,
          modelId: result.modelId,
        });
      } catch (err) {
        if (signal.aborted) {
          update(id, { status: 'queued', busy: false });
          return;
        }
        const message = err instanceof Error ? err.message : 'Something went wrong';
        update(id, { status: 'error', busy: false, error: message });
        // Bad key, or every model is out of free quota: every request would fail.
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
          thumb: p.image!.thumb,
          thumbUrl: URL.createObjectURL(p.image!.thumb),
          order: p.order,
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
