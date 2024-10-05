import { Button as AriaButton, ButtonProps } from 'react-aria-components';
import './index.css';

export function Button({
  variant = 'primary',
  ...delegatedProps
}: ButtonProps & { variant?: 'primary' | 'flat' }) {
  return <AriaButton data-variant={variant} {...delegatedProps} />;
}
