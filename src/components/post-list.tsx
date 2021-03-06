/** @jsx jsx */
import { jsx } from 'theme-ui';
import { graphql } from 'gatsby';

import { Tag } from './tag';
import { Link } from './link';
import { Data } from '../graphql-type';

export const query = graphql`
  fragment PostListPost on Mdx {
    id
    fields {
      articleURL
    }
    frontmatter {
      date(formatString: "MMMM DD, YYYY")
      title
      description
      tags
    }
  }
`;

export type PostListPost = {
  id: Data['mdx']['id'];
  fields: {
    articleURL: Data['mdx']['fields']['articleURL'];
  };
  frontmatter: {
    title: Data['mdx']['frontmatter']['title'];
    date: Data['mdx']['frontmatter']['date'];
    description: Data['mdx']['frontmatter']['description'];
    tags: Data['mdx']['frontmatter']['tags'];
  };
};

export const PostList: React.FC<{
  posts: PostListPost[];
}> = (props) => {
  const { posts } = props;

  return (
    <ul sx={{ listStyleType: 'none', pl: [0, 4] }}>
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <h3 sx={{ mb: 1 }}>
              <Link to={post.fields.articleURL}>{post.frontmatter.title}</Link>
            </h3>
            {Array.isArray(post.frontmatter.tags) && (
              <ul sx={{ mt: 0, mb: 1, listStyle: 'none', pl: 0, display: 'flex' }}>
                {post.frontmatter.tags.map((tag) => (
                  <li key={tag} style={{ margin: '0 4px 0 0' }}>
                    <Tag tag={tag} />
                  </li>
                ))}
              </ul>
            )}
            <small sx={{ mb: 1 }}>{post.frontmatter.date}</small>
            <p sx={{ mt: 0, mb: 1 }}>{post.frontmatter.description}</p>
          </div>
        );
      })}
    </ul>
  );
};
