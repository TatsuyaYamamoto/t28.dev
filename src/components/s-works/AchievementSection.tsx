import clsx from "clsx";
import type { FC, PropsWithChildren } from "react";

import { formatDisplayDate } from "../../helpers/utils";

interface Props {
  posts: {
    url: string;
    title: string;
    description: string;
    date: Date;
    heroImage: { src: string };
  }[];
}

const AchievementSection: FC<PropsWithChildren<Props>> = ({ posts }) => {
  return (
    <section className="bg-(--color-s-works) px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h2
          // TODO use token
          className="font-sans text-[2.5rem] font-semibold text-(--colors-white) md:text-[5rem]"
        >
          {`Achievements`}
        </h2>
        <div
          className={clsx({
            "& a:not(:first-child)": {
              marginTop: "8",
            },
          })}
        >
          {posts.map(({ url, title, date, description, heroImage }) => (
            <a
              key={url}
              href={url}
              className="flex flex-col bg-(--colors-white) text-(--color-black) no-underline md:flex-row"
            >
              <div className="items-[unset] flex flex-1 gap-4 p-5">
                <h3 className="m-0 text-xl">{title}</h3>
                <p>{formatDisplayDate(date)}</p>
                <p>{description}</p>
              </div>
              <div className="w-full md:max-w-72">
                <img
                  alt={""}
                  src={heroImage.src}
                  className={clsx({ objectFit: "cover", height: "full" })}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementSection;
