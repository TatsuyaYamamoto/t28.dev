import React, { FC } from "react";

import * as styles from "./BlogPostSideMenu.module.scss";

interface BlogPostSideMenuProps {
  tableOfContents: string;
}

const BlogPostSideMenu: FC<BlogPostSideMenuProps> = (props) => {
  const { tableOfContents } = props;

  return (
    <div className={styles.root}>
      <div>目次</div>
      <div
        className={styles.tocBody}
        dangerouslySetInnerHTML={{ __html: tableOfContents }}
      />
    </div>
  );
};

export default BlogPostSideMenu;
