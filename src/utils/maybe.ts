interface IMaybe<TValue> {
  readonly exists: boolean;

  /**
   * Unwraps the value or throws new Error(msg).
   */
  orThrow(msg: string): TValue;

  /**
   * Unwraps the value or returns the fallback.
   */
  or<TFallback>(fallback: TFallback): TValue | TFallback;

  /**
   * Maps the value or leaves None.
   */
  map<TMapped>(mapper: (value: TValue) => TMapped): IMaybe<TMapped>;
}

class Not implements IMaybe<never> {
  readonly exists: false;

  constructor() {
    this.exists = false;
  }

  orThrow(msg: string): never {
    throw new Error(msg);
  }

  or<TFallback>(fallback: TFallback) {
    return fallback;
  }

  map<TMapped>(_mapper: (value: never) => TMapped): Not {
    return Maybe.not;
  }
}

/**
 * Option with some value.
 */
class Is<TValue> implements IMaybe<TValue> {
  readonly exists: true;
  readonly value: TValue;

  constructor(value: TValue) {
    this.exists = true;
    this.value = value;
  }

  orThrow(_msg: string): TValue {
    return this.value;
  }

  or<TFallback>(_fallback: TFallback): TValue {
    return this.value;
  }

  map<TMapped>(mapper: (val: TValue) => TMapped): Is<TMapped> {
    return new Is(mapper(this.value));
  }
}

export namespace Maybe {
  export function is<TValue>(value: TValue): Is<TValue> {
    return new Is(value);
  }

  export const not = new Not();

  export function fromNullish<TValue>(
    value: TValue | null | undefined,
  ): Maybe<TValue> {
    return value != null ? is(value) : not;
  }

  export function fromPredicate<TValue>(
    value: TValue,
    predicate: (value: TValue) => boolean,
  ): Maybe<TValue> {
    return predicate(value) ? is(value) : not;
  }

  export function fromCatch<TValue>(fn: () => TValue) {
    try {
      return is(fn());
    } catch {
      return not;
    }
  }

  export async function fromPromise<TValue>(
    promise: Promise<TValue>,
  ): Promise<Maybe<TValue>> {
    try {
      return new Is(await promise);
    } catch (_error) {
      return new Not();
    }
  }
}

export type Maybe<TValue> = Is<TValue> | Not;
