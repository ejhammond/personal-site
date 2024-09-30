import React from 'react';

type Props = Readonly<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}>;

export function Card({ children, style }: Props) {
  return (
    <div
      style={{
        backgroundColor: 'var(--overlay-background)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--border-color)',
        padding: '32px',
        boxShadow: '0 8px 20px rgba(0 0 0 / 0.1)',
        borderRadius: '6px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
