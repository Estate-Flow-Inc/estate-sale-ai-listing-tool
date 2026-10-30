import { ESTIMATE_RANGE, TOKEN_ESTIMATES } from '@/config/estimates';
import { getModel } from '@/config/models';
import { COMPETITOR_RATE_PER_ITEM } from '@/config/pricing';
import type { ImageQuality } from '@/config/settings';

export interface EstimateInput {
  modelId: string;
  /** Listings to generate (one request each). */
  itemCount: number;
  /** Total photos across all items. */
  photoCount: number;
  imageQuality: ImageQuality;
}

export interface CostEstimate {
  /** Expected total, paid to the AI provider. */
  expected: number;
  low: number;
  high: number;
  perItem: number;
  /** What a typical AI listing tool would charge for the same items. */
  competitor: number;
  savings: number;
}

/** Expected cost in USD of generating listings with a given model. */
export function estimateCost({ modelId, itemCount, photoCount, imageQuality }: EstimateInput): CostEstimate {
  const model = getModel(modelId);
  const inputTokens =
    itemCount * TOKEN_ESTIMATES.promptTokens + photoCount * TOKEN_ESTIMATES.imageTokens[imageQuality];
  const outputTokens = itemCount * TOKEN_ESTIMATES.outputTokens;

  const expected =
    (inputTokens / 1_000_000) * model.inputPer1M + (outputTokens / 1_000_000) * model.outputPer1M;
  const competitor = itemCount * COMPETITOR_RATE_PER_ITEM;

  return {
    expected,
    low: expected * ESTIMATE_RANGE.low,
    high: expected * ESTIMATE_RANGE.high,
    perItem: itemCount > 0 ? expected / itemCount : 0,
    competitor,
    savings: Math.max(0, competitor - expected),
  };
}

/** Cost per item for one photo per item. Used for the landing page comparisons. */
export function costPerItem(modelId: string, imageQuality: ImageQuality) {
  return estimateCost({ modelId, itemCount: 1, photoCount: 1, imageQuality }).expected;
}
