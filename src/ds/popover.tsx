import { Popover as RACPopover } from 'react-aria-components';
import React from 'react';
import { Card } from './card';
import { css } from '@/panda/css';

type Props = Readonly<{
  children: React.ReactNode;
}>;

export function Popover({ children }: Props) {
  return (
    <RACPopover>
      <Card css={{ p: 'sm' }}>{children}</Card>
    </RACPopover>
  );
}
