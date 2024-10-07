export function formatPercent(value: number, fractionDigits: number): string {
  return Intl.NumberFormat([], {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatCompact(number: number): string {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number);
}
