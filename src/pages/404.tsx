import React from "react";
import { graphql, PageProps } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

const NotFoundPage: React.FC<PageProps<GatsbyTypes.NotFoundIndexQuery>> = ({
  data,
  location,
}) => {
  const siteTitle = data.site?.siteMetadata?.title || "Not Found Page";

  return (
    <Layout location={location} title={siteTitle}>
      <SEO pageTitle="404: Not Found" />
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  );
};

export default NotFoundPage;

export const pageQuery = graphql`
  query NotFoundIndex {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
