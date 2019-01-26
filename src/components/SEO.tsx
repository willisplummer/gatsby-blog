import React from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

const query = graphql`
  query GetSiteMetadata {
    site {
      siteMetadata {
        title
        author
        description
        siteUrl
      }
    }
  }
`;

interface PropsType {
  image?: string;
  title?: string;
  description?: string;
  slug?: string;
  lang?: string;
}

const SEO = ({
  image,
  title = '',
  description,
  slug = '',
  lang = 'en',
}: PropsType): JSX.Element => (
  <StaticQuery
    query={query}
    render={data => {
      const { siteMetadata } = data.site;
      const metaDescription = description || siteMetadata.description;
      const metaImage = image ? `${siteMetadata.siteUrl}/${image}` : null;
      const url = `${siteMetadata.siteUrl}${slug}`;
      return (
        <Helmet
          htmlAttributes={{ lang }}
          {...(title
            ? {
                titleTemplate: `%s — ${siteMetadata.title}`,
                title,
              }
            : {
                title: `${siteMetadata.title} — Willis Plummer blog`,
              })}
          meta={[
            {
              name: 'description',
              content: metaDescription,
            },
            {
              property: 'og:url',
              content: url,
            },
            {
              property: 'og:title',
              content: title || siteMetadata.title,
            },
            {
              name: 'og:description',
              content: metaDescription,
            },
            {
              name: 'twitter:card',
              content: 'summary',
            },
            {
              name: 'twitter:title',
              content: title || siteMetadata.title,
            },
            {
              name: 'twitter:description',
              content: metaDescription,
            },
          ].concat(
            metaImage
              ? [
                  {
                    property: 'og:image',
                    content: metaImage,
                  },
                  {
                    name: 'twitter:image',
                    content: metaImage,
                  },
                ]
              : []
          )}
        />
      );
    }}
  />
);

export default SEO;
