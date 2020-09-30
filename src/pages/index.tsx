/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link } from 'gatsby';
import Bio from '../components/bio';
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
        <ul sx={{ fontSize: 2 }}>
          <li>
            <Link to="/blog" sx={{ color: 'accent', textDecoration: 'none' }}>
              Blog
            </Link>
          </li>
        </ul>
      </nav>
      <hr sx={{ my: 4 }} />
      <Bio />
    </Layout>
  );
};

export default Index;
