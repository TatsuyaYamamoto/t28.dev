import type { FC, HTMLAttributes, PropsWithChildren } from "react";
import { css } from "../../styled-system/css";

const chip = css({
  height: "24px",

  display: "inline-flex",
  verticalAlign: "middle",
  justifyContent: "center",

  color: "rgba(0, 0, 0, 0.87)",
  backgroundColor: "#e0e0e0",
  borderRadius: "16px",

  "& > span": {
    paddingLeft: "8px",
    paddingRight: "8px",
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
