export type Roll = {
  d4: number;
  d6: number;
  d8: number;
  d10: number;
  d12: number;
  modifier: number;
};

function singleDiceRollToString({
  value,
  qty,
}: {
  value: number;
  qty: number;
}): string | null {
  if (qty === 0) {
    return null;
  }
  return `${qty}d${value}`;
}

export function rollToString({ d4, d6, d8, d10, d12, modifier }: Roll): string {
  return [
    singleDiceRollToString({ value: 4, qty: d4 }),
    singleDiceRollToString({ value: 6, qty: d6 }),
    singleDiceRollToString({ value: 8, qty: d8 }),
    singleDiceRollToString({ value: 10, qty: d10 }),
    singleDiceRollToString({ value: 12, qty: d12 }),
    modifier,
  ]
    .filter((s) => s != null)
    .join(' + ');
}
