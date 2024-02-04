import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { visit } from "unist-util-visit";
import { renderMermaid as renderMermaidCli } from "@mermaid-js/mermaid-cli";
import puppeteer from "puppeteer";
import type { Code, Parent, Html } from "mdast";

interface MermaidCodeBlock {
  code: Code;
  index: number;
  parent: Parent;
}

export const mermaidPlugin: RemarkPlugin<[]> = () => {
  return async (root) => {
    // find "mermaid" code blocks
    const mermaidCodeBlocks: MermaidCodeBlock[] = [];
    visit(root, "code", (code, index, parent) => {
      if (code.lang === "mermaid" && index !== null && parent !== null) {
        mermaidCodeBlocks.push({ code, index, parent });
      }
    });

    if (mermaidCodeBlocks.length === 0) {
      // no mermaid code blocks are found in markdown file
      return;
    }

    const browser = await puppeteer.launch({
      headless: true,
    });

    for (const { code, index, parent } of mermaidCodeBlocks) {
      const { data: svgBuffer } = await renderMermaidCli(
        browser,
        code.value,
        "svg",
      );
      const svgNode: Html = {
        type: "html",
        value: svgBuffer
          .toString("utf-8")
          // astro(?) throws error on rendering svg of mermaid.
          // https://github.com/withastro/astro/issues/9856
          // set "Default implied ARIA semantics" value as workaround.
          // https://svgwg.org/svg2-draft/struct.html#implicit-aria-semantics
          .replace(
            `role="graphics-document document"`,
            `role="graphics-document"`,
          ),
      };

      // overwrite "code node" with "html node" to render svg element
      parent.children[index] = svgNode;
    }

    await browser.close();
  };
};
