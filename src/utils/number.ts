export function formatPercent(value: number, fractionDigits: number): string {
  return Intl.NumberFormat([], {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
  }).format(value);
}
