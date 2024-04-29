import type { FC } from "react";
import { css } from "../../styled-system/css";
import { container } from "../../styled-system/patterns";
import { TWITTER_NAME, TWITTER_URL } from "../constants";

const appFooter = css({
  marginTop: "var(--spacing-12)",
});

const footerInner = container({});

const footerCopyRight = css({
  paddingY: "var(--spacing-5)",
  textAlign: "center",
});

interface Props {}

const Footer: FC<Props> = () => {
  return (
    <footer className={appFooter}>
      <div className={footerInner}>
        <div className={footerCopyRight}>
          {`© ${new Date().getFullYear()} `}
          <a href={TWITTER_URL} target="_blank">
            {TWITTER_NAME}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
