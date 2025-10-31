import type { FC } from "react";

import Toc from "./Toc";

interface Props {
  tocItems: Parameters<typeof Toc>[0]["items"];
}

const BlogPostSideMenu: FC<Props> = ({ tocItems }) => {
  return (
    <aside className="sticky top-5 overflow-auto rounded-lg border border-solid border-(--color-accent) bg-(--color-post-background) p-3 shadow-xs">
      <div>目次</div>
      <Toc items={tocItems} />
    </aside>
  );
};

export default BlogPostSideMenu;
