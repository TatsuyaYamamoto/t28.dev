import type { FC } from "react";

import { Container, styled } from "@styled-system/jsx";

import { TWITTER_NAME, TWITTER_URL } from "../constants";

interface Props {}

const Footer: FC<Props> = () => {
  return (
    <styled.footer marginTop="var(--spacing-12)">
      <Container>
        <styled.div paddingY="var(--spacing-5)" textAlign="center">
          {`© ${new Date().getFullYear()} `}
          <a href={TWITTER_URL} target="_blank">
            {TWITTER_NAME}
          </a>
        </styled.div>
      </Container>
    </styled.footer>
  );
};

export default Footer;
