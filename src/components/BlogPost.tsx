import type { FC, PropsWithChildren } from "react";

import Bio from "./Bio";
import Chip from "./Chip";

import { formatDisplayDate } from "../helpers/utils";

export interface Props {
  title: string;
  publishedDate: Date;
  modifiedDate?: Date | undefined;
  category: string;
}

const BlogPost: FC<PropsWithChildren<Props>> = ({
  title,
  publishedDate,
  modifiedDate,
  category,
  children,
}) => {
  const publishedDateText = formatDisplayDate(publishedDate);
  const modifiedDateText = modifiedDate && formatDisplayDate(modifiedDate);

  return (
    <article
      className="rounded-lg border border-solid border-(--color-accent) bg-neutral-50 p-5 shadow-xs md:p-10"
      itemScope
      itemType="http://schema.org/Article"
    >
      <header className="mb-10">
        <h1 className="m-0 mb-4 text-(length:--fontSize-5)" itemProp="headline">
          {title}
        </h1>
        <div className="flex flex-wrap items-center">
          <span className="mr-2">
            {`${publishedDateText}に公開`}
            {modifiedDateText && `・${modifiedDateText}に更新`}
          </span>
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
