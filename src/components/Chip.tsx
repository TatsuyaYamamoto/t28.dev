import clsx from "clsx";
import type { FC, HTMLAttributes, PropsWithChildren } from "react";

const Chip: FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <div
      {...otherProps}
      className={clsx(
        "inline-flex h-6 justify-center rounded-xl bg-(--colors-neutral-100) align-middle text-black/87",
        className,
      )}
    >
      <span className="overflow-hidden px-2 overflow-ellipsis whitespace-nowrap">
        {children}
      </span>
    </div>
  );
};

export default Chip;
