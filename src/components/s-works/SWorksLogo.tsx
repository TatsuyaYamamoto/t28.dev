import type { FC } from "react";
import { styled } from "@styled-system/jsx";

import LogoSvg from "../../assets/images/s-works-logo.svg?react";

const Root = styled("span", {
  base: {
    display: "inline-flex",
    alignItems: "center",
    color: "var(--color-s-works)",
    fontSize: "[25px]", // TODO use token
    fontFamily: "var(--font-family-s-works)",
    fontWeight: "semibold",
  },
});

const StyledLogoSvg = styled(LogoSvg, {
  base: {
    width: "[30px]", // TODO use token
    marginRight: "[5px]", // TODO use token
    fill: "current !important",
  },
});

const SWorksLogo: FC = () => {
  return (
    <Root>
      <StyledLogoSvg /> {`s-works`}
    </Root>
  );
};

export default SWorksLogo;
