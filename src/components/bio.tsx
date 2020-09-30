/** @jsx jsx */
import { jsx } from 'theme-ui';
import { graphql, useStaticQuery } from 'gatsby';
import Image from 'gatsby-image';

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
          <strong>{author.name}</strong> (
          <a
            href={`https://twitter.com/${author.twitter}`}
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            {author.twitter}
          </a>
          )
        </p>
        <p sx={{ my: 0 }}>
          Boston-based web dev who writes code at{' '}
          <a
            href={`https://twitter.com/facebook`}
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            @facebook
          </a>
          .
        </p>
      </div>
    </div>
  );
};
