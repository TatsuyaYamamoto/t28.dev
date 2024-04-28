import type { FC } from "react";
import { css } from "../../../styled-system/css";

import TwitterIcon from "../../assets/icons/fa/twitter.svg?react";
import ExternalLinkIcon from "../../assets/icons/fa/arrow-up-right-from-square-solid.svg?react";

const root = css({
  // @extend .button;
  display: "inline-flex",
  justifyContent: "center",

  padding: "calc(0.5em - 1px) 1.25em",

  color: "#000000b3",
  fontSize: "0.75rem",
  fontWeight: 600,
  textDecoration: "none",

  backgroundColor: "#f5f5f5",
  border: "1px solid transparent",
  borderRadius: "9999px",

  _hover: {
    backgroundColor: "#eee",
  },

  "& svg": {
    width: "var(--spacing-3)",
    margin: 0,
    marginRight: "var(--spacing-1)",
  },
});

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
  <a className={root} href={props.href} target={"_blank"}>
    {linkIcons[props.type]}
    {props.label}
  </a>
);

export default AchievementRelatedLinkButton;
