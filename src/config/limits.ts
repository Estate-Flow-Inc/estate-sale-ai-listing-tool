/** Guardrails for what a single browser session should take on. */

/** Matches Google's free daily limit (FREE_TIER_RPD), so a batch can always finish today. */
export const MAX_PHOTOS = 500;

/** Skip anything bigger. Phone photos are 2 to 12 MB; this catches odd files, not real photos. */
export const MAX_PHOTO_BYTES = 50 * 1024 * 1024;

/** Thumbnail size for on-screen grids. Full photos only leave memory as Blobs. */
export const DISPLAY_THUMB_PX = 320;

/** Photos shown before "Show all" in the setup card (two rows on desktop). */
export const PHOTO_GRID_PREVIEW = 12;

/** Results shown per "Show more". */
export const RESULTS_PAGE_SIZE = 48;

/** Photos converted at once: one per spare CPU core, between 2 and 6, so the page stays smooth. */
export const PHOTO_PROCESSING_CONCURRENCY = Math.min(
  6,
  Math.max(2, (globalThis.navigator?.hardwareConcurrency ?? 4) - 1)
);

/** What the file picker accepts. HEIC listed by extension because some browsers report no type. */
export const ACCEPTED_IMAGE_TYPES = 'image/*,.heic,.heif';

/**
 * Longest we wait for one AI request. Past this, the item retries, on the other
 * model when one is available.
 */
export const REQUEST_TIMEOUT_MS = 25_000;

/**
 * Listings generated at once. Free-tier pacing still keeps each model under its
 * per-minute limit; this keeps the pipe full while responses take a few seconds.
 */
export const GENERATION_CONCURRENCY = 6;

/**
 * Google's free tier for gemini-3.1-flash-lite (AI Studio rate limits, Nov 2026).
 * Paid keys get far more. We only pace to FREE_TIER_RPM after Google says "slow down" (429).
 */
export const FREE_TIER_RPM = 15;
export const FREE_TIER_RPD = 500;
