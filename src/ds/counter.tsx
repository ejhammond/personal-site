'use client';

import React from 'react';
import { NumberField } from './number-field';

type Props = Readonly<{
  label: string;
  value: number;
  onChange: (count: number) => void;
  min?: number;
  max?: number;
}>;

export function Counter({ label, value, onChange, min, max }: Props) {
  return (
    <NumberField
      label={label}
      value={value}
      onChange={onChange}
      minValue={min}
      maxValue={max}
    />
  );
}
