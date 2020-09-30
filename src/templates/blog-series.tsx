/** @jsx jsx */
import { jsx } from 'theme-ui';
import { graphql } from 'gatsby';

import Bio from '../components/bio';
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
    series: string;
  };
};

export const query = graphql`
  query BlogPostsBySeries($series: String!) {
    allMdx(
      filter: { frontmatter: { series: { eq: $series } } }
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

const BlogPostTemplate: React.FC<Props> = (props) => {
  const { data, pageContext } = props;

  if (data === undefined) {
    return null;
  }

  const posts = data.allMdx.edges;
  const { series } = pageContext;
  const seriesHeading = makeHeading(series);

  return (
    <Layout>
      <SEO title={`${seriesHeading} Series`} />
      <Breadcrumbs />
      <h2>{`${seriesHeading} Series`}</h2>
      <PostList posts={posts.map(({ node }) => node)} />
      <hr sx={{ my: 4 }} />
      <Bio />
    </Layout>
  );
};

export default BlogPostTemplate;
