'use client';

import { NumberInput } from '@astryxdesign/core/NumberInput';
import { formatUSD } from '@/utils/currency';

/**
 * Currency input, mirroring the old ds CurrencyField: a number input with a
 * minimum of 0, displayed as USD with cents.
 */
export function CurrencyInput({
  label,
  description,
  value,
  onChange,
  isRequired,
  htmlName,
}: {
  label: string;
  description?: string;
  value: number | null;
  onChange: (value: number) => void;
  isRequired?: boolean;
  htmlName?: string;
}) {
  return (
    <NumberInput
      label={label}
      description={description}
      value={value}
      onChange={onChange}
      min={0}
      formatValue={(amount) => formatUSD(amount, { showCents: true })}
      isRequired={isRequired}
      htmlName={htmlName}
    />
  );
}
