---
title: 略解 sitemap
date: 2021-03-02
description: "新しいサイト用のsitemapを登録するにあたって、役割・仕様をざっくり調べました。"
---

[せっかくサイトを作った](../start-blog-with-gatsby)ので [Google Search Console](https://search.google.com/search-console) にサイトを登録したところ...。

![add sitemap sample](./add-sitemap-sample.jpg)

あーあれね、サイト内のページの構造を書いたやつ...😊 

[脳みそ止めて plugin を探してもいいですが](https://www.gatsbyjs.com/plugins?=sitemap) 、せっかくなので簡単に調べてみます。

## ググる。

### サイトマップについて

ここみた ([Google 検索セントラル - サイトマップについて](https://developers.google.com/search/docs/advanced/sitemaps/overview?hl=ja) )。

- なに？

  > サイト上のページや動画などのファイルについての情報や、各ファイルの関係を伝えるファイルです。

- だれが使うの？

  > Google などの検索エンジンは、このファイルを読み込んで、より高度なクロールを行います。

- クローラーに任せればいいんじゃないの？

  > サイトの各ページが適切にリンクされていれば、Google は通常、サイトのほとんどのページを検出できます。

- じゃあ要らない？

  > クロールを改善する手段としてサイトマップが役立ちます。

  > サイトマップを提供することで有益な結果が得られ、デメリットになることはありません。

=> よし、sitemap 作ろう 💪🔥

ちなみに、[Google 検索セントラル - サイトマップについて](https://developers.google.com/search/docs/advanced/sitemaps/overview?hl=ja#do-i-need-a-sitemap)
に、必要なケース・不要なケースの例が記載されていて分かりやすいです。 [t28.dev](https://t28.dev)の場合、

> サイトが新しく、外部からのリンクが少ない。

ため、やっぱり作ったほうが良さそう。

### 作り方・使い方

ここ見た ([Google 検索セントラル - サイトマップの作成と送信](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=ja) )。

[サイトマップ形式](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=ja#sitemapformat) 、[一般的なサイトマップに関するガイドライン](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=ja#general-guidelines) については、
長いものに巻かれる方針(plugin 使う) に従って一旦読み飛ばして...

せっかく作った sitemap を [サイトマップを Google で利用できるようにする](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=ja#addsitemap) には、

> Search Console のサイトマップ レポートを使用してサイトマップを Google に送信します。

> robots.txt ファイルの任意の場所に次の行を挿入して、サイトマップへのパスを指定します。

などが手段としてあるようので、しっかり登録するようにします。

## `gatsby-plugin-sitemap`で sitemap を出力してみる。

gatsby には sitemap.xml を出力してくれる plugin ([gatsby-plugin-sitemap](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-sitemap)) があるので、ありがたく使わせて頂きます。
出力結果を見てみると、

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>https://t28.dev/start-blog-with-gatsby/</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://t28.dev/rough-knowledge-sitemap/</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://t28.dev/</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

なんとなく意味は分かりそう。
(`<urlset>`内の子要素としてサイト内のページを`<url>`で定義する。ページごとの詳細を`<loc>`とかで定義する。)

[sitemaps.org](https://www.sitemaps.org/protocol.html) で 仕様を見てみる。

| Attribute      | 必須 | ざっくり訳説明                                                                                                                          |
| :------------- | :--: | :-------------------------------------------------------------------------------------------------------------------------------------- |
| `<urlset>`     |  ○   | (略)                                                                                                                                    |
| `<url>`        |  ○   | (略)                                                                                                                                    |
| `<loc>`        |  -   | ページの URL。プロトコルで始まって、`/`で終わらないと駄目。                                                                             |
| `<changefreq>` |  -   | ページ更新頻度。クローラーは参考程度に扱う。                                                                                            |
| `<priority>`   |  -   | サイト内のページ内の優先順位。クローラーにとって重要なページを教えるだけ。サイト内で相対的に扱うだけなので、google 検索結果とは関係なし |

- `<loc>`は trailing slash じゃないと駄目ってのは、 hoge.html 的なページは sitemap に登録出来ないってことなのかな...
  - => よく見たら、[sitemaps.org の Sample XML Sitemap](https://www.sitemaps.org/protocol.html) でも [Google のドキュメント](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=ja) でも 拡張子とか query とか付けとるやんけ。仕様はあくまで仕様か...。
- `<changefreq>` が `daily` って本当かいって感じだけれど、更新するケースもあるし、参考程度ならいいのか。
- 使用上の`priority`default value は 0.5 だけれど、plugin 的には 0.7 を真ん中にしている理由はあるのだろうか 🤔

---

以下、余談。

> 次の場合は、サイトマップは必要ありません。
> サイトのサイズが「小さい」。サイトのページ数がおよそ 500 ページ以下の場合にサイズが小さいと考えます。

500 記事超え、頑張ろ〜〜〜〜〜〜〜👊😊
