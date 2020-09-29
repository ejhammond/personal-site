/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import { Data } from '../graphql-type';

type Meta = { name: string; content: string } | { property: string; content: string };
type SEOQueryResult = {
  site: {
    siteMetadata: {
      title: Data['site']['siteMetadata']['title'];
      description: Data['site']['siteMetadata']['description'];
      author: {
        twitter: Data['site']['siteMetadata']['author']['twitter'];
      };
    };
  };
};

function SEO(props: { description?: string; lang?: string; meta?: Meta[]; title: string }) {
  const { site } = useStaticQuery<SEOQueryResult>(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author {
              twitter
            }
          }
        }
      }
    `,
  );

  const { title, description = site.siteMetadata.description, meta = [], lang = 'en' } = props;

  const authorTwitter = site.siteMetadata.author.twitter;
  const siteTitle = site.siteMetadata.title;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={siteTitle ? `%s | ${siteTitle}` : undefined}
      meta={[
        {
          name: `description`,
          content: description,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: description,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: authorTwitter,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: description,
        },
      ].concat(meta)}
    />
  );
}

export default SEO;
