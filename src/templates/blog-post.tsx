import React, { useState, MouseEvent, FC, useMemo } from "react";
import { Link, graphql, PageProps } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import BlogPost from "../components/BlogPost";

import BlogPostSideMenu from "../components/BlogPostSideMenu";
import MobileFab from "../components/MobileFab";
import MobileToc from "../components/MobileToc";
import { TableOfContents } from "../components/Toc";

import * as styles from "../styles/templates-blog-post.module.scss";

const BlogPostTemplate: FC<PageProps<GatsbyTypes.BlogPostBySlugQuery>> = ({
  data,
  location,
}) => {
  const { post, site, previous, next } = data;

  const siteTitle = site?.siteMetadata?.title || `Title`;
  const postTitle = post?.frontmatter?.title;
  const postDate = post?.frontmatter?.date;
  const postDescription = post?.frontmatter?.description || post?.excerpt;
  const body = post?.body;
  const tableOfContents = (post?.tableOfContents ?? {}) as TableOfContents;

  const [mobileTocEl, setMobileTocEl] = useState<HTMLElement | null>(null);

  if (!postTitle || !postDate || !body) {
    return <div />;
  }

  const handleMobileFabClick = (e: MouseEvent<HTMLElement>) => {
    setMobileTocEl(e.currentTarget);
  };

  const onTocSelect = (id: string) => {
    document.getElementById(id)?.scrollIntoView();
  };

  const onMobileTocSelect = (id: string | null) => {
    setMobileTocEl(null);

    if (id) {
      document.getElementById(id)?.scrollIntoView();
    }
  };

  return (
    <Layout location={location} title={siteTitle}>
      <SEO pageTitle={postTitle} description={postDescription} />
      <div className={styles.blogPostMain}>
        <div className={styles.blogPostContent}>
          <BlogPost title={postTitle} date={postDate} body={body} />
        </div>
        <aside className={styles.blogPostSideMenu}>
          <div className={styles.blogPostSideMenuInner}>
            <BlogPostSideMenu
              tableOfContents={tableOfContents}
              onSelect={onTocSelect}
            />
          </div>
        </aside>
      </div>
      <nav className={styles.blogPostNav}>
        <ul className={styles.blogPostNavList}>
          <li>
            {previous && (
              <Link to={previous.fields?.slug || `/`} rel="prev">
                ← {previous.frontmatter?.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields?.slug || `/`} rel="next">
                {next.frontmatter?.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
      <div className={styles.fab}>
        <MobileFab onClick={handleMobileFabClick} />
        <MobileToc
          el={mobileTocEl}
          tableOfContents={tableOfContents}
          onSelect={onMobileTocSelect}
        />
      </div>
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
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
      tableOfContents(maxDepth: 3)
      headings {
        value
        depth
      }
    }
    previous: mdx(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: mdx(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
