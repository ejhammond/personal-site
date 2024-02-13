import React from 'react';
import { StackOptions, stack } from '@/ds/styles/stack-style';
import { cx } from '@/panda/css';

type Props = React.ComponentProps<'div'> & StackOptions;

export function Stack({
  className,
  gap,
  crossAlign,
  direction,
  display,
  ...htmlProps
}: Props) {
  return (
    <div
      className={cx(stack({ gap, crossAlign, direction, display }), className)}
      {...htmlProps}
    />
  );
}
