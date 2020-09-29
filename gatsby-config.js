module.exports = {
  siteMetadata: {
    title: 'Ayhota',
    description: "EJ Hammond's personal site",
    author: {
      name: 'EJ Hammond',
      twitter: '@ejhammond',
    },
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: ['Montserrat:400,700', 'Inconsolata:400,400i', 'Handlee:400'],
        },
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/images`,
        name: 'images',
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/blog-posts`,
        name: 'blog-posts',
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.md', '.mdx'],
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 600,
            },
          },
          // changes dash dash (--) to a nice em dash etc.
          { resolve: 'gatsby-remark-smartypants' },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Ayhota',
        short_name: 'Ayhota',
        start_url: '/',
        background_color: '#385170',
        theme_color: '#385170',
        display: 'minimal-ui',
        icon: 'content/images/ayhota-logo.png',
      },
    },
    'gatsby-plugin-offline',
  ],
};
