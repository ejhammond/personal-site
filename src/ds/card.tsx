import cx from '@/utils/cx';
import React from 'react';

import './card.css';

type Props = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export function Card({ children, className }: Props) {
  return <div className={cx('card', className)}>{children}</div>;
}
