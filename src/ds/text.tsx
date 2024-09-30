import React from 'react';

type TVariant = 'standard' | 'supporting';
type TDisplay = 'block' | 'inline';
type Props = Readonly<{
  variant?: TVariant;
  display?: TDisplay;
}> &
  React.ComponentProps<'span'>;

const variantStyles: Record<TVariant, React.CSSProperties> = {
  standard: {},
  supporting: {
    color: 'var(--text-color-secondary)',
    fontSize: '14px',
  },
};

const displayStyles: Record<TDisplay, React.CSSProperties> = {
  block: { display: 'block' },
  inline: { display: 'inline' },
};

export function Text({
  variant = 'standard',
  display = 'block',
  style,
  ...htmlProps
}: Props) {
  return (
    <span
      style={{ ...variantStyles[variant], ...displayStyles[display], ...style }}
      {...htmlProps}
    />
  );
}
