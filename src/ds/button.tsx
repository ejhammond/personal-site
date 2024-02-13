import { css, cx } from '@/panda/css';
import { Button as RACButton } from 'react-aria-components';

type TVariant = 'none' | 'primary' | 'secondary' | 'flat';
type Props = Readonly<{
  variant: TVariant;
  className?: string;
  children: React.ReactNode;
}> &
  React.ComponentProps<typeof RACButton>;

const styles: Record<TVariant, string> = {
  primary: css({
    color: 'text-primary',
    backgroundColor: 'primary',
    p: 'sm',
    cursor: 'pointer',
  }),
  secondary: css({
    p: 'sm',
    cursor: 'pointer',
  }),
  flat: css({
    color: 'text-primary',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: 'md',
    borderColor: 'border',
    p: 'sm',
    cursor: 'pointer',
  }),
  none: css({}),
};

export function Button({ variant, className, ...delegated }: Props) {
  return (
    <RACButton {...delegated} className={cx(styles[variant], className)} />
  );
}
