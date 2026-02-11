import { SITE_URL } from "../constants.ts";

import GitHubSvg from "../assets/icons/fa/github.svg?react";
import RssSvg from "../assets/icons/fa/rss.svg?react";
import HumansTxtSvg from "../assets/icons/humans-txt-org-logo.svg?react";

const FixedFooter = () => {
  return (
    // wrapper for safe-area
    <div className="bg-t28-dev-bg border-t-accent fixed bottom-0 z-10 w-full border-t pb-[env(safe-area-inset-bottom)]">
      {/* main section */}
      <div className="flex h-12 items-center px-4">
        <div className="flex-1"></div>
        <div className="flex gap-4">
          <a href={`${SITE_URL}/rss.xml`}>
            <RssSvg className="fill-rss h-6 w-6 align-top" />
          </a>
          <a href="https://github.com/TatsuyaYamamoto/t28.dev">
            <GitHubSvg className="fill-github h-6 w-6 align-top" />
          </a>
          <a href={`${SITE_URL}/humans.txt`}>
            <HumansTxtSvg className="h-6 w-6 align-top" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FixedFooter;
