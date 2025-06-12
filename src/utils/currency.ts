export function formatUSD(
  value: number,
  options: { showCents: boolean } = { showCents: false },
): string {
  return Intl.NumberFormat([], {
    style: 'currency',
    currencySign: 'standard',
    currency: 'USD',
    currencyDisplay: 'symbol',
    maximumFractionDigits: options.showCents ? 2 : 0,
  }).format(value);
}

export function roundCurrency(number: number) {
  return parseFloat(Math.round(parseFloat(number + 'e+2')) + 'e-2');
}
