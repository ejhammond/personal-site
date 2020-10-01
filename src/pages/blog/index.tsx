/** @jsx jsx */
import { Card, Text, jsx } from 'theme-ui';
import { FaNewspaper, FaTags, FaFolderOpen } from 'react-icons/fa';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import { Breadcrumbs } from '../../components/breadcrumbs';
import { Link } from '../../components/link';

const BlogIndex: React.FC = () => {
  return (
    <Layout>
      <SEO title="All articles" />
      <Breadcrumbs />
      <h2>Browse</h2>
      <ul sx={{ listStyleType: 'none', pl: [0, 4] }}>
        <li sx={{ mb: 3 }}>
          <Link to="articles">
            <Card sx={{ width: ['100%', '50%'], textAlign: 'center', display: 'inline-block' }}>
              <FaNewspaper size={50} />
              <Text>By Article</Text>
            </Card>
          </Link>
        </li>
        <li sx={{ mb: 3 }}>
          <Link to="series">
            <Card sx={{ width: ['100%', '50%'], textAlign: 'center', display: 'inline-block' }}>
              <FaFolderOpen size={50} />
              <Text>By Series</Text>
            </Card>
          </Link>
        </li>
        <li>
          <Link to="tags">
            <Card sx={{ width: ['100%', '50%'], textAlign: 'center', display: 'inline-block' }}>
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
