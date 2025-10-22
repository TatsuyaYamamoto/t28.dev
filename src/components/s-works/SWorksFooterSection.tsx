import { type FC, useState } from "react";

import GithubIcon from "../../assets/icons/fa/github.svg?react";
import TwitterIcon from "../../assets/icons/fa/twitter.svg?react";

import SWorksLogo from "./SWorksLogo";

const SWorksFooterSection: FC = () => {
  const [thisYear] = useState(() => {
    const now = new Date();
    return now.getFullYear();
  });

  return (
    <footer className="py-5">
      <div className="py-10 text-center">
        <a href="/s-works">
          {/* TODO: check tailwind preflight policy (inline align-baseline) */}
          <SWorksLogo className="inline w-36 align-baseline" />
        </a>
      </div>
      <div className="mt-0 flex items-center justify-center gap-2">
        <a href={`https://twitter.com/T28_tatsuya`} target="_blank">
          <TwitterIcon className="block h-8 w-8 fill-(--color-twitter)" />
        </a>
        <a href={`https://github.com/TatsuyaYamamoto`} target="_blank">
          <GithubIcon className="block h-8 w-8 fill-(--color-github)" />
        </a>
      </div>
      <div className="mt-5 text-center">
        {`© 2021-${thisYear} s-works, All rights reserved.`}
      </div>
    </footer>
  );
};

export default SWorksFooterSection;
