import type { FC, PropsWithChildren } from "react";
import { css } from "@styled-system/css";

import Bio from "./Bio";
import Chip from "./Chip";

import { formatDisplayDate } from "../helpers/utils";

const root = css({
  borderStyle: "solid",
  borderWidth: "1px",
  borderColor: "var(--color-accent)",
  borderRadius: "[10px]",
  boxShadow: "[0 2px 4px rgb(67 133 187 / 7%)]",
  padding: "var(--spacing-10)",
  backgroundColor: "var(--color-post-background)",

  "& header": {
    marginBottom: "var(--spacing-10)",

    "& h1": {
      margin: "0",
      marginBottom: "var(--spacing-4)",
      fontSize: "var(--fontSize-5)",
    },
    "& div": {
      color: "var(--color-text-light)",
    },
  },

  "& footer": {
    marginTop: "var(--spacing-10)",
  },
});

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
    <article className={root} itemScope itemType="http://schema.org/Article">
      <header>
        <h1 itemProp="headline">{title}</h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: 5 }}>{formatDisplayDate(date)}</span>
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
