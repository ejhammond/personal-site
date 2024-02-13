import React from 'react';
import { StackOptions, stack } from '@/ds/styles/stack-style';

type Props = Readonly<{
  children: React.ReactNode;
}> &
  StackOptions;

export function Stack({ children, ...stackOptions }: Props) {
  return <div className={stack(stackOptions)}>{children}</div>;
}
