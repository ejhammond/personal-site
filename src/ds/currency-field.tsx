import { forwardRef } from 'react';
import { NumberField, NumberFieldProps } from './number-field';

export const CurrencyField = forwardRef<
  HTMLInputElement,
  Omit<NumberFieldProps, 'formatOptions' | 'minValue'> & {
    granularity?: 'dollar' | 'cent';
  }
>(({ granularity = 'cent', ...delegatedProps }, ref) => {
  return (
    <NumberField
      {...delegatedProps}
      ref={ref}
      minValue={0}
      formatOptions={{
        style: 'currency',
        currencySign: 'standard',
        currency: 'USD',
        currencyDisplay: 'symbol',
        maximumFractionDigits: granularity === 'cent' ? 2 : 0,
      }}
    />
  );
});

CurrencyField.displayName = 'CurrencyField';
