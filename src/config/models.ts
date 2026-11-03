/**
 * Gemini models, in fallback order, with list prices per 1M tokens (USD).
 * One model on purpose: it's the only one that tested reliable. The fallback code
 * in store/listingStore.ts still works if more are ever added. If it stays overloaded (503) or unavailable, the
 * next item rotates to the next model automatically. Users never choose.
 * Prices change: update PRICES_CHECKED_AT whenever you touch them.
 */

export type ProviderId = 'gemini';

export interface ModelOption {
  id: string;
  provider: ProviderId;
  label: string;
  inputPer1M: number;
  /** Implicitly cached input (repeated system prompt). Roughly 10% of input. */
  cachedInputPer1M: number;
  /** Output, including thinking tokens. */
  outputPer1M: number;
  /** Lowest thinking level we send. Thinking tokens bill as output. */
  thinkingLevel: 'minimal' | 'low';
  /** Extra output tokens we expect from thinking at that level, for estimates. */
  estThinkingTokens: number;
}

export const PRICES_CHECKED_AT = '2026-11-03';

export const MODELS: ModelOption[] = [
  {
    // Stable, fast, cheapest, and the most generous free daily allowance.
    // In testing it was the only model that answered reliably.
    id: 'gemini-3.1-flash-lite',
    provider: 'gemini',
    label: 'Gemini 3.1 Flash-Lite',
    inputPer1M: 0.25,
    cachedInputPer1M: 0.025,
    outputPer1M: 1.5,
    thinkingLevel: 'minimal',
    estThinkingTokens: 0,
  },
  // Tested and dropped (Nov 2026): gemini-3.5-flash-lite (timeouts), gemini-3.8-flash (503 overloaded),
  // gemini-3.7-flash (429, tiny free allowance), gemini-3.6-flash (too slow).
  // gemini-3.5-flash costs more ($1.50 / $9.00). gemini-3.1-pro-preview: no free tier.
];

export const DEFAULT_MODEL_ID = MODELS[0].id;

export function getModel(id: string): ModelOption {
  return MODELS.find((m) => m.id === id) ?? MODELS[0];
}
