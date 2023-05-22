---
title: Next.jsのSSGしたビルド成果物をFirebase, GCSでホスティングする方法
date: 2021-07-19
description: "Next.js の SSG によるビルド成果物を Firebase、GCS にデプロイするためにやっていることの共有"
---

## なにこれ

Next.js の SSG (Static site generate) によるビルド成果物を Firebase(hosting)、GCS (Google Cloud Storage) にデプロイするためにやっていることの共有

---

## はじめに

本記事が言う要件とは「`https://domain.com/another` への HTTP リクエストで `https://domain.com/another.html` へ到達して欲しい」ということです。

### Next.js の SSG

Next.js は SSG 機能 ([Static HTML Export](https://nextjs.org/docs/advanced-features/static-html-export)) を使用することで、ページ毎の html ファイルを予め出力することが出来ます。
index.js, another.js というページがあれば、それぞれ index.html, another.html が出力される感じですね(それ以外の出力は SPA 用の js とか静的ファイル)。

```shell
$ ls pages
_app.js		another.js	api		index.js
$ ls out
404.html	_next		another.html	favicon.ico	index.html	vercel.svg
```

### html へアクセス後の SPA としてのルーティング

仮に、https://domain.com みたいな感じで root (pages/index.js) にアクセスしたとします。
その後 [next/link](https://nextjs.org/docs/api-reference/next/link) 等 Next.js の router で "pages/another.js" に画面遷移を行うと、path は `/another` になります。
この URL の状態(`https://domain.com/another`)でブラウザーリロードを行うと、another.html に HTTP リクエストが届かないため 404 になってしまいます。

Next.js の SSG のビルド成果物をデプロイするときは、上記の対応も併せて行う必要があります。

## to Firebase Hosting

### 結論

私は firebase.json 内で以下 2 つの設定を行っています。

```json
{
  "hosting": {
    "cleanUrls": true,
    "trailingSlash": false
  }
}
```

### 説明

Firebase Hosting では firebase.json でホスティング動作を構成することが出来ます (ref. [ホスティング動作を構成する](https://firebase.google.com/docs/hosting/full-config))。

#### cleanUrls

ref. [.html 拡張子を制御する](https://firebase.google.com/docs/hosting/full-config#control_html_extensions)

要件に対してお誂え向きな設定項目があって助かります。

> true の場合、Hosting はアップロードされたファイルの URL から拡張子 .html を自動的に削除

してくれるので、これで要件が達成できます。

#### trailingSlash

ref. [末尾のスラッシュを制御する](https://firebase.google.com/docs/hosting/full-config#control_trailing_slashes)

`cleanUrls` だけで本来の要件は達成出来ますが、私は併せて `trailingSlash` も設定しています。

> false の場合、Hosting は URL のリダイレクトで末尾のスラッシュを削除します。

デフォルト(未設定)の場合、 `/another` は `/another.html` へ `/another/` は `/another/index.html` へ解決する挙動になり、少しややこしいです。
trailing slash のあり・なしで期待するルーティングの挙動が異なるケースは殆どないので、挙動を統一するために false を設定しています。

## to GCS (Google Cloud Storage)

### 結論

私は next.config.js 内で以下の設定をして、

```js
module.exports = {
  trailingSlash: true,
};
```

GCS で MainPageSuffix を index.html に設定しています。

### 説明

GCS では Firebase Hosting のようなルーティングに関する細かい設定が行えないため、ビルド成果物に対する設定で対処しています。

#### trailingSlash (Next.js)

ref. [Trailing Slash](https://nextjs.org/docs/api-reference/next.config.js/trailing-slash)

`trailingSlash: true` の状態で SSG を行うと、path は ファイル名ではなくディレクトリ名で表現され、出力される html ファイルの名前は index.html になります。

```shell
$ ls out
404.html	_next		another   favicon.ico	index.html	vercel.svg
$ ls out/another
index.html
```

#### MainPageSuffix、Folders (GCS)

本要件のためというよりは静的ウェブサイトを設置する Web サーバーの基本設定ですが、MainPageSuffix を index.html に設定して [インデックスページを設定します](https://cloud.google.com/storage/docs/static-website?hl=ja#specialty_pages) 。
これによって GCS のサブディレクトへのアクセスの挙動は

- HTTP GET `/subdirectory ` => `/subdirectory/index.html` へ 301
- HTTP GET `/subdirectory/` => `/subdirectory/index.html` の中身を返却する 200

となる(ref. [フォルダ](https://cloud.google.com/storage/docs/folders) )ため、前述の Next.js の`trailingSlash`の設定と併せることで要件が達成できます。

ちなみに`/subdirectory/index.html` にいるときに Next.js の router を使って `pages/another-dir.js` にアクセスしようとすると、next.config.js の`trailingSlash: true` に従って、`/another-dir/` にアクセスしてくれるため、 trailing slash のあり・なしで困った挙動差が！みたいなことにはなりません。

余談ですが、Google 的には [日本語記事だとサブディレクトリ](https://cloud.google.com/storage/docs/folders?hl=ja) と書いてある部分が[英語記事だとフォルダー(Folders)](https://cloud.google.com/storage/docs/folders?hl=en) なんですね。
