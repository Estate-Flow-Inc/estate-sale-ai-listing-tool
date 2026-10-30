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
