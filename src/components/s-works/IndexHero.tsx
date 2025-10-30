import type { FC } from "react";

import SWorksLogo from "./SWorksLogo";

const IndexHero: FC = () => {
  return (
    <div className="box-border flex min-h-full items-center justify-center border-16 border-solid border-(--color-s-works)">
      <h1 className="inline-flex items-center">
        <SWorksLogo
          className="animate-s-works-surface w-[350px] md:w-[600px]"
          style={
            {
              // animationName: "sWorksSurface",
              // animationFillMode: "both",
              // animationDuration: "800ms",
            }
          }
        />
      </h1>
    </div>
  );
};

export default IndexHero;
