/** @jsx jsx */
import { jsx } from 'theme-ui';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';
import { FaTwitter } from 'react-icons/fa';
import { Link } from './link';

export const Bio: React.FC = () => {
  const { avatar, site } = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpeg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            twitter
          }
        }
      }
    }
  `);

  const { author } = site.siteMetadata;

  return (
    <div sx={{ display: 'flex', alignItems: 'center' }}>
      <Image
        fixed={avatar.childImageSharp.fixed}
        alt={author.name}
        sx={{
          mb: 0,
          mr: 3,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <div>
        <p sx={{ my: 0 }}>
          <strong sx={{ mr: 1 }}>{author.name}</strong>
          <Link
            to={`https://twitter.com/${author.twitter}`}
            sx={{ display: 'inline-flex', alignItems: 'baseline' }}
          >
            <FaTwitter size="0.8em" sx={{ mr: 1 }} />
            {author.twitter}
          </Link>
        </p>
        <p sx={{ my: 0 }}>
          <span sx={{ mr: 1 }}>is a Boston-based web dev who writes code at</span>{' '}
          <Link
            to="https://twitter.com/facebook"
            sx={{ display: 'inline-flex', alignItems: 'baseline' }}
          >
            <FaTwitter size="0.8em" sx={{ mr: 1 }} />
            facebook
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
