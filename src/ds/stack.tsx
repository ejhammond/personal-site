import React from 'react';
import { StackOptions, stack } from '@/ds/styles/stack-style';

type Props = React.ComponentProps<'div'> & StackOptions;

export function Stack({
  gap,
  crossAlign,
  direction,
  display,
  wrap,
  className,
  ...htmlProps
}: Props) {
  return (
    <div
      className={[
        stack({ gap, crossAlign, direction, display, wrap }),
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...htmlProps}
    />
  );
}
