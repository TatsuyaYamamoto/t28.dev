import type { FC } from "react";
import { css } from "@styled-system/css";

import Chip from "./Chip";
import { formatDisplayDate } from "../helpers/utils";

const listItem = css({
  marginY: "var(--spacing-8)",

  "& h2": {
    fontSize: "var(--fontSize-4)",
    color: "var(--color-primary)",
    marginBottom: "var(--spacing-2)",
    marginTop: "var(--spacing-0)",
  },

  "& header": {
    marginBottom: "var(--spacing-4)",
  },
});

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
              className={listItem}
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
