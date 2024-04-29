import type { FC } from "react";
import { css } from "../../../styled-system/css";

import LogoSvg from "../../assets/images/s-works-logo.svg?react";

const root = css({
  display: "inline-flex",
  alignItems: "center",
  color: "var(--color-s-works)",
  fontSize: "[25px]", // TODO use token
  fontFamily: "[sans-serif]", // TODO use token
  fontWeight: "[600]", // TODO use token

  "& > svg": {
    width: "[30px]", // TODO use token
    marginRight: "[5px]", // TODO use token
    fill: "[currentColor !important]", // TODO use token
  },
});

const SWorksLogo: FC = () => {
  return (
    <span className={root}>
      <LogoSvg /> {`s-works`}
    </span>
  );
};

export default SWorksLogo;
