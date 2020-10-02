/** @jsx jsx */
import { jsx, Card, Text } from 'theme-ui';
import { graphql } from 'gatsby';
import { FaBookReader } from 'react-icons/fa';
import Image, { FixedObject } from 'gatsby-image';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { Link } from '../components/link';

export const pageQuer = graphql`
  query {
    avatar: file(absolutePath: { regex: "/profile-pic.jpeg/" }) {
      childImageSharp {
        fixed(width: 75, height: 75) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;

type Props = {
  data: {
    avatar: { childImageSharp: { fixed: FixedObject } };
  };
};

const Index: React.FC<Props> = (props) => {
  const { data } = props;
  console.log(data);
  return (
    <Layout>
      <SEO title="Home" />
      <h2>Welcome!</h2>
      <div sx={{ display: 'flex' }}>
        <Image fixed={data.avatar.childImageSharp.fixed} sx={{ borderRadius: '50%', mr: 3 }} />
        <p>
          <i sx={{ fontSize: 2 }}>{"Hi! My name's EJ. Glad to have you here!"}</i>
        </p>
      </div>
      <p>
        {
          "Ayhota.com is a small space that I've carved out for myself on the internet. Check out the blog page to see some of the things that I've been writing about!"
        }
      </p>
      <h2>Where to next?</h2>
      <nav>
        <ul sx={{ listStyleType: 'none', pl: [0, 4] }}>
          <li>
            <Link to="/blog">
              <Card sx={{ width: ['100%', '50%'], textAlign: 'center', display: 'inline-block' }}>
                <FaBookReader size={50} />
                <Text sx={{ fontSize: 2 }}>Blog</Text>
              </Card>
            </Link>
          </li>
        </ul>
      </nav>
    </Layout>
  );
};

export default Index;
