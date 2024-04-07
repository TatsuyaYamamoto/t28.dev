import type { FC, PropsWithChildren } from "react";

import styles from "./BlogPostContent.module.scss";

export interface Props {}

const BlogPost: FC<PropsWithChildren<Props>> = ({ children }) => {
  return <div className={styles.root}>{children}</div>;
};

export default BlogPost;
