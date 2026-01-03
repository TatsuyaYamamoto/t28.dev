---
title: "Astro の Markdown コンテンツを少し弄ってから *.astro で描画する"
date: 2024-09-07
modified: 2025-10-17
---

> 2025/10/17 更新:
>
> `ちょっと加工してから描画したい` というモチベーションはこのブログで "シンプルな ~~ちょっと変わった~~ 形式の記事" を作れるようにするためだったけれど、今の時点でその形式は消している...。
> あまり使わなかったから...。

Astro で Markdown コンテンツを [static に](https://docs.astro.build/en/guides/routing/#static-ssg-mode)描画するときの基本的な描画の流れ:

- Markdown ファイルを [コンテンツコレクション](https://docs.astro.build/ja/guides/content-collections/) で管理する
- コンテンツを [CollectionEntry](https://docs.astro.build/ja/reference/api-reference/#collection-entry-type) として読み込む
- [`render()`](https://docs.astro.build/ja/reference/api-reference/#render) で取得した `<Content />` を描画する

```astro
---
interface Props {
  post: CollectionEntry<"blog">;
}

export const getStaticPaths = async () => {
  // 👇 "blog" コンテンツコレクションの全てのコンテンツエントリーを取得する
  const allBlogPosts = await getCollection("blog");
  return allBlogPosts.map((post) => ({
    params: { slug: post.slug },
    // 👇 *.astro の prop としてコンテンツエントリーを渡す
    props: { post },
  }));
};

const { post } = Astro.props;

// 👇 コンテンツエントリーの描画(構築？)をして、Astro コンポーネントを取得する
const { Content } = await post.render();
---

<!-- 👇 Astro コンポーネントの Markdown コンテンツを描画する -->
<Content />
```

---

Markdown を HTML に変換したものをそのまま描画するのではなく、ちょっと加工したものを描画したくなった。
具体的には Markdown 内で `---` (HTML では `<hr>` に変換される) で区切られた文書を分割して、それぞれを `<article>` で囲った状態で描画したい。

これはこの Scrap ページを作るのためで、1 Markdown - 1 Page の構成を保ったまま、複数の記事の枠 ( article 要素 ) を作りたい。

---

コンテンツエントリーから取得できる Markdown コンテンツの中身の情報はそれなりに制限がある (https://docs.astro.build/ja/reference/api-reference/#collection-entry-type)

- `body`: Markdown の文字列

Markdown 文字列で受け取って自分で加工すると、自分で marked とかの変換処理をする必要がある。

- [`render()`](https://docs.astro.build/ja/reference/api-reference/#render) の戻り値の `<Content />` (Astro コンポーネント)

(多分) Astro コンポーネントを加工する utility は提供されていないので、これを弄ることが出来ない。

---

- https://docs.astro.build/ja/reference/api-reference/#markdown-files
- https://docs.astro.build/en/guides/markdown-content/#exported-properties

`Astro.glob()` でインポートした Markdown コンテンツのオブジェクトはコンテンツコレクションのものとプロパティが結構違う。

> (Markdown only) compiledContent() - A function that returns the Markdown document compiled to an HTML string. Note this does not include layouts configured in your frontmatter! Only the markdown document itself will be returned as HTML.

これを使えば HTML 文字列が取得できるので、今回やりたい加工には丁度よさそう。

---

```astro
---
// 👇 ここは同じ
export const getStaticPaths = async () => {
  const allBlogPosts = await getCollection("blog");
  return allBlogPosts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
};

// 👇 Astro.glob で Markdown コンテンツを取得する
const scrapMarkdowns: MarkdownInstance<{}>[] = await Astro.glob(
  "../../../docs/scrap/*.md",
);
const scrapMarkdown = scrapMarkdowns.find(({ file }) => {
  return file.includes(Astro.params.slug);
});

if (!scrapMarkdown) {
  throw new Error("not found scrap markdown file");
}

// 👇 HTML 文字列を取得しつつ、加工する
const htmlBlocks = scrapMarkdown.compiledContent().split("<hr>");
---

<ScrapPost>
  <!-- 👇 分割した要素をそれぞれ article で囲みつつ、描画する -->
  {htmlBlocks.map((htmlBlock) => <article set:html={htmlBlock} />)}
</ScrapPost>
```

本当は

```ts
const markdown = Astro.glob(`../../../docs/scrap/${slug}.md`);
```

って直接目当ての markdown ファイルにアクセスしたいけれど、内部で Vite の `import.meta.glob` を使っている都合上どうしようもなさそう。

https://github.com/withastro/astro/issues/3418

---

いちいちリストを取得して filter で絞るのは無駄なので、こういうロジックでも良いか。 (Astro のビルドは local に対するアクセスだから、速度に大差はないだろうけど...)

```astro
---
type Markdown = MarkdownInstance<
  CollectionEntry<"scrap">["data"] & { excerpt: string }
>;

interface Props {
  entry: CollectionEntry<"scrap">;
  markdown: Markdown;
}

export const getStaticPaths = async () => {
  // 👇 コンテンツコレクションじゃなくて、Astro.glob で リストを取得する
  const markdowns: Markdown[] = await Astro.glob("../../../docs/scrap/*.md");

  return Promise.all(
    markdowns.map(async (markdown) => {
      // 👇 ファイル名から slug を自分で解決する
      const slug = path.basename(markdown.file, ".md");
      // 👇 単一のコンテンツエントリーを取得する
      const entry = await getEntry("scrap", slug);
      return {
        params: { slug },
        props: { markdown, entry },
      };
    }),
  );
};

const htmlBlocks = Astro.props.markdown.compiledContent().split("<hr>");
---

<ScrapPost>
  {htmlBlocks.map((htmlBlock) => <article set:html={htmlBlock} />)}
</ScrapPost>
```

---

どちらも Astro の機能として Markdown を HTML に変換しているのに、

- Astro.glob
- コンテンツコレクション

で ふるまい (export されるプロパティ) が違うのはなんでだろう...。

**Astro.glob:**

`compiledContent()` は astro 内部の `vite-plugin-markdown` virtual module(?) として返す JavaScript のコードで定義している

https://github.com/withastro/astro/blob/astro%404.15.4/packages/astro/src/vite-plugin-markdown/index.ts#L40

**コンテンツコレクション:**

`vite-plugin-markdown` で読み込んだモジュール (`propagationMod`) を wrap した object を返却している

https://github.com/withastro/astro/blob/astro%404.15.4/packages/astro/src/content/runtime.ts#L553-L555

コンテンツコレクションは `vite-plugin-markdown` が構築した生 (?) の情報にアクセス出来ない構成になってる (アクセスしてすまん)
