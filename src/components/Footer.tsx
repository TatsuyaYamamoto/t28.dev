import type { FC } from "react";

import { TWITTER_NAME, TWITTER_URL } from "../constants";
import styles from "./Footer.module.scss";

interface Props {}

const Footer: FC<Props> = () => {
  return (
    <footer className={styles.appFooter}>
      <div className={styles.footerInner}>
        <div className={styles.footerCopyRight}>
          {`© ${new Date().getFullYear()} `}
          <a href={TWITTER_URL} target="_blank">
            {TWITTER_NAME}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
