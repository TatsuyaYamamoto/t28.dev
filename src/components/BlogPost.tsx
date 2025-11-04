import type { FC, PropsWithChildren } from "react";

import Bio from "./Bio";
import Chip from "./Chip";

import { formatDisplayDate } from "../helpers/utils";

export interface Props {
  title: string;
  date: Date;
  category: string;
}

const BlogPost: FC<PropsWithChildren<Props>> = ({
  title,
  date,
  category,
  children,
}) => {
  return (
    <article
      className="rounded-lg border border-solid border-(--color-accent) bg-neutral-50 p-10 shadow-xs"
      itemScope
      itemType="http://schema.org/Article"
    >
      <header className="mb-10">
        <h1 className="m-0 mb-4 text-(length:--fontSize-5)" itemProp="headline">
          {title}
        </h1>
        <div className="flex items-center">
          <span className="mr-2">{formatDisplayDate(date)}</span>
          <Chip>{category}</Chip>
        </div>
      </header>
      {children}
      <footer className="mt-10">
        <Bio />
      </footer>
    </article>
  );
};

export default BlogPost;
