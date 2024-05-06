import { defineGlobalStyles } from "@pandacss/dev";

export default defineGlobalStyles({
  html: {
    lineHeight: "var(--lineHeight-normal)",
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
  },

  body: {
    fontFamily: `"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif`,
    fontSize: "md",
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
    fontSize: "5xl",
    color: "var(--color-heading-black)",
  },

  "h2, h3, h4, h5, h6": {
    fontWeight: "bold",
    color: "var(--color-heading)",
  },

  h2: {
    fontSize: "4xl",
  },

  h3: {
    fontSize: "3xl",
  },

  h4: {
    fontSize: "2xl",
  },

  h5: {
    fontSize: "xl",
  },

  h6: {
    fontSize: "lg",
  },

  a: {
    color: "var(--color-primary)",
  },

  // markdown 内の img 要素 の aspect ratio 画像のものと同じにするために設定する
  img: {
    height: "auto",
  },
});
