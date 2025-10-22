import { css } from "@styled-system/css";
import { Center, styled } from "@styled-system/jsx";
import { type FC, useState } from "react";

import GithubIcon from "../../assets/icons/fa/github.svg?react";
import TwitterIcon from "../../assets/icons/fa/twitter.svg?react";

import SWorksLogo from "./SWorksLogo";

const icon = css.raw({
  display: "block",
  width: "8",
  height: "8",
});

const StyledSWorksLogo = styled(SWorksLogo, {
  base: {
    width: "36",
  },
});

const SWorksFooterSection: FC = () => {
  const [thisYear] = useState(() => {
    const now = new Date();
    return now.getFullYear();
  });

  return (
    <styled.footer paddingY="5">
      <styled.div textAlign="center" paddingY="10">
        <a href="/s-works">
          <StyledSWorksLogo />
        </a>
      </styled.div>
      <Center marginTop="0" gap="2">
        <a href={`https://twitter.com/T28_tatsuya`} target="_blank">
          <TwitterIcon
            className={css(icon, { fill: "var(--color-twitter)" })}
          />
        </a>
        <a href={`https://github.com/TatsuyaYamamoto`} target="_blank">
          <GithubIcon className={css(icon, { fill: "var(--color-github)" })} />
        </a>
      </Center>
      <styled.div marginTop="5" textAlign="center">
        {`© 2021-${thisYear} s-works, All rights reserved.`}
      </styled.div>
    </styled.footer>
  );
};

export default SWorksFooterSection;
