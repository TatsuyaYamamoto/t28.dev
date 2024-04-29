import type { FC, HTMLAttributes, PropsWithChildren } from "react";
import { css } from "../../styled-system/css";

const chip = css({
  height: "var(--spacing-6)",

  display: "inline-flex",
  verticalAlign: "middle",
  justifyContent: "center",

  color: "[rgba(0, 0, 0, 0.87)]", // TODO use token
  backgroundColor: "[#e0e0e0]", // TODO use token
  borderRadius: "xl",

  "& > span": {
    paddingX: "var(--spacing-2)",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});

const Chip: FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  ...otherProps
}) => {
  return (
    <div {...otherProps} className={chip}>
      <span>{children}</span>
    </div>
  );
};

export default Chip;
