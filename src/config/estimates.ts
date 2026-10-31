import type { ImageQuality } from './settings';

/**
 * Token assumptions behind cost estimates. Rounded up on purpose: better to
 * estimate a bit high than surprise someone's bill. Tune after real runs.
 */
export const TOKEN_ESTIMATES = {
  /** System prompt (constants/prompts.ts) plus the output schema, per request. */
  promptTokens: 1500,
  /** One full listing as JSON (providers/listingSchema.ts). */
  outputTokens: 900,
  /**
   * Per photo at detail "high", by the photo size setting. GPT-5.6 Luna: 32px patches x 1.2.
   * 4:3 photo at 768px = 432 patches (519), 1024px = 768 (922), 1536px = 1,728 (2,074).
   */
  imageTokens: { small: 520, balanced: 925, detailed: 2075 } satisfies Record<ImageQuality, number>,
};

/** Shown as a range around the expected cost. */
export const ESTIMATE_RANGE = { low: 0.7, high: 1.5 };
