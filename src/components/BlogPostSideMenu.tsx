import { css } from "@styled-system/css";
import type { FC } from "react";

import Toc from "./Toc";

const sideMenu = css({
  position: "sticky",
  top: "5",
  padding: "3",
  overflow: "auto",
  border: "var(--border-solid-accent)",
  borderRadius: "lg",
  boxShadow: "xs",
  backgroundColor: "var(--color-post-background)",
});

interface Props {
  tocItems: Parameters<typeof Toc>[0]["items"];
}

const BlogPostSideMenu: FC<Props> = ({ tocItems }) => {
  return (
    <aside className={sideMenu}>
      <div>目次</div>
      <Toc items={tocItems} />
    </aside>
  );
};

export default BlogPostSideMenu;
