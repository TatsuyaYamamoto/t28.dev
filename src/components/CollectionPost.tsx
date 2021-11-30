import React, { FC } from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import * as styles from "./BlogPost.module.scss";

export interface Props {
  title: string;
  body: string;
}

const CollectionPost: FC<Props> = (props) => {
  const { title, body } = props;

  return (
    <article
      className={styles.blogPost}
      itemScope
      itemType="http://schema.org/Article"
    >
      <header>
        <h1 itemProp="headline">{title}</h1>
      </header>
      <MDXRenderer>{body}</MDXRenderer>
    </article>
  );
};

export default CollectionPost;
