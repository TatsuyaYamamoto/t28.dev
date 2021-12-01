import React from "react";
import { Link } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";

import Bio from "./bio";

import * as styles from "./BlogPost.module.scss";

export interface BlogPostProps {
  title: string;
  date: string;
  body: string;
  roundup?: {
    slug: string;
    title: string;
  };
}

const BlogPost: React.FC<BlogPostProps> = (props) => {
  const { title, date, body, roundup } = props;

  return (
    <article
      className={styles.blogPost}
      itemScope
      itemType="http://schema.org/Article"
    >
      <header>
        <h1 itemProp="headline">{title}</h1>
        <div>{date}</div>
        {roundup && (
          <div>
            {`Rounded-up in: `} <Link to={roundup.slug}>{roundup.title}</Link>
          </div>
        )}
      </header>
      <MDXRenderer>{body}</MDXRenderer>
      <footer>
        <Bio />
      </footer>
    </article>
  );
};

export default BlogPost;
