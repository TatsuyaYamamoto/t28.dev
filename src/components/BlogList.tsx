import type { FC } from "react";

import Chip from "./Chip";
import { formatDisplayDate } from "../helpers/utils";

import styles from "./BlogList.module.scss";

interface Props {
  posts: {
    url: string;
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
          <li key={post.url}>
            <article
              className={styles.postListItem}
              itemScope
              itemType="http://schema.org/Article"
            >
              <header>
                <h2>
                  <a href={post.url} itemProp="url">
                    <span itemProp="headline">{post.title}</span>
                  </a>
                </h2>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{formatDisplayDate(post.date)}</span>
                  <Chip style={{ marginLeft: 5 }}>{post.category}</Chip>
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
