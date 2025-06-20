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

export function arrayToMap<T>(
  array: T[],
  getID: (item: T) => string,
): ReadonlyMap<string, T> {
  return new Map(array.map((item) => [getID(item), item]));
}

export function mapToArray<TKey, TValue>(
  map: ReadonlyMap<TKey, TValue>,
  sortFn: (a: TKey, b: TKey) => number = (aID, bID) => {
    if (typeof aID === 'number' && typeof bID === 'number') {
      return aID - bID;
    }
    return String(aID).localeCompare(String(bID));
  },
): TValue[] {
  return Array.from(map.entries())
    .toSorted(([aKey], [bKey]) => sortFn(aKey, bKey))
    .map(([, value]) => value);
}
