import { type FC, useState } from "react";
import { css } from "../../../styled-system/css";

import GithubIcon from "../../assets/icons/fa/github.svg?react";
import TwitterIcon from "../../assets/icons/fa/twitter.svg?react";

import SWorksLogo from "./SWorksLogo";

const root = css({
  padding: "var(--spacing-5) 0",
});

const logo = css({
  textAlign: "center",
  padding: "var(--spacing-10) 0",
});

const links = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 0,

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
  fill: "#1da1f2",
});

const github = css({
  fill: "#000000",
});

const copyright = css({
  marginTop: "20px",
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
