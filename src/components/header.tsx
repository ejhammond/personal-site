/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link, useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

import { BoundedContent } from './bounded-content';

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
      <div sx={{ backgroundColor: 'primary', color: 'white', py: 3 }}>
        <BoundedContent>
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
        </BoundedContent>
      </div>
    </header>
  );
};
export default Header;
