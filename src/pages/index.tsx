/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link } from 'gatsby';
import { Redirect } from '@reach/router';
import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';

const Index: React.FC = () => {
  return (
    <Layout>
      <SEO title="Home" />
      <Bio />
      <Link to="/blog">Blog</Link>
      <Redirect noThrow to="/blog" />
    </Layout>
  );
};

export default Index;
