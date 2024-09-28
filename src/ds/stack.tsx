import React from 'react';
import { StackOptions, stack } from '@/ds/styles/stack-style';

type Props = React.ComponentProps<'div'> & StackOptions;

export function Stack({
  gap,
  crossAlign,
  direction,
  display,
  wrap,
  style,
  ...htmlProps
}: Props) {
  return (
    <div
      style={{
        ...stack({ gap, crossAlign, direction, display, wrap }),
        ...style,
      }}
      {...htmlProps}
    />
  );
}
