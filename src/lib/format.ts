const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const usdSmall = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 4,
});

/** $1,234.56, or up to 4 decimals for sub-cent amounts ($0.0007). */
export function formatUsd(value: number) {
  return value > 0 && value < 0.01 ? usdSmall.format(value) : usd.format(value);
}

export function formatCount(value: number) {
  return value.toLocaleString('en-US');
}

/** 512 KB, 2.4 MB */
export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** $2.20 to $8.80 */
export function formatUsdRange(low: number, high: number) {
  return `${formatUsd(low)} to ${formatUsd(high)}`;
}

const usdWhole = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** $120. For resale values and shipping, where cents are false precision. */
export function formatUsdWhole(value: number) {
  return usdWhole.format(value);
}

/** 72 × 18 × 30 in (missing sides dropped). Null if nothing is known. */
export function formatDimensions(w: number | null, d: number | null, h: number | null) {
  const parts = [w, d, h].filter((n): n is number => typeof n === 'number' && n > 0);
  return parts.length ? `${parts.map((n) => Math.round(n)).join(' × ')} in` : null;
}
