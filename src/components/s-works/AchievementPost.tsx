import type { FC, PropsWithChildren } from "react";

import AchievementRelatedLinkButton from "./AchievementRelatedLinkButton";

import styles from "./AchievementPost.module.scss";

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
    <div className={styles.root}>
      <header className={styles.header}>
        <h1>{title}</h1>
        <div className={styles.headerDate}>
          <time>{date.toLocaleDateString()}</time>
        </div>
        <div className={styles.headerLinks}>
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
      <hr />
      <article className={styles.article}>{children}</article>
    </div>
  );
};

export default AchievementPost;
