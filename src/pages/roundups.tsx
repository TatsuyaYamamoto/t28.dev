import React, { FC } from "react";
import { graphql, PageProps } from "gatsby";

import Layout from "../components/layout";
import Bio from "../components/bio";
import SEO from "../components/seo";
import RoundupList from "../components/RoundupList";

import * as styles from "../styles/pages-index.module.scss";

const RoundupsPage: FC<PageProps<GatsbyTypes.RoundupsQuery>> = ({
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
        <RoundupList posts={posts} />
      </div>
    </Layout>
  );
};

export default RoundupsPage;

export const pageQuery = graphql`
  query Roundups {
    site {
      siteMetadata {
        title
      }
    }
    posts: allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "roundup" } } }
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
