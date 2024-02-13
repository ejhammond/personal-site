import { StackOptions, stack } from '@/ds/styles/stack-style';

export type VStackOptions = Omit<StackOptions, 'direction' | 'crossAlign'> &
  Readonly<{ hAlign?: StackOptions['crossAlign'] }>;

export function vStack({ hAlign, ...stackOptions }: VStackOptions): string {
  return stack({ direction: 'vertical', crossAlign: hAlign, ...stackOptions });
}
