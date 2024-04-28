import type { FC } from "react";
import { css } from "../../../styled-system/css";

import LogoSvg from "../../assets/images/s-works-logo.svg?react";

const root = css({
  display: "inline-flex",
  alignItems: "center",
  color: "#ffc69e",
  fontSize: "25px",
  fontFamily: "sans-serif",
  fontWeight: "600",

  "& > svg": {
    width: "30px",
    marginRight: "5px",
    fill: "currentColor !important",
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
