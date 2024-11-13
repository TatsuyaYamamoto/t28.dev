import { defineKeyframes } from "@pandacss/dev";

export const keyframes = defineKeyframes({
  sWorksSurface: {
    from: {
      fill: "#fff3e0",
      filter: "none",
    },
    to: {
      fill: "#ffc69e",
      filter: `
  drop-shadow(-3px -3px 5px rgba(255, 255, 255, 0.3))
  drop-shadow(1px 2px 1px rgba(160, 160, 160, 0.3))
  drop-shadow(3px 4px 2px rgba(160, 160, 160, 0.2))
  drop-shadow(4px 6px 3px rgba(160, 160, 160, 0.2))
  drop-shadow(5px 8px 4px rgba(160, 160, 160, 0.1))
  drop-shadow(6px 10px 5px rgba(160, 160, 160, 0.1));
`,
    },
  },
});
