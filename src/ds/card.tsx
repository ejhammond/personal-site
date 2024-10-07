import cx from '@/utils/cx';
import React, { CSSProperties } from 'react';

import './card.css';

type Props = Readonly<{
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}>;

export function Card({ children, className, style, header, footer }: Props) {
  return (
    <div className={cx('card', className)} style={style}>
      {header != null && <div className="header">{header}</div>}
      <div className="content">{children}</div>
      {footer != null && <div>{footer}</div>}
    </div>
  );
}
