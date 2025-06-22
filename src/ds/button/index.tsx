'use client';

import { Button as AriaButton, ButtonProps } from 'react-aria-components';
import './index.css';
import cx from '@/utils/cx';

export function Button({
  variant = 'secondary',
  children,
  cornerIndicator,
  isToggled = false,
  ...delegatedProps
}: ButtonProps & {
  variant?: 'primary' | 'secondary' | 'flat' | 'danger';
  cornerIndicator?: {
    type: 'error';
    label: string;
  };
  isToggled?: boolean;
}) {
  return (
    <AriaButton
      data-toggled={isToggled}
      data-variant={variant}
      {...delegatedProps}
    >
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
