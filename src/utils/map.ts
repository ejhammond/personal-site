/**
 * Utils for working with Readonly Maps
 */

export function setInMap<TKey, TValue>(
  map: ReadonlyMap<TKey, TValue>,
  key: TKey,
  item: TValue,
): ReadonlyMap<TKey, TValue> {
  const next = new Map(map);
  next.set(key, item);
  return next;
}

export function removeFromMap<TKey, TValue>(
  map: ReadonlyMap<TKey, TValue>,
  key: TKey,
): ReadonlyMap<TKey, TValue> {
  const next = new Map(map);
  next.delete(key);
  return next;
}

export function sortMap<TKey, TValue>(
  map: ReadonlyMap<TKey, TValue>,
  compareFn: (a: TValue, b: TValue) => number,
) {
  return new Map(
    Array.from(map.entries()).toSorted(([, a], [, b]) => compareFn(a, b)),
  );
}
