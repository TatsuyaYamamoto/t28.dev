import type { FC } from "react";

import { styled } from "@styled-system/jsx";

import Container from "../components/Container";
import { TWITTER_NAME, TWITTER_URL } from "../constants";

interface Props {}

const Footer: FC<Props> = () => {
  return (
    <styled.footer marginTop="12">
      <Container>
        <styled.div paddingY="5" textAlign="center">
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
