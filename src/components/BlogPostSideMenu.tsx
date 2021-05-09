import React, { FC } from "react";

import Toc from "./Toc";

import * as styles from "./BlogPostSideMenu.module.scss";

interface BlogPostSideMenuProps {
  headings: { id: string; value: string; depth: number }[];
  tableOfContents: string;
  onSelect: (id: string) => void;
}

const BlogPostSideMenu: FC<BlogPostSideMenuProps> = (props) => {
  const { headings, tableOfContents, onSelect } = props;
  return (
    <div className={styles.root}>
      <div>目次</div>
      <Toc
        headings={headings}
        tableOfContents={tableOfContents}
        onClick={onSelect}
      />
    </div>
  );
};

export default BlogPostSideMenu;
