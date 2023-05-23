import { Chip } from "@material-ui/core";

import Bio from "./bio";

import * as styles from "./BlogPost.module.scss";

export interface BlogPostProps {
  title: string;
  date: string;
  category: string;
  body: string;
  roundup?: {
    slug: string;
    title: string;
  };
}

const BlogPost: React.FC<BlogPostProps> = (props) => {
  const { title, date, category, body, roundup } = props;

  return (
    <article
      className={styles.blogPost}
      itemScope
      itemType="http://schema.org/Article"
    >
      <header>
        <h1 itemProp="headline">{title}</h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{date}</span>
          <Chip label={category} style={{ marginLeft: 5 }} size="small" />
        </div>
        {roundup && (
          <div>
            {`Rounded-up in: `} <a href={roundup.slug}>{roundup.title}</a>
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
