import type { FC } from "react";

import styles from "../styles/pages-index.module.scss";

interface Props {
  posts: {
    slug: string;
    title: string;
    description: string;
    date: Date;
    category: string;
  }[];
}

const BlogList: FC<Props> = (props) => {
  const { posts } = props;

  return (
    <ol style={{ listStyle: `none`, padding: 0 }}>
      {posts.map((post) => {
        return (
          <li key={post.slug}>
            <article
              className={styles.postListItem}
              itemScope
              itemType="http://schema.org/Article"
            >
              <header>
                <h2>
                  <a href={post.slug} itemProp="url">
                    <span itemProp="headline">{post.title}</span>
                  </a>
                </h2>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <small>{post.date.toLocaleDateString()}</small>
                  <span style={{ marginLeft: 5 }}>
                    {/* TODO style */}
                    {post.category}
                  </span>
                </div>
              </header>
              <section>
                <p itemProp="description">{post.description}</p>
              </section>
            </article>
          </li>
        );
      })}
    </ol>
  );
};

export default BlogList;
