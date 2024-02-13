import React from 'react';
import { css, cx } from '@/panda/css';

type TVariant = 'standard' | 'supporting' | 'display';
type TDisplay = 'block' | 'inline';
type Props = Readonly<{
  variant?: TVariant;
  display?: TDisplay;
}> &
  React.ComponentProps<'span'>;

const variantStyles: Record<TVariant, string> = {
  standard: css({
    color: 'text-primary',
  }),
  supporting: css({
    color: 'text-secondary',
    fontSize: 'sm',
  }),
  display: css({
    color: 'text-primary',
    fontSize: '2xl',
  }),
};

const displayStyles: Record<TDisplay, string> = {
  block: css({ display: 'block' }),
  inline: css({ display: 'inline' }),
};

export function Text({
  variant = 'standard',
  display = 'block',
  className,
  ...htmlProps
}: Props) {
  return (
    <span
      className={cx(variantStyles[variant], displayStyles[display], className)}
      {...htmlProps}
    />
  );
}
