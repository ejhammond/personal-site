import cx from '@/utils/cx';

import './index.css';

export default function StatusMessage({
  message,
  variant,
  className,
  ...htmlProps
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  message: string;
  variant: 'info' | 'error';
}) {
  return (
    <div
      {...htmlProps}
      role="status"
      aria-live="polite"
      className={cx(
        'ds-status-message',
        `ds-status-message-${variant}`,
        className,
      )}
    >
      {message}
    </div>
  );
}
