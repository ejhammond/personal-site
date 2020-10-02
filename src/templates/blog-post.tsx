/** @jsx jsx */
import { jsx } from 'theme-ui';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { Data } from '../graphql-type';
import { makeHeading } from '../utils';
import { Breadcrumbs } from '../components/breadcrumbs';
import { Link } from '../components/link';

const GITHUB_USERNAME = 'ejhammond';
const GITHUB_REPO_NAME = 'personal-site';
const GITHUB_MAIN_BRANCH = 'main';

type QueryResult = {
  post: {
    id: Data['mdx']['id'];
    body: Data['mdx']['body'];
    timeToRead: Data['mdx']['timeToRead'];
    fields: {
      seriesURL: Data['mdx']['fields']['seriesURL'];
      pathInRepo: Data['mdx']['fields']['pathInRepo'];
    };
    frontmatter: {
      series: Data['mdx']['frontmatter']['series'];
      number: Data['mdx']['frontmatter']['number'];
      title: Data['mdx']['frontmatter']['title'];
      date: Data['mdx']['frontmatter']['date'];
      description: Data['mdx']['frontmatter']['description'];
    };
  };
  nextPost?: {
    fields: {
      articleURL: Data['mdx']['fields']['articleURL'];
    };
    frontmatter: {
      title: Data['mdx']['frontmatter']['title'];
    };
  };
  prevPost?: {
    fields: {
      articleURL: Data['mdx']['fields']['articleURL'];
    };
    frontmatter: {
      title: Data['mdx']['frontmatter']['title'];
    };
  };
};

type Props = {
  data: QueryResult;
};

export const query = graphql`
  query BlogPostById($id: String!, $nextId: String, $prevId: String) {
    post: mdx(id: { eq: $id }) {
      id
      body
      timeToRead
      fields {
        seriesURL
        pathInRepo
      }
      frontmatter {
        series
        number
        title
        date(formatString: "MMMM YYYY")
        description
      }
    }
    nextPost: mdx(id: { eq: $nextId }) {
      fields {
        articleURL
      }
      frontmatter {
        title
      }
    }
    prevPost: mdx(id: { eq: $prevId }) {
      fields {
        articleURL
      }
      frontmatter {
        title
      }
    }
  }
`;

const BlogPostTemplate: React.FC<Props> = (props) => {
  if (props.data === undefined) {
    return null;
  }

  const { post, nextPost, prevPost } = props.data;
  const editOnGitHubURL = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/edit/${GITHUB_MAIN_BRANCH}/${post.fields.pathInRepo}`;

  return (
    <Layout>
      <SEO title={post.frontmatter.title} description={post.frontmatter.description} />
      <Breadcrumbs />
      <h1 sx={{ my: 0 }}>{post.frontmatter.title}</h1>
      {post.frontmatter.series !== null && post.fields.seriesURL !== null && (
        <small sx={{ display: 'block', mb: 2 }}>
          <Link to={post.fields.seriesURL}>{makeHeading(post.frontmatter.series)} Series</Link> |
          Article {post.frontmatter.number}
        </small>
      )}
      <div sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <p sx={{ my: 0 }}>{post.frontmatter.date}</p>
        <span aria-hidden sx={{ mx: 2 }}>
          |
        </span>
        <p sx={{ my: 0 }}>~{post.timeToRead} minute read</p>
      </div>
      <MDXRenderer frontmatter={post.frontmatter}>{post.body}</MDXRenderer>
      <hr sx={{ my: 4 }} />
      <Link to={editOnGitHubURL} target="_blank" rel="noopener noreferrer" sx={{ mb: 4 }}>
        Edit on GitHub
      </Link>
      <ul
        sx={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-between`,
          listStyle: `none`,
          padding: 0,
        }}
      >
        <li>
          {prevPost && (
            <Link
              sx={{ color: 'accent', textDecoration: 'none' }}
              to={prevPost.fields.articleURL}
              rel="prev"
            >
              ← {prevPost.frontmatter.title}
            </Link>
          )}
        </li>
        <li>
          {nextPost && (
            <Link
              sx={{ color: 'accent', textDecoration: 'none' }}
              to={nextPost.fields.articleURL}
              rel="next"
            >
              {nextPost.frontmatter.title} →
            </Link>
          )}
        </li>
      </ul>
    </Layout>
  );
};

export default BlogPostTemplate;
