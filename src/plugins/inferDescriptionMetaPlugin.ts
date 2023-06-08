import rehypeInferDescriptionMeta from "rehype-infer-description-meta";

import type {
  RehypePlugin,
  MarkdownAstroData,
} from "@astrojs/markdown-remark/dist/types";

export const inferDescriptionMetaPlugin: RehypePlugin = () => {
  const meta = rehypeInferDescriptionMeta() ?? null;

  return (tree, file) => {
    if (!meta) {
      return;
    }

    const dummyCallback = () => {
      // 型上は meta(node: Root, file: VFile, next: TransformCallback) となっているが、 `next` は実装上は定義されていない
      // https://github.com/rehypejs/rehype-infer-description-meta/blob/main/index.js#L61
    };
    meta(tree, file, dummyCallback);

    (file.data.astro as MarkdownAstroData).frontmatter.excerpt =
      // rehype-infer-description-meta は結果の文字列を meta.description に上書きする
      // https://github.com/rehypejs/rehype-infer-description-meta/blob/main/index.js#L92
      file.data.meta?.description;
  };
};
