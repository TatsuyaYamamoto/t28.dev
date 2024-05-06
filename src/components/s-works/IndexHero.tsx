import type { FC } from "react";
import { css } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

import LogoSvg from "../../assets/images/s-works-logo.svg?react";

const Root = styled("div", {
  base: {
    "--icon-and-font-size": { base: "50px", md: "100px" },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "full",
    borderStyle: "solid",
    borderWidth: "4",
    borderColor: "var(--color-s-works)",
    boxSizing: "border-box",
  },
});

const animationBase = css.raw({
  animationDuration: "[800ms]",
  animationTimingFunction: "out",
  animationFillMode: "both",
});

const IndexHero: FC = () => {
  return (
    <Root>
      <styled.h1 display="inline-flex" alignItems="center">
        <LogoSvg
          className={css(animationBase, {
            fill: "transparent",
            width: "[var(--icon-and-font-size)]",
            height: "[var(--icon-and-font-size)]",
            animationName: "sWorksSurfaceSvg",
          })}
        />
        <span
          className={css(animationBase, {
            animationName: "sWorksSurfaceText",
            color: "transparent",
            fontSize: "[var(--icon-and-font-size)]",
            fontFamily: "var(--font-family-s-works)",
            fontWeight: "semibold",
          })}
        >
          {`s-works`}
        </span>
      </styled.h1>
    </Root>
  );
};

export default IndexHero;
