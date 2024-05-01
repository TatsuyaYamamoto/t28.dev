import type { FC } from "react";
import { css } from "../../../styled-system/css";

import LogoSvg from "../../assets/images/s-works-logo.svg?react";

const root = css({
  "--icon-and-font-size": "50px",
  md: {
    "--icon-and-font-size": "100px",
  },

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "& h1": {
    whiteSpace: "nowrap",

    display: "inline-flex",
    alignItems: "center",
  },
});

const icon = css({
  fill: "transparent",
  width: "[var(--icon-and-font-size)]",
  height: "[var(--icon-and-font-size)]",
  animation: "[700ms sWorksSurfaceSvg 0s ease-out both]", // TODO use token
});

const text = css({
  color: "transparent",
  fontSize: "[var(--icon-and-font-size)]",
  fontFamily: "[sans-serif]",
  fontWeight: "semibold",
  animation: "[700ms sWorksSurfaceText 0s ease both]", // TODO use token
});

const IndexHero: FC = () => {
  return (
    <div className={root}>
      <h1>
        <LogoSvg className={icon} />
        <span className={text}>{`s-works`}</span>
      </h1>
    </div>
  );
};

export default IndexHero;
