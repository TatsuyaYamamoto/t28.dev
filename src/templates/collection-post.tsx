import React, { FC } from "react";
import { graphql, PageProps } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import CollectionPost from "../components/CollectionPost";

import * as styles from "../styles/templates-blog-post.module.scss";

const CollectionPostTemplate: FC<
  PageProps<GatsbyTypes.CollectionPostBySlugQuery>
> = ({ data, location }) => {
  const { post, site } = data;

  const siteTitle = site?.siteMetadata?.title || `Title`;
  const postTitle = post?.frontmatter?.title;
  const postDescription = post?.frontmatter?.description || post?.excerpt;
  const body = post?.body;

  if (!postTitle || !body) {
    return <div />;
  }

  return (
    <Layout location={location} title={siteTitle}>
      <SEO pageTitle={postTitle} description={postDescription} />
      <div className={styles.blogPostMain}>
        <div className={styles.collectionPostContent}>
          <CollectionPost title={postTitle} body={body} />
        </div>
      </div>
    </Layout>
  );
};

export default CollectionPostTemplate;

export const pageQuery = graphql`
  query CollectionPostBySlug($id: String!) {
    site {
      siteMetadata {
        title
      }
    }
    post: mdx(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      body
      frontmatter {
        title
        date(formatString: "YYYY/MM/DD")
        description
      }
    }
  }
`;
