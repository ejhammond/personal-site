/** @jsx jsx */
import { jsx } from 'theme-ui';
import { graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { PostList } from '../components/post-list';
import { Data } from '../graphql-type';
import { makeHeading } from '../utils';

type QueryResult = {
  posts: {
    id: Data['mdx']['id'];
    fields: {
      path: Data['mdx']['fields']['path'];
    };
    frontmatter: {
      title: Data['mdx']['frontmatter']['title'];
      date: Data['mdx']['frontmatter']['date'];
      description: Data['mdx']['frontmatter']['description'];
    };
  };
};

type Props = {
  data: QueryResult;
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
      <h2>{`${seriesHeading} Series`}</h2>
      <PostList posts={posts.map(({ node }) => node)} />
      <hr sx={{ my: 4 }} />
      <Bio />
    </Layout>
  );
};

export default BlogPostTemplate;
