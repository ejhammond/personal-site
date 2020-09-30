/** @jsx jsx */
import { jsx } from 'theme-ui';
import { graphql } from 'gatsby';

import Bio from '../../components/bio';
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import { PostList, PostListPost } from '../../components/post-list';
import { Data } from '../../graphql-type';

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
      <SEO title="All posts" />
      <h2>All Posts</h2>
      <PostList posts={posts.map(({ node }) => node)} />
      <hr sx={{ my: 4 }} />
      <Bio />
    </Layout>
  );
};

export default BlogIndex;
