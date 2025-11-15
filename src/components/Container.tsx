import type { FC, PropsWithChildren } from "react";

import clsx from "clsx";

const Container: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx("relative mx-auto max-w-[1200px] px-4", className)}>
      {children}
    </div>
  );
};

export default Container;
