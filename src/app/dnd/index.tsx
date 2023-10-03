/** @jsxImportSource theme-ui */
import { Heading, jsx } from 'theme-ui';
import { GiBroadsword } from 'react-icons/gi';
import { FaDiceD20 } from 'react-icons/fa';

import Layout from '../../components/layout';
import SEO from '../../components/seo';
import { Breadcrumbs } from '../../components/breadcrumbs';
import { DirectoryCard } from '../../components/directory-card';

const BlogIndex: React.FC = () => {
  return (
    <Layout>
      <SEO title="D&D Tools" />
      <Breadcrumbs />
      <Heading>D&D Tools</Heading>
      <ul sx={{ listStyleType: 'none', pl: [0, 4] }}>
        <li sx={{ mb: 3 }}>
          <DirectoryCard href="d20" icon={<FaDiceD20 size={50} />} label="D20 Chance" />
        </li>
        <li sx={{ mb: 3 }}>
          <DirectoryCard href="damage" icon={<GiBroadsword size={50} />} label="Damage" />
        </li>
      </ul>
    </Layout>
  );
};

export default BlogIndex;
