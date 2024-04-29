import type { FC } from "react";
import { css } from "../../../styled-system/css";

import TwitterIcon from "../../assets/icons/fa/twitter.svg?react";
import ExternalLinkIcon from "../../assets/icons/fa/arrow-up-right-from-square-solid.svg?react";

const root = css({
  // @extend .button;
  display: "inline-flex",
  justifyContent: "center",

  padding: "[calc(0.5em - 1px) 1.25em]", // TODO use token

  color: "[#000000b3]", // TODO use token
  fontSize: "xs",
  fontWeight: "var(--fontWeight-semibold)",
  textDecoration: "none",

  backgroundColor: "[#f5f5f5]", // TODO use token
  border: "[1px solid transparent]", // TODO use token
  borderRadius: "full",

  _hover: {
    backgroundColor: "[#eeeeee]", // TODO use token
  },

  "& svg": {
    width: "var(--spacing-3)",
    margin: "0",
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
