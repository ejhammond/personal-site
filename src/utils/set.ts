/**
 * Utils for working with Readonly Sets
 */

export function addToSet<T>(set: ReadonlySet<T>, item: T): ReadonlySet<T> {
  const next = new Set(set);
  next.add(item);
  return next;
}

export function removeFromSet<T>(set: ReadonlySet<T>, item: T): ReadonlySet<T> {
  const next = new Set(set);
  next.delete(item);
  return next;
}

export function addAllToSet<T>(
  set1: ReadonlySet<T>,
  set2: ReadonlySet<T>,
): ReadonlySet<T> {
  return mergeSets(set1, set2);
}

export function removeAllFromSet<T>(
  set1: ReadonlySet<T>,
  set2: ReadonlySet<T>,
): ReadonlySet<T> {
  return new Set([...Array.from(set1).filter((i) => !set2.has(i))]);
}

export function mergeSets<T>(
  ...sets: ReadonlyArray<ReadonlySet<T>>
): ReadonlySet<T> {
  const agg = new Set<T>();
  for (const set of sets) {
    for (const item of set) {
      agg.add(item);
    }
  }
  return agg;
}

/**
 * Returns a new set containing the values that appear in all of the given sets
 */
export function unionSets<T>(
  ...sets: ReadonlyArray<ReadonlySet<T>>
): ReadonlySet<T> {
  if (sets.length === 0) {
    return new Set();
  }

  if (sets.length === 1) {
    return new Set(sets[0]);
  }

  const unionSet = new Set<T>();

  const [set1, ...otherSets] = sets;

  for (const item of set1) {
    if (otherSets.every((set) => set.has(item))) {
      unionSet.add(item);
    }
  }

  return unionSet;
}

/**
 * Compares 2 sets and returns all items that only appear in one set, discarding
 * any items that appear in both.
 */
export function diffSets<T>(
  set1: ReadonlySet<T>,
  set2: ReadonlySet<T>,
): ReadonlySet<T> {
  const mergedSet = new Set(mergeSets(set1, set2));
  const unionSet = unionSets(set1, set2);

  for (const item of unionSet) {
    mergedSet.delete(item);
  }

  return mergedSet;
}

export function areSetsEqual<T>(
  ...sets: ReadonlyArray<ReadonlySet<T>>
): boolean {
  if (sets.length <= 1) {
    return true;
  }
  const [set1, ...otherSets] = sets;

  // make sure all sets are the same size
  if (otherSets.some((set) => set.size !== set1.size)) {
    return false;
  }

  // make sure all sets contain every item
  return Array.from(set1).every((item) =>
    otherSets.every((set) => set.has(item)),
  );
}
