import React, { FC } from "react";

import Toc, { TableOfContents } from "./Toc";

import * as styles from "./BlogPostSideMenu.module.scss";

interface BlogPostSideMenuProps {
  tableOfContents: TableOfContents;
  onSelect: (id: string) => void;
}

const BlogPostSideMenu: FC<BlogPostSideMenuProps> = (props) => {
  const { tableOfContents, onSelect } = props;
  return (
    <div className={styles.root}>
      <div>目次</div>
      <Toc tableOfContents={tableOfContents} onClick={onSelect} />
    </div>
  );
};

export default BlogPostSideMenu;
