/** @jsx jsx */
import { jsx } from 'theme-ui';

export const Tag: React.FC = ({ children, ...delegated }) => {
  return (
    <div
      sx={{
        backgroundColor: 'primary',
        color: 'background',
        fontSize: '0.75rem',
        borderRadius: '4px',
        px: 2,
        py: 1,
      }}
      {...delegated}
    >
      {children}
    </div>
  );
};
