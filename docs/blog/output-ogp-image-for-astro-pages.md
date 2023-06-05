---
title: "@vercel/og を使って Astro 製ブログのビルド時に OGP 画像を出力する"
date: 2023/06/03
---

最近流行っているから、ブログの Astro 移行に合わせてやってみた。

![](https://t28.dev/blog/output-ogp-image-for-astro-pages/ogp.png)

## @vercel/og?

ref: "[OGP 画像を作る時に @vercel/og を使うか satori を使うか迷ったログ](./vercel-og-or-satori-for-me)"

> @vercel/og の中では
>
> - satori 用の default 値 (`width`, `height`, `fonts`) を渡したり、
> - satori とは別で必要な処理 (`loadAdditionalAsset`, google font 読み込み, emoji 読み込み) をやってくれたり、
> - satori で React element から SVG を作ってくれたり、
> - satori の出力結果 (SVG) を PNG にしてくれたり、
> - HTTP Header 付きの Response オブジェクトを作ったり
>
> してくれている。

## OGP 画像のエンドポイントを作る

ref: [Static File Endpoints](https://docs.astro.build/en/core-concepts/endpoints/#static-file-endpoints)

Astro のカスタムエンドポイント用の `.ts` ファイルを `src/pages/blog/[slug]/ogp.png.ts` に作ります。
これで、`/blog/output-ogp-image-for-astro-pages` というパスのページの OGP 画像を
`/blog/output-ogp-image-for-astro-pages/ogp.png` というパスで取得できるようにします。

[getStaticPaths()](https://docs.astro.build/ja/reference/api-reference/#getstaticpaths) 内で
ページの slug を参照して、`[slug]` に対応させます。

```ts
// src/pages/blog/[slug]/ogp.png.ts

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => ({ params: { slug: post.slug } }));
};
```

エンドポイントの中身は `get()` で実装する。

```ts
// src/pages/blog/[slug]/ogp.png.ts
export const get: APIRoute = async ({ params }) => {
  if (!params.slug) {
    return { body: "not found", encoding: "utf8" };
  }

  // 👇 ブログのタイトルを取得して
  const post = await getEntry("blog", params.slug);

  // 👇 画像を作成 (後述) してレスポンスする
  return getBlogPostOgpImageResponse({
    title: post?.data.title ?? "No title",
  });
};
```

## Google Fonts を読み込む

`@vercel/og` が default で読み込む font ファイルは `noto-sans-v27-latin-regular.ttf` なので ([ref](./https://www.unpkg.com/@vercel/og@0.5.6/dist/index.node.js))、日本語の文字を描画するために font の設定を追加する必要があります。

フォントファイルの読み込みは [@vercel/og の実装](https://www.unpkg.com/@vercel/og@0.5.6/dist/index.node.js) を参考にしつつ、こんな感じで。

```ts
/**
 * ref: https://www.unpkg.com/@vercel/og@0.5.6/dist/index.node.js
 */
const getGoogleFontData = async (query: string): Promise<ArrayBuffer> => {
  // 👇 @vercel/og では関数実行の度に API を呼び出しているけれど、キャッシュする
  const cached = fontFamilyDataCache.get(query);
  if (cached) {
    console.log(`[ogp-font] cache-hit: ${query}`);
    return cached;
  }
  console.log(`[ogp-font] cache-miss: ${query}`);

  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${query}`;

  // 👇 @vercel/og では User-Agent を偽装しているけれど、なんとなく、お行儀が悪いので素直に fetch する
  const googleFontCss = await fetch(googleFontUrl).then((res) => res.text());

  // 👇 CSS ファイルからフォントファイルの URL を抽出する
  const fontUrl = googleFontCss.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  )?.[1];

  if (!fontUrl) {
    throw new Error(`unexpected. css data is invalid -> ${googleFontCss}`);
  }

  const arrayBuffer = await fetch(fontUrl).then((res) => res.arrayBuffer());

  // cache
  fontFamilyDataCache.set(query, arrayBuffer);

  return arrayBuffer;
};
```

## Local 上の画像を Data URL として読み込む

OGP 画像にプロフィール画像を埋め込んでみたい。

`<img />` を使うときは、src 属性に ArrayBuffer か Data URL を使うと良い[^1]と [satori のドキュメント](https://github.com/vercel/satori#images) に書いてあるので、Local 画像を Data URL として読み込む [^2]。

```ts
const t28ProfileBase64 = readFileSync(
  new URL("../assets/images/profile-pic.jpg", import.meta.url),
  { encoding: "base64" }
);
const t28ProfileDataUrl = `data:image/jpeg;base64,${t28ProfileBase64}`;
```

## ImageResponse を作成する

ブログタイトルを引数に ImageResponse オブジェクトを返す関数を作る。前述の通り、これをそのままレスポンスとして使う。

```tsx
export const getBlogPostOgpImageResponse = async (params: {
  title: string;
}) => {
  // 👇 import("@vercel/og").ImageResponse は、実質 Response なので、cast しちゃう
  // ref: https://t28.dev/blog/vercel-og-or-satori-for-me
  return asResponse(
    new ImageResponse(
      (
        // 👇 README でもあまり目立たないけれど、lang 設定大事
        // ref: https://github.com/vercel/satori#locales
        <div lang="ja-JP" style={/* 略 */}>
          <div style={/* 略 */}>
            <div style={/* 略 */}>{params.title}</div>
            <div style={/* 略 */}>
              <div style={/* 略 */} />
              {/* 👇 画像は Data URL (文字列) として渡す */}
              <img src={t28ProfileDataUrl} alt="" style={/* 略 */} />
              <div style={/* 略 */}>t28.dev</div>
            </div>
          </div>
        </div>
      ),
      {
        fonts: [
          {
            name: "Noto Sans JP",
            data: await getGoogleFontData("Noto+Sans+JP:wght@700"),
            style: "normal",
          },
        ],
      }
    )
  );
};
```

[^1]: というか、出来ない。`http` または `data:` で始まる文字列を `@vercel/og` 内部で求められる
[^2]: src 属性に 文字列型以外を入れたくない...。
