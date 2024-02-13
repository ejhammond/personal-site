import { Popover as RACPopover } from 'react-aria-components';
import React from 'react';
import { Card } from './card';

type Props = Readonly<{
  children: React.ReactNode;
}>;

export function Popover({ children }: Props) {
  return (
    <RACPopover>
      <Card>{children}</Card>
    </RACPopover>
  );
}
