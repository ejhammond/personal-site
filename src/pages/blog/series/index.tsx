/** @jsx jsx */
import { jsx, Heading, Card } from 'theme-ui';
import * as React from 'react';
import { graphql } from 'gatsby';

import Layout from '../../../components/layout';
import SEO from '../../../components/seo';
import { Breadcrumbs } from '../../../components/breadcrumbs';
import { Link } from '../../../components/link';
import { makeHeading } from '../../../utils';
import { Data } from '../../../graphql-type';

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(
      filter: { frontmatter: { series: { ne: null } } }
      sort: { fields: [frontmatter___number], order: ASC }
    ) {
      group(field: frontmatter___series) {
        fieldValue
        edges {
          node {
            frontmatter {
              title
            }
          }
        }
      }
    }
  }
`;

type QueryResult = {
  allMdx: {
    group: [
      {
        fieldValue: string;
        totalCount: number;
        edges: Array<{
          node: {
            frontmatter: {
              title: Data['mdx']['frontmatter']['title'];
            };
          };
        }>;
      },
    ];
  };
};

const BlogSeries: React.FC<{ data: QueryResult }> = (props) => {
  const { data } = props;
  const series = data.allMdx.group;
  const sortedSeries = React.useMemo(() => {
    return [...series].sort((a, b) => {
      const aCount = a.totalCount;
      const bCount = b.totalCount;
      return bCount - aCount;
    });
  }, [series]);
  return (
    <Layout>
      <SEO title="All tags" />
      <Breadcrumbs />
      <Heading as="h2">All Series</Heading>
      <ul sx={{ listStyleType: 'none', pl: [0, 4] }}>
        {sortedSeries.map(({ fieldValue, edges }) => {
          return (
            <li key={fieldValue} sx={{ mb: 2 }}>
              <Link to={`/blog/series/${fieldValue}`}>
                <Card sx={{ width: ['100%', '50%'], display: 'inline-block' }}>
                  <Heading as="h3" sx={{ display: 'flex', alignItems: 'center' }}>
                    {makeHeading(fieldValue)}
                  </Heading>
                  <ol>
                    {edges.map(({ node }) => {
                      return (
                        <li key={node.frontmatter.title} sx={{ color: 'text' }}>
                          {node.frontmatter.title}
                        </li>
                      );
                    })}
                  </ol>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

export default BlogSeries;
