import { styled } from "@styled-system/jsx";
import type { FC } from "react";

import SWorksLogo from "./SWorksLogo";

const Root = styled("div", {
  base: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "full",
    borderStyle: "solid",
    borderWidth: "var(--spacing-4)",
    borderColor: "var(--color-s-works)",
    boxSizing: "border-box",
  },
});

// @ts-expect-error
const StyledSWorksLogo = styled(SWorksLogo, {
  base: {
    width: { base: "[350px]", md: "[600px]" },
    animationName: "sWorksSurface",
    animationDuration: "[800ms]",
    animationTimingFunction: "out",
    animationFillMode: "both",
  },
});

const IndexHero: FC = () => {
  return (
    <Root>
      <styled.h1 display="inline-flex" alignItems="center">
        <StyledSWorksLogo />
      </styled.h1>
    </Root>
  );
};

export default IndexHero;
