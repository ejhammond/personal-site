/** @jsx jsx */
import { jsx } from 'theme-ui';
import { graphql } from 'gatsby';

import Layout from '../../../components/layout';
import SEO from '../../../components/seo';
import { PostList, PostListPost } from '../../../components/post-list';
import { Data } from '../../../graphql-type';
import { Breadcrumbs } from '../../../components/breadcrumbs';

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          ...PostListPost
        }
      }
    }
  }
`;

type QueryResult = {
  site: {
    siteMetadata: {
      title: Data['site']['siteMetadata']['title'];
    };
  };
  allMdx: {
    edges: Array<{
      node: PostListPost;
    }>;
  };
};

const BlogIndex: React.FC<{ data: QueryResult }> = (props) => {
  const { data } = props;
  const posts = data.allMdx.edges;

  return (
    <Layout>
      <SEO title="All articles" />
      <Breadcrumbs />
      <h2>All Articles</h2>
      <PostList posts={posts.map(({ node }) => node)} />
    </Layout>
  );
};

export default BlogIndex;
