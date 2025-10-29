// @ts-ignore
import { defineGlobalStyles } from "@pandacss/dev";

export default defineGlobalStyles({
  html: {
    lineHeight: "var(--lineHeight-normal)",
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
  },

  body: {
    fontFamily: `"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif`,
    fontSize: "var(--fontSize-1)",
    color: "var(--color-text)",
    backgroundColor: "rgba(242, 242, 248, 0.5)",
  },

  "h1, h2, h3, h4, h5, h6": {
    marginTop: "12",
    marginBottom: "6",
    lineHeight: "var(--lineHeight-tight)",
    letterSpacing: "-0.025em",

    "& > a": {
      textDecoration: "none",
      color: "inherit",
    },
  },

  h1: {
    fontWeight: "black",
    fontSize: "var(--fontSize-6)",
    color: "var(--color-heading-black)",
  },

  "h2, h3, h4, h5, h6": {
    fontWeight: "bold",
    color: "var(--color-heading)",
  },

  h2: {
    fontSize: "var(--fontSize-5)",
  },

  h3: {
    fontSize: "var(--fontSize-4)",
  },

  h4: {
    fontSize: "var(--fontSize-3)",
  },

  h5: {
    fontSize: "var(--fontSize-2)",
  },

  h6: {
    fontSize: "var(--fontSize-1)",
  },

  a: {
    color: "var(--color-primary)",
  },

  // markdown 内の img 要素 の aspect ratio 画像のものと同じにするために設定する
  img: {
    height: "auto",
  },
});
