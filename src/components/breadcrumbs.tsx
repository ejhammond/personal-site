/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link } from 'gatsby';
import { useLocation } from '@reach/router';

const Slash: React.FC = () => (
  <span aria-hidden sx={{ px: 2 }}>
    /
  </span>
);

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();

  // get all parts; remove any empty strings; remove the last entry (current page)
  const pathParts = location.pathname.split('/').filter(Boolean);
  const previousParts = pathParts.slice(0, -1);
  const currentPart = pathParts.slice(-1)[0];

  const breadcrumbs =
    currentPart !== undefined
      ? [
          <li key="ayhota">
            <Link to="/" sx={{ color: 'accent', textDecoration: 'none' }}>
              Ayhota
            </Link>
          </li>,
        ]
      : [];

  for (let i = 0; i < previousParts.length; ++i) {
    const part = previousParts[i];
    const url = '/' + previousParts.slice(0, i + 1).join('/');

    breadcrumbs.push(<Slash key={`slash-${part}`} />);

    breadcrumbs.push(
      <li key={part}>
        <Link to={url} sx={{ color: 'accent', textDecoration: 'none' }}>
          {part}
        </Link>
      </li>,
    );
  }

  if (currentPart !== undefined) {
    breadcrumbs.push(<Slash key={`slash-${currentPart}`} />);

    breadcrumbs.push(<li key={currentPart}>{currentPart}</li>);
  }

  return <ul sx={{ listStyleType: 'none', pl: 0, display: 'flex' }}>{breadcrumbs}</ul>;
};
