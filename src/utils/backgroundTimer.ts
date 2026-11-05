/**
 * setTimeout that keeps time in a background tab. Browsers slow page timers in
 * hidden tabs (Chrome: about once a minute after 5 minutes), which would stall
 * pacing and retries. Timers inside a worker are not throttled that hard.
 * Falls back to a normal setTimeout if workers are unavailable.
 */
const WORKER_SOURCE = `
const timers = new Map();
onmessage = (e) => {
  const { id, ms, cancel } = e.data;
  if (cancel) { clearTimeout(timers.get(id)); timers.delete(id); return; }
  timers.set(id, setTimeout(() => { timers.delete(id); postMessage(id); }, ms));
};
`;

let worker: Worker | null | undefined;
let nextId = 0;
const callbacks = new Map<number, () => void>();

function getWorker(): Worker | null {
  if (worker !== undefined) return worker;
  try {
    const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'text/javascript' }));
    worker = new Worker(url);
    worker.onmessage = (e: MessageEvent<number>) => {
      const cb = callbacks.get(e.data);
      callbacks.delete(e.data);
      cb?.();
    };
  } catch {
    worker = null;
  }
  return worker;
}

/** Returns a cancel function. */
export function setBackgroundTimeout(fn: () => void, ms: number): () => void {
  const w = getWorker();
  if (!w) {
    const t = setTimeout(fn, ms);
    return () => clearTimeout(t);
  }
  const id = ++nextId;
  callbacks.set(id, fn);
  w.postMessage({ id, ms });
  return () => {
    callbacks.delete(id);
    w.postMessage({ id, cancel: true });
  };
}
