/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link, useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { useLocation } from '@reach/router';

const Slash: React.FC = () => (
  <span aria-hidden sx={{ px: 2 }}>
    /
  </span>
);

const Breadcrumbs: React.FC = () => {
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

const Header: React.FC = () => {
  const { logo, site } = useStaticQuery(graphql`
    query HeaderQuery {
      logo: file(absolutePath: { regex: "/ayhota-logo.png/" }) {
        childImageSharp {
          fixed(width: 48, height: 48) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <header>
      <div sx={{ backgroundColor: 'primary', color: 'white' }}>
        <div sx={{ maxWidth: '900px', mx: 'auto', mb: 3, py: 3 }}>
          <h1
            sx={{
              margin: 0,
              color: 'inherit',
              fontSize: 4,
            }}
          >
            <Link
              style={{
                textDecoration: `none`,
                color: `inherit`,

                display: 'flex',
                alignItems: 'center',
              }}
              to="/"
            >
              <Img
                fixed={logo.childImageSharp.fixed}
                alt="Ayhota"
                sx={{ height: 48, width: 48, mr: 2 }}
              />
              {site.siteMetadata.title}
            </Link>
          </h1>
        </div>
      </div>
      <div sx={{ maxWidth: '900px', mx: 'auto' }}>
        <Breadcrumbs />
      </div>
    </header>
  );
};
export default Header;
