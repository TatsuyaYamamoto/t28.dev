import { defineKeyframes } from "@pandacss/dev";

export const keyframes = defineKeyframes({
  sWorksSurfaceText: {
    from: {
      color: "#fff3e0",
      textShadow: "none",
    },
    to: {
      color: "#ffc69e",
      textShadow: `
  -3px -3px 5px rgba(255, 255, 255, 0.6),
  1px 2px 1px rgba(160, 160, 160, 0.5),
  2px 4px 2px rgba(160, 160, 160, 0.4),
  3px 6px 3px rgba(160, 160, 160, 0.3),
  4px 8px 4px rgba(160, 160, 160, 0.3),
  5px 10px 5px rgba(160, 160, 160, 0.2),
  6px 12px 6px rgba(160, 160, 160, 0.2),
  7px 13px 7px rgba(160, 160, 160, 0.1),
  8px 15px 8px rgba(160, 160, 160, 0.1);
  `,
    },
  },
  sWorksSurfaceSvg: {
    from: {
      fill: "#fff3e0",
      filter: "none",
    },
    to: {
      fill: "#ffc69e",
      filter: `
  drop-shadow(-3px -3px 5px rgba(255, 255, 255, 0.6))
  drop-shadow(1px 2px 1px rgba(160, 160, 160, 0.5))
  drop-shadow(3px 4px 2px rgba(160, 160, 160, 0.4))
  drop-shadow(4px 6px 3px rgba(160, 160, 160, 0.3))
  drop-shadow(5px 8px 4px rgba(160, 160, 160, 0.3))
  drop-shadow(6px 10px 5px rgba(160, 160, 160, 0.2));
`,
    },
  },
});
