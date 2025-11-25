import type { FC, PropsWithChildren } from "react";

import { formatDisplayDate } from "../../helpers/utils";
import AchievementRelatedLinkButton from "./AchievementRelatedLinkButton";

interface Props {
  title: string;
  date: Date;
  links: {
    href: string;
    type: "twitter" | "external";
    label: string;
  }[];
}

const AchievementPost: FC<PropsWithChildren<Props>> = ({
  children,
  title,
  date,
  links,
}) => {
  return (
    <div>
      <header>
        <h1 className="mt-8 mb-0 text-3xl leading-snug">{title}</h1>
        <div className="mt-3">
          <time>{formatDisplayDate(date)}</time>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {links.map(({ href, label, type }, i) => (
            <AchievementRelatedLinkButton
              key={i}
              href={href}
              type={type}
              label={label}
            />
          ))}
        </div>
      </header>
      <hr className="my-8 border-0 border-t-1 border-slate-200" />
      <article className="s-works-achievement-post">{children}</article>
    </div>
  );
};

export default AchievementPost;
