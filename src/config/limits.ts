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

/** Photos converted at once. Canvas work is heavy; more than this makes the page janky. */
export const PHOTO_PROCESSING_CONCURRENCY = 3;

/** What the file picker accepts. HEIC listed by extension because some browsers report no type. */
export const ACCEPTED_IMAGE_TYPES = 'image/*,.heic,.heif';

/**
 * Longest we wait for one AI request. Past this, that model is dropped for the
 * rest of the session and the item moves to the next model.
 */
export const REQUEST_TIMEOUT_MS = 25_000;

/** Listings generated at once. Low, because Gemini's free tier has tight per-minute limits. */
export const GENERATION_CONCURRENCY = 2;

/**
 * Google's free tier for gemini-3.1-flash-lite (AI Studio rate limits, Nov 2026).
 * Paid keys get far more. We only pace to FREE_TIER_RPM after Google says "slow down" (429).
 */
export const FREE_TIER_RPM = 15;
export const FREE_TIER_RPD = 500;
