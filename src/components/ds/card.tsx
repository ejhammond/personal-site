import { css, cx } from '@/panda/css';
import React from 'react';

type Props = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export function Card({ children, className }: Props) {
  return (
    <div
      className={cx(
        css({
          backgroundColor: 'bg-layer',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'border',
          padding: 'sm',
          boxShadow: 'sm',
          borderRadius: 'md',
        }),
        className,
      )}
    >
      {children}
    </div>
  );
}
