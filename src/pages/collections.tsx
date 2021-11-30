import React, { FC } from "react";
import { graphql, PageProps } from "gatsby";

import Layout from "../components/layout";
import Bio from "../components/bio";
import SEO from "../components/seo";
import CollectionList from "../components/CollectionList";

import * as styles from "../styles/pages-index.module.scss";

const CollectionsPage: FC<PageProps<GatsbyTypes.CollectionsPageQuery>> = ({
  data,
  location,
}) => {
  const siteTitle = data.site?.siteMetadata?.title || "";
  const posts = data.posts.nodes.map((node) => ({
    slug: node.fields?.slug || "",
    title: node.frontmatter?.title || "",
    description: node.frontmatter?.description || node.excerpt,
    date: node.frontmatter?.date || "",
  }));

  return (
    <Layout location={location} title={siteTitle}>
      <SEO />
      <div className={styles.bioSection}>
        <Bio />
      </div>
      <div className={styles.listSection}>
        <CollectionList posts={posts} />
      </div>
    </Layout>
  );
};

export default CollectionsPage;

export const pageQuery = graphql`
  query CollectionsPage {
    site {
      siteMetadata {
        title
      }
    }
    posts: allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "collection" } } }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY/MM/DD")
          title
          description
        }
      }
    }
  }
`;
