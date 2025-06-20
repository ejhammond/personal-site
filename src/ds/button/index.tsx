'use client';

import { Button as AriaButton, ButtonProps } from 'react-aria-components';
import './index.css';
import cx from '@/utils/cx';

export function Button({
  variant = 'secondary',
  children,
  cornerIndicator,
  ...delegatedProps
}: ButtonProps & {
  variant?: 'primary' | 'secondary' | 'flat';
  cornerIndicator?: {
    type: 'error';
    label: string;
  };
}) {
  return (
    <AriaButton data-variant={variant} {...delegatedProps}>
      {(...args) => (
        <>
          {typeof children === 'function' ? children(...args) : children}
          {cornerIndicator != null && (
            <span
              className={cx(
                'corner-indicator',
                cornerIndicator.type === 'error' && 'corner-indicator-error',
              )}
              aria-label={cornerIndicator.label}
            />
          )}
        </>
      )}
    </AriaButton>
  );
}
