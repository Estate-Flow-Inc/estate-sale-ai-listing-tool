/**
 * What typical AI listing tools charge per item, as a range.
 * low: bulk credit pricing. high: advertised ~100-item packages (~$20),
 * which often bundle extras like photo enhancement.
 */
export const COMPETITOR_RATE_PER_ITEM = { low: 0.05, high: 0.2 };

/** Item counts shown in the landing page savings table. */
export const SAVINGS_TABLE_ITEM_COUNTS = [100, 250, 500] as const;
