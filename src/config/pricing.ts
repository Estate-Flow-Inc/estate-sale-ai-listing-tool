/**
 * Comparison numbers for the landing page.
 *
 * TYPICAL_AI_TOOL_RATE_PER_ITEM: effective per-item price of popular estate sale
 * AI add-ons (e.g. $35/mo for ~500 lots). Revisit when competitors change pricing.
 */
export const TYPICAL_AI_TOOL_RATE_PER_ITEM = 0.07;

/** Item counts shown in the savings table. */
export const SAVINGS_TABLE_ITEM_COUNTS = [100, 500, 1000] as const;

/**
 * Estimated OpenAI cost per item with the default model (one photo per item).
 * Temporary: the API layer step derives this from the provider's model pricing.
 */
export const DEFAULT_MODEL_LABEL = 'GPT-5.6 Luna';
export const DEFAULT_COST_PER_ITEM = 0.0007;
