---
title: "Gatsby(-plugin-mdx) の excerpt を Astro で再現する"
date: 2023-06-08
---

## Gatsby(-plugin-mdx) の excerpt

Gatsby 製の Markdown 記事の情報を `gatsby-plugin-mdx` を使って GraphQL から取得するとき、各記事の抜粋文を `excerpt` プロパティから取得できます。 ("抜粋文" は https://t28.dev の記事リストを見て)

```ts
export const pageQuery = graphql`
  query {
    posts: allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
      }
    }
  }
`;
```

特別な設定・実装要らず[^1]で、簡単な記事の説明文を取得出来るため便利だったのですが、Astro の Markdown 機能や MDX プラグインには同等の機能が...ない。ブログ記事毎に frontmatter で description を書くのも面倒なので、 excerpt 機能は欲しい... 🥺

`gatsby-plugin-mdx` のドキュメントによると、`excerpt` は [rehype-infer-description-meta](https://github.com/rehypejs/rehype-infer-description-meta) を元にした機能らしい。

> excerpt: A pruned variant of your content. By default trimmed to 140 characters. Based on [rehype-infer-description-meta](https://github.com/rehypejs/rehype-infer-description-meta).
>
> ref: https://www.gatsbyjs.com/plugins/gatsby-plugin-mdx/#graphql-mdx-node-structure

また、Astro は [markdown.rehypePlugins](https://docs.astro.build/ja/reference/configuration-reference/#markdownrehypeplugins) で Rehype のプラグインを渡して Markdown のビルドをカスタマイズ出来る[^2]ので、うまいこと Astro でも Gatsby でやってた `exceprt` を再現しようと思います。

## rehype-infer-description-meta を Astro に渡す (だめ)

型チェックが通るので `markdown.rehypePlugins` に `rehype-infer-description-meta` をそのまま渡してみましたが、動かん 🥺 (`.astro` ファイルから excerpt を参照出来ない)

```ts
import { defineConfig } from "astro/config";
import rehypeInferDescriptionMeta from "rehype-infer-description-meta";

export default defineConfig({
  // ...
  markdown: {
    rehypePlugins: [inferDescriptionMetaPlugin],
  },
  // ...
});
```

## 調査

`rehype-infer-description-meta` の実装を見てみると、RehypePlugin が受け取る `file` オブジェクトに `description` を書き込んでいるっぽい。これがなんやかんやあって、GraphQL 上では `excerpt` として受け取れるのかな(多分)。

```js
export default function rehypeInferDescriptionMeta(options = {}) {
  // ...
  return (tree, file) => {
    // ...
    const meta = file.data.meta || (file.data.meta = {});

    meta.description = toText(fragment);
    // ...
  };
}
```

一方 Astro では、RehypePlugin (または RemarkPlugin) 内の `file.data.astro.frontmatter` を操作して frontmatter プロパティを追加出来る。
(ref: [プログラムによるフロントマターの変更](https://docs.astro.build/ja/guides/markdown-content/#%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%A0%E3%81%AB%E3%82%88%E3%82%8B%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%83%9E%E3%82%BF%E3%83%BC%E3%81%AE%E5%A4%89%E6%9B%B4))

```js
export function exampleRemarkPlugin() {
  return function (tree, file) {
    file.data.astro.frontmatter.customProperty = "生成されたプロパティ";
  };
}
```

既存の RehypePlugin をそのまま使えないとはいえ、 1 から自分で実装した plugin を持ち続けるのは辛い。
`rehype-infer-description-meta` を実行して細かい処理はお任せしつつ、`meta.description` の値を `file.data.astro.frontmatter.excerpt` に渡す部分だけ自前の実装でやることにしました。

ま、Astro で Rehype/Remark を活用した frontmatter のカスタマイズは **Not recommended. って書いてあるけどね 😊** (ref: [Modifying Frontmatter with Remark](https://docs.astro.build/ja/guides/content-collections/#modifying-frontmatter-with-remark))

## rehype-infer-description-meta をラップした オレオレプラグインを Astro に渡す (妥協)

これ (https://github.com/TatsuyaYamamoto/t28.dev/blob/main/src/plugins/inferDescriptionMetaPlugin.ts) で、こう (https://t28.dev) なった

```ts
// src/plugins/inferDescriptionMetaPlugin.ts
import rehypeInferDescriptionMeta from "rehype-infer-description-meta";

import type {
  RehypePlugin,
  MarkdownAstroData,
} from "@astrojs/markdown-remark/dist/types";

export const inferDescriptionMetaPlugin: RehypePlugin = () => {
  // 👇 `rehype-infer-description-meta` を実行して細かい処理はお任せしつつ
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

    // 👇 `meta.description` の値を `file.data.astro.frontmatter.excerpt` に渡す部分だけ自前の実装
    (file.data.astro as MarkdownAstroData).frontmatter.excerpt =
      // rehype-infer-description-meta は結果の文字列を meta.description に上書きする
      // https://github.com/rehypejs/rehype-infer-description-meta/blob/main/index.js#L92
      file.data.meta?.description;
  };
};
```

~~内部実装知りまくっているラッパーなんだけれど、これで...いいのか？ってなってる。~~

## 副作用

[Modifying Frontmatter with Remark](https://docs.astro.build/ja/guides/content-collections/#modifying-frontmatter-with-remark) に書いてある通り、
Remark/Rehype のプラグインはコンテンツを描画する時に実行するので、今回の `excerpt` もコンテンツを描画しないと取得することが出来ない。
つまりブログ記事リストを描画するとき、 リストアイテム毎の `exceprt` を取得するためにアイテム数分 `render()` を実行する必要がある...😇😇😇😇😇 さらばビルドパフォーマンス... 😇😇😇😇😇

[^1]: 正確には `gatsby-plugin-mdx` plugin が必要だけれど、official plugin だし 実質 build-in な機能ってことで...。
[^2]: Remark でもよい
