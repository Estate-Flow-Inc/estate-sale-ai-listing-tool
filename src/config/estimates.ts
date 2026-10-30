import type { ImageQuality } from './settings';

/**
 * Token assumptions behind cost estimates. Rounded up on purpose: better to
 * estimate a bit high than surprise someone's bill. Tune after real runs.
 */
export const TOKEN_ESTIMATES = {
  /** System prompt, instructions and output schema, per request. */
  promptTokens: 600,
  /** One listing as JSON: title, description, category, condition, estimate. */
  outputTokens: 400,
  /** Per photo, by the photo size setting. */
  imageTokens: { small: 600, balanced: 1100, detailed: 1800 } satisfies Record<ImageQuality, number>,
};

/** Shown as a range around the expected cost. */
export const ESTIMATE_RANGE = { low: 0.7, high: 1.5 };
