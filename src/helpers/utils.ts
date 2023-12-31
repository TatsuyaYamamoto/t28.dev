import type { MarkdownHeading } from "astro";
import type { TocItems } from "../components/Toc";

export const headingToTocItems = (headings: MarkdownHeading[]): TocItems => {
  // h2, h3 のみを toc のターゲットにする ~~h4 以降も target にするの大変だし...~~
  const targetHeadings = headings.filter(({ depth }) => 1 < depth && depth < 4);
  const tocItems: TocItems = [];

  targetHeadings.forEach((heading) => {
    const item = {
      title: heading.text,
      url: `#${heading.slug}`,
      depth: heading.depth,
      children: [],
    };

    if (tocItems.length === 0) {
      // 1st item
      tocItems.push(item);
      return;
    }

    const lastTocItem = tocItems[tocItems.length - 1];
    if (lastTocItem === undefined) {
      throw new Error(`unexpected. no last toc item`);
    }

    if (heading.depth === lastTocItem.depth) {
      // same depth item
      tocItems.push(item);
      return;
    }

    // higher depth item
    lastTocItem.children.push(item);
  });

  return tocItems;
};

export const formatDisplayDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = date.getMonth();
  const dd = date.getDate();

  return `${yyyy}/${mm}/${dd}`;
};
