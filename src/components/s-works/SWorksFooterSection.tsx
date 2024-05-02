import { type FC, useState } from "react";
import { css } from "@styled-system/css";

import GithubIcon from "../../assets/icons/fa/github.svg?react";
import TwitterIcon from "../../assets/icons/fa/twitter.svg?react";

import SWorksLogo from "./SWorksLogo";

const root = css({
  paddingY: "var(--spacing-5)",
});

const logo = css({
  textAlign: "center",
  paddingY: "var(--spacing-10)",
});

const links = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "var(--spacing-0)",

  "& a:first-child": {
    marginRight: "var(--spacing-2)",
  },

  "& svg": {
    display: "block",
    width: "var(--spacing-8)",
    height: "var(--spacing-8)",
  },
});

const twitter = css({
  fill: "var(--color-twitter)",
});

const github = css({
  fill: "var(--color-github)",
});

const copyright = css({
  marginTop: "var(--spacing-5)",
  textAlign: "center",
});

const SWorksFooterSection: FC = () => {
  const [thisYear] = useState(() => {
    const now = new Date();
    return now.getFullYear();
  });

  return (
    <footer className={root}>
      <div className={logo}>
        <a href="/s-works">
          <SWorksLogo />
        </a>
      </div>
      {/*HStack*/}
      <div className={links}>
        <a href={`https://twitter.com/T28_tatsuya`} target="_blank">
          <TwitterIcon className={twitter} />
        </a>
        <a href={`https://github.com/TatsuyaYamamoto`} target="_blank">
          <GithubIcon className={github} />
        </a>
      </div>
      <div className={copyright}>
        {`© 2021-${thisYear} s-works, All rights reserved.`}
      </div>
    </footer>
  );
};

export default SWorksFooterSection;
