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
      <Bio />
      <Link to="/blog">Blog</Link>
    </Layout>
  );
};

export default Index;
