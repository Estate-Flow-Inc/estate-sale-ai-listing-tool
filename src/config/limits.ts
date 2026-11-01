/** Guardrails for what a single browser session should take on. */

export const MAX_PHOTOS = 1000;

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

/** Listings generated at once. Low enough to stay under new accounts' rate limits. */
export const GENERATION_CONCURRENCY = 4;
