import { definePattern } from "@pandacss/dev";

export const container = definePattern({
  transform(props) {
    const pandaDefault = {
      position: "relative",
      maxWidth: "8xl",
      mx: "auto",
      px: { base: "4", md: "6", lg: "8" },
      ...props,
    };

    return {
      ...pandaDefault,
      maxWidth: "1200px",
      mx: "auto",
      px: "var(--spacing-4)",
    };
  },
});
