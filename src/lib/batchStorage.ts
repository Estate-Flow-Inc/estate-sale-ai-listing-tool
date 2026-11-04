/**
 * Photos and listings saved in this browser (IndexedDB), so a refresh doesn't
 * lose work. Nothing here leaves the device. The API key is never stored here.
 */
const DB_NAME = 'estate-sale-ai-listing-tool';
const VERSION = 1;
const STORES = ['photos', 'items', 'meta'] as const;
export type StoreName = (typeof STORES)[number];

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb() {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      for (const name of STORES) {
        if (!req.result.objectStoreNames.contains(name)) req.result.createObjectStore(name);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function write(stores: StoreName | StoreName[], fn: (tx: IDBTransaction) => void) {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(stores, 'readwrite');
    fn(tx);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export const putRecord = (store: StoreName, key: string, value: unknown) =>
  write(store, (tx) => tx.objectStore(store).put(value, key));

export const deleteRecord = (store: StoreName, key: string) =>
  write(store, (tx) => tx.objectStore(store).delete(key));

export const clearAllRecords = () =>
  write([...STORES], (tx) => STORES.forEach((name) => tx.objectStore(name).clear()));

export async function getAllRecords<T>(store: StoreName): Promise<T[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store).objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

export async function getRecord<T>(store: StoreName, key: string): Promise<T | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store).objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}
