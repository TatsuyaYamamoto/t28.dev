import type { FC } from "react";
import { css } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

import TwitterIcon from "../../assets/icons/fa/twitter.svg?react";
import ExternalLinkIcon from "../../assets/icons/fa/arrow-up-right-from-square-solid.svg?react";

const Link = styled("a", {
  base: {
    display: "inline-flex",
    justifyContent: "center",

    padding: "[calc(0.5em - 1px) 1.25em]", // TODO use token

    color: "black/70",
    fontSize: "xs",
    fontWeight: "var(--fontWeight-semibold)",
    textDecoration: "none",

    backgroundColor: "neutral.100",
    border: "var(--border-solid-transparent)",
    borderRadius: "full",

    _hover: {
      backgroundColor: "[#eeeeee]", // TODO use token
    },
  },
});

const linkIcons = {
  external: ExternalLinkIcon,
  twitter: TwitterIcon,
} as const;

interface Props {
  href: string;
  type: "twitter" | "external";
  label: string;
}

const AchievementRelatedLinkButton: FC<Props> = (props) => {
  const Icon = linkIcons[props.type];
  return (
    <Link href={props.href} target={"_blank"}>
      <Icon
        className={css({
          width: "var(--spacing-3)",
          marginRight: "var(--spacing-1)",
        })}
      />
      {props.label}
    </Link>
  );
};

export default AchievementRelatedLinkButton;
