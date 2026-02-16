import { useEffect, useRef, useState } from "react";
import { SITE_URL } from "../constants.ts";

import GitHubSvg from "../assets/icons/fa/github.svg?react";
import RssSvg from "../assets/icons/fa/rss.svg?react";
import TwitterSvg from "../assets/icons/fa/twitter.svg?react";
import HumansTxtSvg from "../assets/icons/humans-txt-org-logo.svg?react";
import SworksIconSvg from "../assets/images/s-works-logo-icon.svg?react";

const FixedFooter = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // スクロールダウン（下方向）で隠す
      if (currentScrollY > lastScrollY.current && currentScrollY > 300) {
        setIsVisible(false);
      }
      // スクロールアップ（上方向）で表示
      else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    // wrapper for safe-area
    <div
      className="bg-t28-dev-bg border-t-accent fixed bottom-0 z-10 w-full border-t pb-[env(safe-area-inset-bottom)] transition-transform duration-300"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(100%)",
      }}
      {
        // TODO: see https://github.com/TatsuyaYamamoto/t28.dev/pull/244#discussion_r2793621706
        ...{ inert: isVisible ? undefined : "" }
      }
    >
      {/* main container */}
      <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-end px-4">
        <div className="flex gap-4">
          <a
            className="rounded-full p-1"
            href="https://t28.dev/s-works"
            aria-label="s-works"
          >
            <SworksIconSvg className="h-6 w-6 align-top" />
          </a>
          <a
            className="rounded-full p-1"
            href="https://x.com/T28_tatsuya"
            aria-label="Twitter"
          >
            <TwitterSvg className="fill-twitter h-6 w-6 align-top" />
          </a>
          <a
            className="rounded-full p-1"
            href="https://github.com/TatsuyaYamamoto/t28.dev"
            aria-label="GitHub"
          >
            <GitHubSvg className="fill-github h-6 w-6 align-top" />
          </a>
          <a
            className="rounded-full p-1"
            href={`${SITE_URL}/rss.xml`}
            aria-label="RSS Feed"
          >
            <RssSvg className="fill-rss h-6 w-6 align-top" />
          </a>
          <a
            className="rounded-full p-1"
            href={`${SITE_URL}/humans.txt`}
            aria-label="humans.txt"
          >
            <HumansTxtSvg className="h-6 w-6 align-top" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FixedFooter;
