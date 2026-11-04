import {
  clearAllRecords,
  deleteRecord,
  getAllRecords,
  getRecord,
  putRecord,
  type StoreName,
} from '@/lib/batchStorage';

import { getSkuState, setSkuState, useListingStore, type ListingItem, type SkuState } from './listingStore';
import { usePhotoStore, type Photo } from './photoStore';

/**
 * Keeps photos and listings in this browser so a refresh doesn't lose work.
 * Restores on load, then writes every change. "Start over" clears it all.
 * Browser only: never imported by the prerender.
 */

type PhotoRecord = Omit<Photo, 'previewUrl'>;
type ItemRecord = Omit<ListingItem, 'thumbUrl' | 'busy'>;

const warn = (err: unknown) => console.warn('[storage]', err);
const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

function toPhotoRecord({ previewUrl: _url, ...photo }: Photo): PhotoRecord | null {
  return photo.status === 'ready' ? photo : null; // processing photos can't be restored
}

function toItemRecord({ thumbUrl: _url, busy: _busy, ...item }: ListingItem): ItemRecord | null {
  return item.status === 'generating' ? null : item; // already saved as queued
}

/** Write changed records, delete removed ones. Unchanged objects are skipped. */
function sync<T extends { id: string }>(
  store: StoreName,
  next: T[],
  prev: T[],
  toRecord: (x: T) => unknown
) {
  if (next === prev) return;
  const before = new Map(prev.map((x) => [x.id, x]));
  for (const x of next) {
    if (before.get(x.id) === x) continue;
    const record = toRecord(x);
    if (record) putRecord(store, x.id, record).catch(warn);
  }
  const ids = new Set(next.map((x) => x.id));
  for (const x of prev) if (!ids.has(x.id)) deleteRecord(store, x.id).catch(warn);
}

export async function restoreAndPersist() {
  try {
    const [photos, items, sku] = await Promise.all([
      getAllRecords<PhotoRecord>('photos'),
      getAllRecords<ItemRecord>('items'),
      getRecord<SkuState>('meta', 'sku'),
    ]);
    if (sku) setSkuState(sku);
    if (photos.length > 0) {
      const restored: Photo[] = photos
        .sort(byOrder)
        .map((p) => ({ ...p, previewUrl: p.image ? URL.createObjectURL(p.image.thumb) : undefined }));
      usePhotoStore.setState((s) => ({ photos: [...restored, ...s.photos] }));
    }
    if (items.length > 0) {
      const restored: ListingItem[] = items.sort(byOrder).map((i) => ({
        ...i,
        thumbUrl: URL.createObjectURL(i.thumb),
      }));
      useListingStore.setState((s) => ({ items: [...restored, ...s.items] }));
    }
  } catch (err) {
    warn(err); // private mode or storage blocked: the tool still works, just not across refreshes
  }

  usePhotoStore.subscribe((s, prev) => sync('photos', s.photos, prev.photos, toPhotoRecord));
  useListingStore.subscribe((s, prev) => {
    sync('items', s.items, prev.items, toItemRecord);
    if (s.items.length > prev.items.length) putRecord('meta', 'sku', getSkuState()).catch(warn);
  });

  // Leaving mid-run is safe (unfinished items come back), but it's rarely on purpose.
  window.addEventListener('beforeunload', (e) => {
    if (useListingStore.getState().running) e.preventDefault();
  });
}

/** Clear photos, listings and everything saved in this browser. */
export async function startOver() {
  useListingStore.getState().stop();
  useListingStore.getState().items.forEach((i) => URL.revokeObjectURL(i.thumbUrl));
  useListingStore.setState({ items: [], fatalError: null, dailyLimitHit: false });
  usePhotoStore.getState().clearPhotos();
  setSkuState(null);
  await clearAllRecords().catch(warn);
}
