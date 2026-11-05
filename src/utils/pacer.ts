import { FREE_TIER_RPM } from '@/config/limits';

import { setBackgroundTimeout } from './backgroundTimer';

/**
 * Spaces out request starts once we know the key is rate limited (free tier).
 * Google's per-minute limit is per model, so each model gets its own schedule.
 * Off by default, so paid keys run at full speed. Stays on for the session.
 */
const INTERVAL_MS = Math.ceil(60_000 / FREE_TIER_RPM);

let paced = false;
const nextSlot = new Map<string, number>();

export function startPacing() {
  paced = true;
}

export function isPacing() {
  return paced;
}

/** Waits for this model's next free slot when pacing is on. */
export async function waitForSlot(modelId: string, signal?: AbortSignal) {
  if (!paced) return;
  const now = Date.now();
  const at = Math.max(now, nextSlot.get(modelId) ?? 0);
  nextSlot.set(modelId, at + INTERVAL_MS);
  if (at > now) await sleep(at - now, signal);
}

/** A wait that ends early on abort, and keeps time in a background tab. */
export function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve) => {
    const cancel = setBackgroundTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      cancel();
      resolve();
    });
  });
}
