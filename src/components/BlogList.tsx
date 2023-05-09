import { Link } from "gatsby";
import React, { FC } from "react";
import { Chip } from "@material-ui/core";

import * as styles from "../styles/pages-index.module.scss";

interface Props {
  posts: {
    slug: string;
    title: string;
    description: string;
    date: string;
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
                  <Link to={post.slug} itemProp="url">
                    <span itemProp="headline">{post.title}</span>
                  </Link>
                </h2>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <small>{post.date}</small>
                  <Chip
                    label={post.category}
                    style={{ marginLeft: 5 }}
                    size="small"
                  />
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
