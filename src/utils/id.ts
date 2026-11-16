export type WithID<T> = T & {
  id: string;
};

export function createUniqueID(): string {
  return crypto.randomUUID();
}

/**
 * Parse a database id from a string id. Only all-digit strings are real
 * ids; anything else is a client-side placeholder (see createUniqueID)
 * for an item that hasn't been saved yet, and must never reach the
 * database — parseInt would silently turn e.g. '3f8a…' into 3, targeting
 * a different row entirely.
 */
export function parseDBID(id: string): number | null {
  return /^\d+$/.test(id) ? Number(id) : null;
}
