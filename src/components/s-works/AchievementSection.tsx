import type { FC, PropsWithChildren } from "react";
import { css } from "../../../styled-system/css";

import { formatDisplayDate } from "../../helpers/utils";

const root = css({
  backgroundColor: "var(--color-orange)",
  padding: "var(--spacing-8) 15px",
});

const inner = css({
  maxWidth: "800px",
  margin: "0 auto",
});

const heading = css({
  "--font-size": "40px",
  md: {
    "--font-size": "80px",
  },
  color: "#ffffff",
  fontSize: "var(--font-size)",
  fontFamily: "sans-serif",
  fontWeight: "600",
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
  boxShadow: "var(--chakra-shadows-md)",
  color: "var(--color-black)",
  backgroundColor: "#ffffff",

  flexDirection: "column",
  md: {
    flexDirection: "row",
  },
});

const listItemLeft = css({
  padding: "var(--spacing-5)",
  flex: 1,

  "& h3": {
    margin: 0,
    fontSize: "var(--font-sizes-xl)",
  },

  "& p": {
    marginTop: "var(--spacing-4)",
  },
});

const listItemRight = css({
  width: "100%",

  md: {
    maxWidth: "300px",
  },

  "& img": {
    objectFit: "cover",
    height: "100%",
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
