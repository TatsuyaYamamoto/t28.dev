import type { FC, PropsWithChildren } from "react";

import styles from "./BlogPost.module.scss";

export interface Props {
  title: string;
}

const RoundupPost: FC<PropsWithChildren<Props>> = (props) => {
  const { title, children } = props;

  return (
    <article
      className={styles.root}
      itemScope
      itemType="http://schema.org/Article"
    >
      <header>
        <h1 itemProp="headline">{title}</h1>
      </header>
      {children}
    </article>
  );
};

export default RoundupPost;
