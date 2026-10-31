/** Guardrails for what a single browser session should take on. */

export const MAX_PHOTOS = 500;

/** Skip anything bigger. Phone photos are 2 to 12 MB; this catches odd files, not real photos. */
export const MAX_PHOTO_BYTES = 50 * 1024 * 1024;

/** Photos converted at once. Canvas work is heavy; more than this makes the page janky. */
export const PHOTO_PROCESSING_CONCURRENCY = 3;

/** What the file picker accepts. HEIC listed by extension because some browsers report no type. */
export const ACCEPTED_IMAGE_TYPES = 'image/*,.heic,.heif';

/** Listings generated at once. Low enough to stay under new accounts' rate limits. */
export const GENERATION_CONCURRENCY = 4;
