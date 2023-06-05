---
title: "OGP 画像を作る時に @vercel/og を使うか satori を使うか迷ったログ"
date: 2023-06-03
---

動的な OGP 画像の出力手段として、[@vercel/og](https://www.npmjs.com/package/@vercel/og) と [satori](https://www.npmjs.com/package/satori) をよく聞くようになりましたね。
「自分のブログ (ここ) もこれらを使って OGP 画像を作りたいけど...どっち使おう？」ってなったので、色々調べたことをメモします。

## satori?

- https://www.npmjs.com/package/satori
- JSX (HTML, CSS) を SVG に変換くん
- https://satori-playground.vercel.app/ で色々試せて便利！

> To use Satori in your project to generate PNG images like Open Graph images and social cards, check out our announcement and Vercel’s Open Graph Image Generation
>
> https://github.com/vercel/satori

って書いているし、@vercel/og 使えば良さそうだな... (終わり)

## @vercel/og?

- https://www.npmjs.com/package/@vercel/og
- React element を描画して PNG のレスポンス作るくん
  - Node.js Runtime、 Edge Runtime をサポートしているので、 Vercel 以外でも使える
- [satori を内包している](https://www.unpkg.com/@vercel/og@0.5.6/package.json)

## 私のお気持ち

🤔 satori を使って自分で Options やら画像変換やらをしてもいいんだけれど... @vercel/og に乗っかるだけで済む方が嬉しいな...

## @vercel/og がやっていること

@vercel/og はリポジトリを公開していない[^1]ので、unpkg でソースコードを覗いてみる。

https://www.unpkg.com/@vercel/og@0.5.6/dist/index.node.js

`@vercel/og` で実装しているコードは少なかった

- `src/index.node.ts`
- `src/emoji/index.ts`
- `src/og.ts`

### `src/index.node.ts`

[型情報](https://www.unpkg.com/@vercel/og@0.5.6/dist/index.node.d.ts) からはどんなクラスがさっぱり分からない `ImageResponse class` が定義されている。

`ImageResponse` (の constructor) でやっていること

1. satori, @resvg+resvg-wasm の描画結果 (PNG 画像) から [ReadableStream](https://developer.mozilla.org/ja/docs/Web/API/ReadableStream) を作る
1. ReadableStream から Response オブジェクトの作成を作る
   - `"content-type": "image/png"` の設定 (README に書いてあるやつ)
   - `"cache-control": "public, immutable, no-transform, max-age=31536000"` の設定 (README に書いてあるやつ)
     - `NODE_ENV === "development"` のときは `"no-cache, no-store"`
   - constructor 内で `return new Response()` をしているので、`ImageResponse class` のインスタンスは**実質 [Response](https://developer.mozilla.org/ja/docs/Web/API/Response) オブジェクト**。

### `src/emoji/index.ts`

`options.emoji` の型に対応した、各 emoji リソースや読み込み用関数の定義をしている

### `src/og.ts`

`render()` が主な関数

- default option の設定 (README にかいてあるやつ)
  - width: 1200
  - height: 630
  - debug: false
- `satori()` 実行
  - `options.fonts` を指定されていない場合、@vercel/og の default (`noto-sans-v27-latin-regular.ttf`) を使う
  - `options.loadAdditionalAsset` に `options.emoji` で指定した emoji を読み込む関数を渡している
- `@resvg+resvg-wasm` で SVG を PNG に変換する

satori が受け付ける options ([README に書いていないからコードから...](https://github.com/vercel/satori/blob/main/src/satori.ts)) と比較すると

- @vercel/og でも同じ用に渡せる
  - `width: number`
  - `height: number`
  - `fonts: FontOptions[]`
  - `debug?: boolean`
- @vercel/og で wrap? してくれている
  - `loadAdditionalAsset?: (languageCode: string, segment: string ) => Promise<string | Array<FontOptions>>`
    - `'twemoji' | 'blobmoji' | 'noto' | 'openmoji' | 'fluent' | 'fluentFlat'` の中から選んだ emoji を読み込んでくれる
- @vercel/og で渡せない
  - `embedFont?: boolean`
  - `graphemeImages?: Record<string, string>`
  - `tailwindConfig?: TwConfig`
  - `onNodeDetected?: (node: SatoriNode) => void`

### つまり

@vercel/og の中では

- satori 用の default 値 (`width`, `height`, `fonts`) を渡したり、
- satori とは別で必要な処理 (`loadAdditionalAsset`, google font 読み込み, emoji 読み込み) をやってくれたり、
- satori で React element から SVG を作ってくれたり、
- satori の出力結果 (SVG) を PNG にしてくれたり、
- HTTP Header 付きの Response オブジェクトを作ったり

してくれている。

## 私の結論

✌️😁 `@vercel/og` で OGP 画像を作る！

=> "[@vercel/og を使って、Astro 製ブログ のビルド時にページごとの OGP 画像を出力する](./output-ogp-image-for-astro-pages)"

[^1]: 記事を書いた時点で https://www.npmjs.com/package/@vercel/og を見る限りは、リポジトリを公開していない。satori と LICENSE は同じ([Mozilla Public License Version 2.0](https://www.unpkg.com/@vercel/og@0.5.6/LICENSE))だし、minify, bundle された js は npm で公開している以上見られるけれど...。
