export const isHTMLAnchorElement = (el: any): el is HTMLAnchorElement => {
  return el.tagName === "A";
};
