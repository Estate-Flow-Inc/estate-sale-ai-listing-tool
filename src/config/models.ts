/**
 * AI models offered in the picker, with list prices per 1M tokens (USD).
 * Prices change: update PRICES_CHECKED_AT whenever you touch them.
 * Only vision-capable models belong here.
 */

export type ProviderId = 'openai' | 'anthropic' | 'gemini';

export interface ModelOption {
  id: string;
  provider: ProviderId;
  label: string;
  inputPer1M: number;
  /** Repeated prompt prefixes (system prompt + schema) the provider cached. */
  cachedInputPer1M: number;
  outputPer1M: number;
}

export const PRICES_CHECKED_AT = '2026-10-30';

export const MODELS: ModelOption[] = [
  // https://developers.openai.com/api/docs/models/gpt-5.6-luna
  { id: 'gpt-5.6-luna', provider: 'openai', label: 'GPT-5.6 Luna', inputPer1M: 0.2, cachedInputPer1M: 0.02, outputPer1M: 1.2 },
  { id: 'gpt-5.4-mini', provider: 'openai', label: 'GPT-5.4 mini', inputPer1M: 0.75, cachedInputPer1M: 0.075, outputPer1M: 4.5 },
  { id: 'gpt-5.6-terra', provider: 'openai', label: 'GPT-5.6 Terra', inputPer1M: 2, cachedInputPer1M: 0.2, outputPer1M: 12 },
];

export const DEFAULT_MODEL_ID = 'gpt-5.6-luna';

export function getModel(id: string): ModelOption {
  return MODELS.find((m) => m.id === id) ?? MODELS.find((m) => m.id === DEFAULT_MODEL_ID)!;
}
