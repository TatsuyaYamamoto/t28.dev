import React from "react";
import { Link, graphql, PageProps } from "gatsby";

import Layout from "../components/layout";
import Bio from "../components/bio";
import SEO from "../components/seo";

import * as styles from "../styles/pages-index.module.scss";

const BlogIndex: React.FC<PageProps<GatsbyTypes.BlogIndexQuery>> = ({
  data,
  location,
}) => {
  const siteTitle = data.site?.siteMetadata?.title || `Title`;
  const posts = data.post.nodes;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO />
      <div className={styles.bioSection}>
        <Bio />
      </div>
      <div className={styles.listSection}>
        <ol style={{ listStyle: `none`, padding: 0 }}>
          {posts.map((post) => {
            const slug = post.fields?.slug as string;
            const title = post.frontmatter?.title || slug;
            const description =
              post.frontmatter?.description || (post.excerpt as string);

            return (
              <li key={slug}>
                <article
                  className={styles.postListItem}
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2>
                      <Link to={slug} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <small>{post.frontmatter?.date}</small>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{ __html: description }}
                      itemProp="description"
                    />
                  </section>
                </article>
              </li>
            );
          })}
        </ol>
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
    post: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`;
