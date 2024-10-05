export function formatUSD(value: number): string {
  return Intl.NumberFormat([], {
    style: 'currency',
    currencySign: 'standard',
    currency: 'USD',
    currencyDisplay: 'symbol',
  }).format(value);
}

export function roundCurrency(number: number) {
  return parseFloat(Math.round(parseFloat(number + 'e+2')) + 'e-2');
}
