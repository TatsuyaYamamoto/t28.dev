import type { FC, HTMLAttributes, PropsWithChildren } from "react";

import style from "./Chip.module.scss";

const Chip: FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  ...otherProps
}) => {
  return (
    <div {...otherProps} className={style.root}>
      <span>{children}</span>
    </div>
  );
};

export default Chip;
