/** @jsx jsx */
import { jsx } from 'theme-ui';

export const BoundedContent: React.FC = (props) => {
  return <div sx={{ maxWidth: 900, mx: 'auto', px: 3 }} {...props} />;
};
