import React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import Bio from "./bio";

import * as styles from "./BlogPost.module.scss";

export interface BlogPostProps {
  title: string;
  date: string;
  body: string;
}

const BlogPost: React.FC<BlogPostProps> = (props) => {
  const { title, date, body } = props;

  return (
    <article
      className={styles.blogPost}
      itemScope
      itemType="http://schema.org/Article"
    >
      <header>
        <h1 itemProp="headline">{title}</h1>
        <p>{date}</p>
      </header>
      <MDXRenderer>{body}</MDXRenderer>
      <footer>
        <Bio />
      </footer>
    </article>
  );
};

export default BlogPost;
