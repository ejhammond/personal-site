/** @jsx jsx */
import { jsx, Card, Text } from 'theme-ui';
import { Link } from 'gatsby';
import { FaBookReader } from 'react-icons/fa';

import Layout from '../components/layout';
import SEO from '../components/seo';

const Index: React.FC = () => {
  return (
    <Layout>
      <SEO title="Home" />
      <h2>Welcome!</h2>
      <p>
        {
          "Ayhota is a personal space that I've carved out for myself on the internet. For now, the primary feature is my blog"
        }
      </p>
      <h2>Nav</h2>
      <nav>
        <ul sx={{ listStyleType: 'none' }}>
          <li>
            <Link to="/blog" sx={{ color: 'accent', textDecoration: 'none' }}>
              <Card sx={{ maxWidth: 250, textAlign: 'center' }}>
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
