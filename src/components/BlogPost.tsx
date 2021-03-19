import React from "react";

import Bio from "./bio";

import styles from "./BlogPost.module.scss";

export interface BlogPostProps {
  title: string;
  date: string;
  html: string;
}

const BlogPost: React.FC<BlogPostProps> = (props) => {
  const { title, date, html } = props;

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
      <section dangerouslySetInnerHTML={{ __html: html }} />
      <footer>
        <Bio />
      </footer>
    </article>
  );
};

export default BlogPost;
