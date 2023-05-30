import type { FC } from "react";
import { ReactComponent as LogoSvg } from "../../assets/images/s-works-logo.svg";

import styles from "./IndexHero.module.scss";

const IndexHero: FC = () => {
  return (
    <div className={styles.root}>
      <h1>
        <LogoSvg className={styles.icon} />
        <span className={styles.text}>{`s-works`}</span>
      </h1>
    </div>
  );
};

export default IndexHero;
