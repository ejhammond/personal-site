/** @jsx jsx */
import { jsx, Badge, Heading } from 'theme-ui';
import * as React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../../../components/layout';
import SEO from '../../../components/seo';
import { Breadcrumbs } from '../../../components/breadcrumbs';

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;

type QueryResult = {
  allMdx: { group: [{ fieldValue: string; totalCount: number }] };
};

const BlogTags: React.FC<{ data: QueryResult }> = (props) => {
  const { data } = props;
  const tags = data.allMdx.group;
  const sortedTags = React.useMemo(() => {
    return [...tags].sort((a, b) => {
      const aCount = a.totalCount;
      const bCount = b.totalCount;
      return bCount - aCount;
    });
  }, [tags]);
  return (
    <Layout>
      <SEO title="All tags" />
      <Breadcrumbs />
      <Heading as="h2">All Tags</Heading>
      <ul sx={{ listStyleType: 'none' }}>
        {sortedTags.map(({ fieldValue, totalCount }) => {
          return (
            <li key={fieldValue} sx={{ mb: 2 }}>
              <Link
                to={`/blog/tags/${fieldValue}`}
                sx={{ color: 'accent', textDecoration: 'none' }}
              >
                <Heading as="h3" sx={{ display: 'flex', alignItems: 'center' }}>
                  {fieldValue}
                  <Badge variant="accent" sx={{ ml: 2 }}>
                    {totalCount}
                  </Badge>
                </Heading>
              </Link>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

export default BlogTags;
