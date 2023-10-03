'use client';

import React from 'react';
import { css } from '@/panda/css';
import { Button } from '@/components/ds/button';
import { Label } from 'react-aria-components';
import { Card } from './card';

type Props = Readonly<{
  label: string;
  value: number;
  onChange: (count: number) => void;
  min?: number;
  max?: number;
}>;

export function Counter({
  label,
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
}: Props) {
  return (
    <div>
      <Label className={css({ display: 'block', mb: 'sm' })}>{label}</Label>
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: 'sm',
        })}
      >
        <Button
          aria-label="Decrement"
          className={css({ width: 40 })}
          variant="flat"
          onPress={() => {
            const next = value - 1;
            if (next >= min) {
              onChange(next);
            }
          }}
        >
          <span aria-hidden>-</span>
        </Button>
        <Card
          className={css({
            width: 40,
            display: 'flex',
            justifyContent: 'center',
          })}
        >
          {value}
        </Card>
        <Button
          aria-label="Increment"
          className={css({ width: 40 })}
          variant="flat"
          onPress={() => {
            const next = value + 1;
            if (next <= max) {
              onChange(next);
            }
          }}
        >
          <span aria-hidden>+</span>
        </Button>
      </div>
    </div>
  );
}
