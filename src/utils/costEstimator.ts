import { ESTIMATE_RANGE, TOKEN_ESTIMATES } from '@/config/estimates';
import { getModel } from '@/config/models';
import { COMPETITOR_RATE_PER_ITEM } from '@/config/pricing';
import type { ImageQuality } from '@/config/settings';
import type { TokenUsage } from '@/providers/types';

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
  /** What typical AI listing tools charge for the same items, as a range. */
  competitor: { low: number; high: number };
  savings: { low: number; high: number };
}

/** Expected cost in USD of generating listings with a given model. */
export function estimateCost({ modelId, itemCount, photoCount, imageQuality }: EstimateInput): CostEstimate {
  const model = getModel(modelId);
  const inputTokens =
    itemCount * TOKEN_ESTIMATES.promptTokens + photoCount * TOKEN_ESTIMATES.imageTokens[imageQuality];
  const outputTokens = itemCount * TOKEN_ESTIMATES.outputTokens;

  const expected =
    (inputTokens / 1_000_000) * model.inputPer1M + (outputTokens / 1_000_000) * model.outputPer1M;
  const competitor = {
    low: itemCount * COMPETITOR_RATE_PER_ITEM.low,
    high: itemCount * COMPETITOR_RATE_PER_ITEM.high,
  };

  return {
    expected,
    low: expected * ESTIMATE_RANGE.low,
    high: expected * ESTIMATE_RANGE.high,
    perItem: itemCount > 0 ? expected / itemCount : 0,
    competitor,
    savings: {
      low: Math.max(0, competitor.low - expected),
      high: Math.max(0, competitor.high - expected),
    },
  };
}

/** Cost per item for one photo per item. Used for the landing page comparisons. */
export function costPerItem(modelId: string, imageQuality: ImageQuality) {
  return estimateCost({ modelId, itemCount: 1, photoCount: 1, imageQuality }).expected;
}

/** Actual cost from the token counts the provider reported, cached input at the cached rate. */
export function costFromUsage(modelId: string, usage: TokenUsage) {
  const model = getModel(modelId);
  const cached = Math.min(usage.cachedInputTokens, usage.inputTokens);
  return (
    ((usage.inputTokens - cached) / 1_000_000) * model.inputPer1M +
    (cached / 1_000_000) * model.cachedInputPer1M +
    (usage.outputTokens / 1_000_000) * model.outputPer1M
  );
}

/** Rounded up to the next tenth of a cent, for numbers we advertise. Never undersell the cost. */
export function roundUpForDisplay(costPerItem: number) {
  return Math.ceil(costPerItem * 1000) / 1000;
}
