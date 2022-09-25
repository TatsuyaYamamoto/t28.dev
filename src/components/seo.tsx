/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

type Props = {
  description?: string;
  ogpImageUrl?: string;
  lang?: string;
  meta?: (
    | { name: string; content: string }
    | { property: string; content: string }
  )[];
  pageTitle?: string;
};

const SEO: React.FC<Props> = (props) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            defaultOgpImageUrl
            social {
              twitter
            }
          }
        }
      }
    `
  );

  const lang = props.lang ?? "ja";
  const metaDescription =
    props.description ?? site.siteMetadata.description ?? "";
  const siteTitle = site.siteMetadata?.title;
  const ogpImage = props.ogpImageUrl ?? site.siteMetadata?.defaultOgpImageUrl;
  const title = props.pageTitle
    ? `${props.pageTitle} | ${siteTitle}`
    : siteTitle;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: ogpImage,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata?.social?.twitter || ``,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(props.meta ?? [])}
    />
  );
};

export default SEO;
