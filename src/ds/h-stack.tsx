import { Stack } from '@/ds/stack';
import React from 'react';

type StackProps = React.ComponentProps<typeof Stack>;
type Props = Omit<StackProps, 'direction' | 'crossAlign'> &
  Readonly<{ vAlign?: StackProps['crossAlign'] }>;

export function HStack({ vAlign, ...stackProps }: Props) {
  return <Stack direction="horizontal" crossAlign={vAlign} {...stackProps} />;
}
