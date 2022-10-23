---
title: "Gatsby 製サイトの正しいキャッシュと Netlify に設置する場合にやること"
date: "2022-02-01"
description: "Gatsby用のキャッシュ構成を整理してNetlifyで設定するあれこれに根拠を添えたメモ"
---

世の中これが正しいなんて無いやろ、システムごとに要件なんてまちまちやで 👊😊

個人ブログの規模でキャッシュなんて、大げさに管理するもの増えて事故の元じゃね？😇

それもまぁそうなんだけれど、Netlify に Gatsby を設置するならば [gatsby-plugin-netlify](https://www.gatsbyjs.com/plugins/gatsby-plugin-netlify/) を追加するだけでいいと思うよ 🤔

<p style="text-align: right"><strong>おわり</strong></p>

---

以下、ちゃんと把握しておきたい人向け

## Gatsby が出力するファイルの形式 (前知識)

Gatsby はビルド成果物としていくつかのファイルを出力します。本題に必要なものをざっくり挙げると

- ページのエンドポイントを表現する html
- ページ内の情報を表現する json ([page-data.json](https://www.gatsbyjs.com/docs/write-pages/))
- [Code Splitting](https://www.gatsbyjs.com/docs/how-code-splitting-works/) した js,css ファイル
- js で import した asset ファイル

サイトにアクセスして取得した html で初期描画をして、 [hydration](https://www.gatsbyjs.com/docs/conceptual/react-hydration/) で client-side rendering に移行して、以降のページ描画は page-data.json、js, css を非同期で取得して行う......って感じですね。

## Gatsby が出力するファイルの形式

前述の通り、Gatsby のページは複数のファイル形式・複数のリクエストによって構成されるので、キャッシュの設定も「一律これで」という訳にはいかないです。

[Gatsby の ドキュメント](https://www.gatsbyjs.com/docs/caching/) でキャッシュ戦略について言及されています。
ファイル形式ごとにキャッシュするべき・キャッシュしないべきの 2 つに分けて、それぞれ推奨する Cache-Control header を付けます。

### キャッシュするべき

#### 対象

- Static files
- JavaScript and CSS
  - `/sw.js` は例外でキャッシュさせない(後述)

`static/` 配下のファイルや js, css ファイルはファイルの中身に従ってハッシュを作成して、そのハッシュを含んだパスに設置されます。
なのでファイルが変更されればパスも変わるので、長期キャッシュしちゃって OK。

注意点として、[Gatsby のドキュメント](https://www.gatsbyjs.com/docs/how-to/images-and-media/static-folder/) で

> [Importing Assets Directly](https://www.gatsbyjs.com/docs/how-to/images-and-media/importing-assets-into-files/) in JavaScript files

が推奨されているので、Static file は js でインポートする。

#### 設定

```
cache-control: public, max-age=31536000, immutable
```

[意味](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Cache-Control) は

- public
  - CDN やらブラウザでキャッシュしていいよ
- max-age=31536000
  - キャッシュ済みファイルを古いファイルとみなすのは 31536000 秒(1 年)後だよ
- immutable
  - `max-age` が経過しない間はレスポンスが変わらないよ

### キャッシュしないべき

#### 対象

- HTML
- Page data
- App data
- /sw.js

一方、アプリ・ページに関するファイルは常に最新のファイルを参照して欲しいのでキャッシュさせません。`/sw.js` も新しいバージョン(Service worker)があるか確認する必要があるため、同様にキャッシュさせません。

## Netlify に設置する場合

Netlify が返す Response header で前述の通りに「キャッシュして/しないで」を言ってもらう必要があります。
Netlify には [Custom header を設定する仕組み](https://docs.netlify.com/routing/headers/) があって、`_header` ファイルから定義します。

Gatsby の場合は plugin ([gatsby-plugin-netlify](https://github.com/netlify/gatsby-plugin-netlify)) を使うことで、gatsby-config (json)に書いた設定を必要な形式に変換してくれます。さらにありがたいことに、plugin にはデフォルトの設定が仕込まれていて、キャッシュに関しては基本的に**使用者側はなにもしなくて良い**です（やったー！）

gatsby-plugin-netlify では、👇 の感じで Gatsby のドキュメント通りに実装されています(神)。

- [Netlify の Cache](https://answers.netlify.com/t/netlifys-default-cache-headers/11992) - [Control のデフォルト値](https://www.netlify.com/blog/2017/02/23/better-living-through-caching/) は`max-age=0,must-revalidate,public`なので、キャッシュしないファイルにはなにもせず、
- [code splitting](https://www.gatsbyjs.com/docs/how-code-splitting-works/) した [js, css のリストを取得して](https://github.com/netlify/gatsby-plugin-netlify/blob/v4.1.0/src/plugin-data.js#L18) 、[1 年キャッシュする](https://github.com/netlify/gatsby-plugin-netlify/blob/v4.1.0/src/constants.js#L28) ように [header に設定して](https://github.com/netlify/gatsby-plugin-netlify/blob/v4.1.0/src/build-headers-program.js#L296) 、
- [/static/\*](https://github.com/netlify/gatsby-plugin-netlify/blob/v4.1.0/src/constants.js#L31) と [/sw.js](https://github.com/netlify/gatsby-plugin-netlify/blob/v4.1.0/src/constants.js#L32) も [header に設定する](https://github.com/netlify/gatsby-plugin-netlify/blob/v4.1.0/src/build-headers-program.js#L300) 。
