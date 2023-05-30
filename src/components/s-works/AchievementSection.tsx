import type { FC, PropsWithChildren } from "react";

import styles from "./AchievementSection.module.scss";

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
    <section className={styles.root}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{`Achievements`}</h2>
        <div className={styles.list}>
          {posts.map(({ url, title, date, description, heroImage }) => (
            <a key={url} href={url} className={styles.listItem}>
              <div className={styles.listItemLeft}>
                <h3>{title}</h3>
                <p>{date.toLocaleDateString()}</p>
                <p>{description}</p>
              </div>
              <div className={styles.listItemRight}>
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
