const path = require(`path`);

function onCreateNode({ node, actions }) {
  const { createNodeField } = actions;
  if (node.internal.type === `Mdx`) {
    const { article, series, number } = node.frontmatter;
    if (series !== undefined && number === undefined) {
      throw new Error('Any article with a series must also have a number');
    }

    createNodeField({
      node,
      name: `path`,
      value: series !== undefined ? `/blog/${series}/${article}` : `/blog/${article}`,
    });
    createNodeField({
      node,
      name: 'pathInRepo',
      value: node.fileAbsolutePath.slice(node.fileAbsolutePath.indexOf('src')),
    });
  }
}

function createPages({ graphql, actions }) {
  const { createPage } = actions;

  return graphql(
    `
      {
        allMdx(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
          edges {
            node {
              id
              fields {
                path
              }
              frontmatter {
                series
                number
              }
            }
          }
        }
      }
    `,
  ).then((result) => {
    if (result.errors) {
      throw result.errors;
    }

    const posts = result.data.allMdx.edges;
    const postsBySeries = posts.reduce((acc, p) => {
      const { series, number } = p.node.frontmatter;

      if (series === null) {
        return acc;
      }

      if (acc[series] === undefined) {
        acc[series] = {};
      }

      acc[series][number] = p.node;

      return acc;
    }, {});

    Object.keys(postsBySeries).forEach((series) => {
      createPage({
        path: `/blog/${series}`,
        component: path.resolve('./src/templates/blog-series.tsx'),
        context: {
          series,
        },
      });
    });

    posts.forEach((post) => {
      const { series, number } = post.node.frontmatter;

      let nextId = null;
      let prevId = null;
      if (postsBySeries[series] !== undefined) {
        if (postsBySeries[series][number + 1] !== undefined) {
          nextId = postsBySeries[series][number + 1].id;
        }
        if (postsBySeries[series][number - 1] !== undefined) {
          prevId = postsBySeries[series][number - 1].id;
        }
      }

      createPage({
        path: post.node.fields.path,
        component: path.resolve('./src/templates/blog-post.tsx'),
        context: {
          id: post.node.id,
          nextId,
          prevId,
        },
      });
    });

    return null;
  });
}

module.exports = {
  onCreateNode,
  createPages,
};
