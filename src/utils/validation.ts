type ValidResult<TOut> = {
  isValid: true;
  value: TOut;
};
type InvalidResult = {
  isValid: false;
  error: string;
};
export type Validator<TIn, TOut> = (
  value: TIn,
  context: {
    valid: (value: TOut) => ValidResult<TOut>;
    invalid: (error: string) => InvalidResult;
  },
) => ValidResult<TOut> | InvalidResult;

type AnyValidators = { [key: string]: Validator<unknown, unknown> };

type Errors<TValidators extends AnyValidators> = {
  [K in keyof TValidators]: string | null;
};
type Values<TValidators extends AnyValidators> = {
  [K in keyof TValidators]: TValidators[K] extends Validator<infer TIn, unknown>
    ? TIn
    : never;
};
type ValidValues<TValidators extends AnyValidators> = {
  [K in keyof TValidators]: TValidators[K] extends Validator<
    unknown,
    infer TOut
  >
    ? TOut
    : never;
};

function valid<TOut>(value: TOut): ValidResult<TOut> {
  return {
    isValid: true,
    value,
  };
}

function invalid(error: string): InvalidResult {
  return {
    isValid: false,
    error,
  };
}

export function runValidator<TIn, TOut>(
  validator: Validator<TIn, TOut>,
  value: TIn,
): ValidResult<TOut> | InvalidResult {
  return validator(value, { valid, invalid });
}

export function runValidators<TValidators extends AnyValidators>(
  validators: TValidators,
  values: Values<TValidators>,
):
  | {
      isValid: true;
      values: ValidValues<TValidators>;
    }
  | { isValid: false; errors: Errors<TValidators> } {
  let isValid = true;
  const validValues: Partial<ValidValues<TValidators>> = {};
  const errors: Partial<Errors<TValidators>> = {};

  for (const [key, validator] of Object.entries(validators)) {
    const result = runValidator(validator, values[key]);
    if (result.isValid) {
      // @ts-expect-error we are building a map
      validValues[key as keyof TValidators] = result.value;
      errors[key as keyof TValidators] = null;
    } else {
      errors[key as keyof TValidators] = result.error;
      isValid = false;
    }
  }

  if (isValid) {
    return {
      isValid,
      values: validValues as ValidValues<TValidators>,
    };
  } else {
    return {
      isValid,
      errors: errors as Errors<TValidators>,
    };
  }
}
