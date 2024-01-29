import { type FC, useState } from "react";

import GithubIcon from "../../assets/icons/fa/github.svg?react";
import TwitterIcon from "../../assets/icons/fa/twitter.svg?react";

import SWorksLogo from "./SWorksLogo";

import styles from "./SWorksFooterSection.module.scss";

const SWorksFooterSection: FC = () => {
  const [thisYear] = useState(() => {
    const now = new Date();
    return now.getFullYear();
  });

  return (
    <footer className={styles.root}>
      <div className={styles.logo}>
        <a href="/s-works">
          <SWorksLogo />
        </a>
      </div>
      {/*HStack*/}
      <div className={styles.links}>
        <a href={`https://twitter.com/T28_tatsuya`} target="_blank">
          <TwitterIcon className={styles.twitter} />
        </a>
        <a href={`https://github.com/TatsuyaYamamoto`} target="_blank">
          <GithubIcon className={styles.github} />
        </a>
      </div>
      <div className={styles.copyright}>
        {`© 2021-${thisYear} s-works, All rights reserved.`}
      </div>
    </footer>
  );
};

export default SWorksFooterSection;
