import type { ImageQuality } from './settings';

/**
 * Token assumptions behind cost estimates. Rounded up on purpose: better to
 * estimate a bit high than surprise someone's bill. Tune after real runs.
 */
export const TOKEN_ESTIMATES = {
  /** System prompt (constants/prompts.ts) plus the output schema, per request. */
  promptTokens: 1500,
  /** One full listing as JSON (providers/listingSchema.ts). */
  outputTokens: 650,
  /**
   * Per photo. Gemini bills a fixed amount by media resolution, not pixels:
   * medium = 560, high = 1,120 (see providers/gemini.ts MEDIA_RESOLUTION).
   */
  imageTokens: { small: 560, balanced: 560, detailed: 1120 } satisfies Record<ImageQuality, number>,
};

/** Shown as a range around the expected cost. */
export const ESTIMATE_RANGE = { low: 0.7, high: 1.5 };
