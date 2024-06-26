import type { FC, HTMLAttributes, PropsWithChildren } from "react";
import { css, cx } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

const rootCss = css({
  height: "6",

  display: "inline-flex",
  verticalAlign: "middle",
  justifyContent: "center",

  color: "black/87",
  backgroundColor: "neutral.100",
  borderRadius: "xl",
});

const Label = styled("span", {
  base: {
    paddingX: "2",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

const Chip: FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <div {...otherProps} className={cx(rootCss, className)}>
      <Label>{children}</Label>
    </div>
  );
};

export default Chip;
