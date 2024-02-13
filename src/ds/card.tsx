import { css, cx } from '@/panda/css';
import { SystemStyleObject } from '@/panda/types';
import React from 'react';

type Props = Readonly<{
  children: React.ReactNode;
  css?: SystemStyleObject;
}>;

export function Card({ children, css: cssOverride }: Props) {
  return (
    <div
      className={cx(
        css({
          backgroundColor: 'bg-layer',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'border',
          padding: 'lg',
          boxShadow: 'sm',
          borderRadius: 'md',
          ...cssOverride,
        }),
      )}
    >
      {children}
    </div>
  );
}
