import type { FC } from "react";

import { TWITTER_NAME, TWITTER_URL } from "../constants";

import Container from "./Container.tsx";

interface Props {}

const Footer: FC<Props> = () => {
  return (
    <footer className="mt-12">
      <Container>
        <div className="py-5 text-center">
          {`© ${new Date().getFullYear()} `}
          <a href={TWITTER_URL} target="_blank">
            {TWITTER_NAME}
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
