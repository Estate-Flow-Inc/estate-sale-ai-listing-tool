import { FREE_TIER_RPM } from '@/config/limits';

/**
 * Spaces out request starts once we know the key is rate limited (free tier).
 * Off by default, so paid keys run at full speed. Stays on for the session.
 */
const INTERVAL_MS = Math.ceil(60_000 / FREE_TIER_RPM);

let paced = false;
let nextSlot = 0;

export function startPacing() {
  paced = true;
}

export function isPacing() {
  return paced;
}

/** Waits for this request's turn when pacing is on. */
export async function waitForSlot(signal?: AbortSignal) {
  if (!paced) return;
  const now = Date.now();
  const at = Math.max(now, nextSlot);
  nextSlot = at + INTERVAL_MS;
  if (at > now) {
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, at - now);
      signal?.addEventListener('abort', () => {
        clearTimeout(timer);
        resolve();
      });
    });
  }
}
