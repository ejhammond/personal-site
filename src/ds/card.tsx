import cx from '@/utils/cx';
import React, { CSSProperties } from 'react';

import './card.css';

type Props = Readonly<{
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}>;

export function Card({ children, className, style }: Props) {
  return (
    <div className={cx('card', className)} style={style}>
      {children}
    </div>
  );
}
