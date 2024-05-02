import type { FC, PropsWithChildren } from "react";
import { css } from "@styled-system/css";

import AchievementRelatedLinkButton from "./AchievementRelatedLinkButton";
import { formatDisplayDate } from "../../helpers/utils";

const divider = css({
  marginTop: "[30px]",
  marginBottom: "[30px]", // TODO use token
  // @ts-expect-error
  border: 0,
  borderTop: "[1px solid token(colors.slate.200)]",
});

const titleCss = css({
  marginTop: "var(--spacing-8)",
  marginBottom: "0",
  fontSize: "var(--font-sizes-3xl)",
  lineHeight: "[1.33]", // TODO use token
});

const headerDate = css({
  marginTop: "var(--spacing-3)",
  color: "[#575757]", // TODO use token
});

const headerLinks = css({
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "row",
  marginTop: "var(--spacing-4)",
  gap: "var(--spacing-2)",
});

const article = css({
  "& a": {
    textDecoration: "underline",
    fontWeight: "var(--fontWeight-semibold)",
    color: "[#fc8738]", // TODO use token
  },

  "& p": {
    marginBottom: "[30px]", // TODO use token
  },

  "& img": {
    height: "auto",
    boxShadow: "[rgb(240, 240, 250) 0 0 5px 2px]", // TODO use token
  },
});

interface Props {
  title: string;
  date: Date;
  links: {
    href: string;
    type: "twitter" | "external";
    label: string;
  }[];
}

const AchievementPost: FC<PropsWithChildren<Props>> = ({
  children,
  title,
  date,
  links,
}) => {
  return (
    <div>
      <header>
        <h1 className={titleCss}>{title}</h1>
        <div className={headerDate}>
          <time>{formatDisplayDate(date)}</time>
        </div>
        <div className={headerLinks}>
          {links.map(({ href, label, type }, i) => (
            <AchievementRelatedLinkButton
              key={i}
              href={href}
              type={type}
              label={label}
            />
          ))}
        </div>
      </header>
      <hr className={divider} />
      <article className={article}>{children}</article>
    </div>
  );
};

export default AchievementPost;
