import type { FC, PropsWithChildren } from "react";

import Bio from "./Bio";
import Chip from "./Chip";

import styles from "./BlogPost.module.scss";

export interface Props {
  title: string;
  date: Date;
  category: string;
  roundup?: {
    slug: string;
    title: string;
  };
}

const BlogPost: FC<PropsWithChildren<Props>> = ({
  title,
  date,
  category,
  roundup,
  children,
}) => {
  return (
    <article
      className={styles.root}
      itemScope
      itemType="http://schema.org/Article"
    >
      <header>
        <h1 itemProp="headline">{title}</h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: 5 }}>{date.toLocaleDateString()}</span>
          <Chip>{category}</Chip>
        </div>
        {roundup && (
          <div>
            {`Rounded-up in: `} <a href={roundup.slug}>{roundup.title}</a>
          </div>
        )}
      </header>
      {children}
      <footer>
        <Bio />
      </footer>
    </article>
  );
};

export default BlogPost;
