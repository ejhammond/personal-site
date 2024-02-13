import { Stack } from '@/ds/stack';
import React from 'react';

type StackProps = React.ComponentProps<typeof Stack>;
type Props = Omit<StackProps, 'direction' | 'crossAlign'> &
  Readonly<{ hAlign?: StackProps['crossAlign'] }>;

export function VStack({ hAlign, ...stackProps }: Props) {
  return <Stack direction="vertical" crossAlign={hAlign} {...stackProps} />;
}
