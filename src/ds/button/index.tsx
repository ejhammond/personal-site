'use client';

import { Button as AriaButton, ButtonProps } from 'react-aria-components';
import './index.css';

export function Button({
  variant = 'secondary',
  ...delegatedProps
}: ButtonProps & {
  variant?: 'primary' | 'secondary' | 'flat';
}) {
  return <AriaButton data-variant={variant} {...delegatedProps} />;
}
