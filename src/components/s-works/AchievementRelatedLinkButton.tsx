import type { FC } from "react";
import { FaTwitter as TwitterIcon } from "react-icons/fa";
import { FiExternalLink as ExternalLinkIcon } from "react-icons/fi";

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
