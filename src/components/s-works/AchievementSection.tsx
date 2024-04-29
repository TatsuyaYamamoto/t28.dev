import type { FC, PropsWithChildren } from "react";
import { css } from "../../../styled-system/css";

import { formatDisplayDate } from "../../helpers/utils";

const root = css({
  backgroundColor: "var(--color-s-works)",
  paddingX: "[15px]", // TODO use token
  paddingY: "var(--spacing-8)",
});

const inner = css({
  maxWidth: "[800px]", // TODO use token
  marginX: "auto",
});

const heading = css({
  "--font-size": "40px",
  md: {
    "--font-size": "80px",
  },
  color: "var(--colors-white)",
  fontSize: "[var(--font-size)]", // TODO use token
  fontFamily: "[sans-serif]", // TODO use token
  fontWeight: "var(--fontWeight-semibold)",
});

const list = css({
  "& a:not(:first-child)": {
    marginTop: "var(--spacing-8)",
  },

  "& a": {
    textDecoration: "none",
  },
});

const listItem = css({
  display: "flex",
  color: "var(--color-black)",
  backgroundColor: "var(--colors-white)",

  flexDirection: "column",
  md: {
    flexDirection: "row",
  },
});

const listItemLeft = css({
  padding: "var(--spacing-5)",
  flex: "1",

  "& h3": {
    margin: "var(--spacing-0)",
    fontSize: "var(--font-sizes-xl)",
  },

  "& p": {
    marginTop: "var(--spacing-4)",
  },
});

const listItemRight = css({
  width: "full",

  md: {
    maxWidth: "[300px]", // TODO use token
  },

  "& img": {
    objectFit: "cover",
    height: "full",
  },
});

interface Props {
  posts: {
    url: string;
    title: string;
    description: string;
    date: Date;
    heroImage: { src: string };
  }[];
}

const AchievementSection: FC<PropsWithChildren<Props>> = ({ posts }) => {
  // const { isTabletOrMore } = useBreakpoint();
  // const headingFontSize = isTabletOrMore ? 80 : 40;

  return (
    <section className={root}>
      <div className={inner}>
        <h2 className={heading}>{`Achievements`}</h2>
        <div className={list}>
          {posts.map(({ url, title, date, description, heroImage }) => (
            <a key={url} href={url} className={listItem}>
              <div className={listItemLeft}>
                <h3>{title}</h3>
                <p>{formatDisplayDate(date)}</p>
                <p>{description}</p>
              </div>
              <div className={listItemRight}>
                <img alt={""} src={heroImage.src} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementSection;
