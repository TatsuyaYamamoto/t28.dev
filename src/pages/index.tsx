import React from "react";
import { graphql, PageProps } from "gatsby";

import Layout from "../components/layout";
import Bio from "../components/bio";
import SEO from "../components/seo";

import * as styles from "../styles/pages-index.module.scss";
import BlogList from "../components/BlogList";

const BlogIndex: React.FC<PageProps<GatsbyTypes.BlogIndexQuery>> = ({
  data,
  location,
}) => {
  const siteTitle = data.site?.siteMetadata?.title || "";
  const posts = data.posts.nodes.map((node) => ({
    slug: node.fields?.slug || "",
    title: node.frontmatter?.title || "",
    description: node.frontmatter?.description || node.excerpt,
    date: node.frontmatter?.date || "",
    category: node.frontmatter?.category ?? "Tech",
  }));

  return (
    <Layout location={location} title={siteTitle}>
      <SEO />
      <div className={styles.bioSection}>
        <Bio />
      </div>
      <div className={styles.listSection}>
        <BlogList posts={posts} />
      </div>
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query BlogIndex {
    site {
      siteMetadata {
        title
      }
    }
    posts: allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { type: { eq: "blog" } } }
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
          category
        }
      }
    }
  }
`;
