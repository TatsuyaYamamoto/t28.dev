import { type FC, useState } from "react";
import { css } from "@styled-system/css";
import { Center, styled } from "@styled-system/jsx";

import GithubIcon from "../../assets/icons/fa/github.svg?react";
import TwitterIcon from "../../assets/icons/fa/twitter.svg?react";

import SWorksLogo from "./SWorksLogo";

const icon = css.raw({
  display: "block",
  width: "var(--spacing-8)",
  height: "var(--spacing-8)",
});

const SWorksFooterSection: FC = () => {
  const [thisYear] = useState(() => {
    const now = new Date();
    return now.getFullYear();
  });

  return (
    <styled.footer paddingY="var(--spacing-5)">
      <styled.div textAlign="center" paddingY="var(--spacing-10)">
        <a href="/s-works">
          <SWorksLogo />
        </a>
      </styled.div>
      <Center marginTop="var(--spacing-0)" gap="var(--spacing-2)">
        <a href={`https://twitter.com/T28_tatsuya`} target="_blank">
          <TwitterIcon
            className={css(icon, { fill: "var(--color-twitter)" })}
          />
        </a>
        <a href={`https://github.com/TatsuyaYamamoto`} target="_blank">
          <GithubIcon className={css(icon, { fill: "var(--color-github)" })} />
        </a>
      </Center>
      <styled.div marginTop="var(--spacing-5)" textAlign="center">
        {`© 2021-${thisYear} s-works, All rights reserved.`}
      </styled.div>
    </styled.footer>
  );
};

export default SWorksFooterSection;
