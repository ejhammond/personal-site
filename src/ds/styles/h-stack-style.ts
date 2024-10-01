import { StackOptions, stack } from '@/ds/styles/stack-style';

export type HStackOptions = Omit<StackOptions, 'direction' | 'crossAlign'> &
  Readonly<{ vAlign?: StackOptions['crossAlign'] }>;

export function hStack({ vAlign, ...stackOptions }: HStackOptions): string {
  return stack({
    direction: 'horizontal',
    crossAlign: vAlign,
    ...stackOptions,
  });
}
