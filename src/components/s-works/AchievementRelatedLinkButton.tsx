import type { FC } from "react";

import ExternalLinkIcon from "../../assets/icons/fa/arrow-up-right-from-square-solid.svg?react";
import TwitterIcon from "../../assets/icons/fa/twitter.svg?react";

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
    <a
      href={props.href}
      target={"_blank"}
      className="inline-flex justify-center rounded-full border border-solid border-transparent bg-neutral-100 px-4 py-1 text-xs font-semibold text-black/70 no-underline hover:bg-neutral-200"
    >
      <Icon className="mr-1 w-3" />
      {props.label}
    </a>
  );
};

export default AchievementRelatedLinkButton;
