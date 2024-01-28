import type { FC } from "react";

import TwitterIcon from "../../assets/icons/fa/twitter.svg?react";
import ExternalLinkIcon from "../../assets/icons/fa/arrow-up-right-from-square-solid.svg?react";

import styles from "./AchievementRelatedLinkButton.module.scss";

const linkIcons = {
  external: <ExternalLinkIcon />,
  twitter: <TwitterIcon />,
} as const;

interface Props {
  href: string;
  type: "twitter" | "external";
  label: string;
}

const AchievementRelatedLinkButton: FC<Props> = (props) => (
  <a className={styles.root} href={props.href} target={"_blank"}>
    {linkIcons[props.type]}
    {props.label}
  </a>
);

export default AchievementRelatedLinkButton;
