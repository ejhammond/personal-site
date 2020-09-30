/** @jsx jsx */
import { jsx } from 'theme-ui';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { PostList, PostListPost } from '../components/post-list';
import { makeHeading } from '../utils';
import { Breadcrumbs } from '../components/breadcrumbs';

type QueryResult = {
  allMdx: {
    edges: Array<{
      node: PostListPost;
    }>;
  };
};

type Props = {
  data: QueryResult;
  pageContext: {
    tag: string;
  };
};

export const query = graphql`
  query BlogPostsByTag($tag: String!) {
    allMdx(
      filter: { frontmatter: { tags: { in: [$tag] } } }
      sort: { order: ASC, fields: frontmatter___number }
    ) {
      edges {
        node {
          ...PostListPost
        }
      }
    }
  }
`;

const BlogTagTemplate: React.FC<Props> = (props) => {
  const { data, pageContext } = props;

  if (data === undefined) {
    return null;
  }

  const posts = data.allMdx.edges;
  const { tag } = pageContext;
  const tagHeading = makeHeading(tag);

  return (
    <Layout>
      <SEO title={`Tag: ${tag}`} />
      <Breadcrumbs />
      <h2>{`Tag: ${tagHeading}`}</h2>
      <PostList posts={posts.map(({ node }) => node)} />
    </Layout>
  );
};

export default BlogTagTemplate;
