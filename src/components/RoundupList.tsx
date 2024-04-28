import type { FC } from "react";

import { css } from "../../styled-system/css";

const listItem = css({
  margin: "var(--spacing-8) 0",

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
    slug: string;
    title: string;
  }[];
}

const RoundupList: FC<Props> = (props) => {
  const { posts } = props;

  return (
    <ol style={{ listStyle: `none`, padding: 0 }}>
      {posts.map((post) => {
        return (
          <li key={post.slug}>
            <article
              className={listItem}
              itemScope
              itemType="http://schema.org/Article"
            >
              <header>
                <h2>
                  <a href={post.slug} itemProp="url">
                    <span itemProp="headline">{post.title}</span>
                  </a>
                </h2>
              </header>
            </article>
          </li>
        );
      })}
    </ol>
  );
};

export default RoundupList;
