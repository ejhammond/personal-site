/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link } from 'gatsby';

export const Tag: React.FC<{ tag: string }> = ({ tag, ...delegated }) => {
  return (
    <Link
      to={`/blog/tags/${tag}`}
      sx={{
        textDecoration: 'none',
        backgroundColor: 'primary',
        color: 'background',
        fontSize: '0.75rem',
        borderRadius: '4px',
        px: 2,
        py: 1,
      }}
      {...delegated}
    >
      {tag}
    </Link>
  );
};
