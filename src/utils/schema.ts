import z from 'zod/v4';

/**
 * Numeric fields arrive from the inputs as numbers, but a cleared field
 * can arrive as '' (or null). z.coerce.number() would silently turn those
 * into 0, so a cleared required field would save as a bogus 0. Map empty
 * values to undefined first, so required fields fail validation instead.
 * (Nullable fields use nullableNumber below, so "cleared" stays null.)
 */
export function emptyToUndefined(value: unknown): unknown {
  return value === '' || value === null ? undefined : value;
}

export function emptyToNull(value: unknown): unknown {
  return value === '' ? null : value;
}

/** A required number field: empty input fails validation instead of becoming 0. */
export function requiredNumber(schema: z.ZodNumber) {
  return z.preprocess(emptyToUndefined, schema);
}

/** A nullable number field: empty input becomes null, not 0. */
export function nullableNumber(schema: z.ZodNumber) {
  return z.preprocess(emptyToNull, schema.nullable());
}
