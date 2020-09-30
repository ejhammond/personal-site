/** @jsx jsx */
import { Card, Text, jsx } from 'theme-ui';
import { Link } from 'gatsby';
import { FaNewspaper, FaTags, FaFolderOpen } from 'react-icons/fa';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import { Breadcrumbs } from '../../components/breadcrumbs';

const BlogIndex: React.FC = () => {
  return (
    <Layout>
      <SEO title="All articles" />
      <Breadcrumbs />
      <h2>Browse</h2>
      <ul sx={{ listStyleType: 'none' }}>
        <li sx={{ mb: 3 }}>
          <Link to="articles" sx={{ color: 'accent', textDecoration: 'none' }}>
            <Card sx={{ maxWidth: 250, textAlign: 'center' }}>
              <FaNewspaper size={50} />
              <Text>By Article</Text>
            </Card>
          </Link>
        </li>
        <li sx={{ mb: 3 }}>
          <Link to="series" sx={{ color: 'accent', textDecoration: 'none' }}>
            <Card sx={{ maxWidth: 250, textAlign: 'center' }}>
              <FaFolderOpen size={50} />
              <Text>By Series</Text>
            </Card>
          </Link>
        </li>
        <li>
          <Link to="tags" sx={{ color: 'accent', textDecoration: 'none' }}>
            <Card sx={{ maxWidth: 250, textAlign: 'center' }}>
              <FaTags size={50} />
              <Text>By Tag</Text>
            </Card>
          </Link>
        </li>
      </ul>
    </Layout>
  );
};

export default BlogIndex;
