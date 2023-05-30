import type { FC } from "react";

import { ReactComponent as LogoSvg } from "../../assets/images/s-works-logo.svg";

import styles from "./SWorksLogo.module.scss";

const SWorksLogo: FC = () => {
  return (
    <span className={styles.root}>
      <LogoSvg /> {`s-works`}
    </span>
  );
};

export default SWorksLogo;
