'use client';

import React from 'react';
import { NumberField } from './number-field';

type Props = Readonly<{
  label: string;
  value: number;
  onChange: (count: number) => void;
  min?: number;
  max?: number;
  style?: React.CSSProperties;
}>;

export function Counter({ label, value, onChange, min, max, style }: Props) {
  return (
    <NumberField
      style={{ maxWidth: 150, ...style }}
      hasButtons={true}
      label={label}
      value={value}
      onChange={onChange}
      minValue={min}
      maxValue={max}
    />
  );
}
