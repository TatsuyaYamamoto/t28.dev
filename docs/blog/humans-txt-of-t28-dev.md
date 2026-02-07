---
title: "このウェブページ (t28.dev) の humans.txt を作る"
date: 2026-02-07
---

構造化データに詳しくなった (関連: "[構造化データの基礎](./fundamentals-of-structured-data)") ので <https://schema.org/Person> を表現するプロフィールページを作りたくなったが...[やめた](https://t28.dev/blog/structured-data-of-t28-dev#:~:text=%E3%83%97%E3%83%AD%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E6%83%85%E5%A0%B1%E3%81%8C%E5%90%AB%E3%81%BE%E3%82%8C%E3%82%8B%E3%83%88%E3%83%83%E3%83%97%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AE%20URL%20%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%20IRI%20%E3%82%92%E5%AE%9A%E7%BE%A9%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%AB%E3%81%97%E3%81%9F)。
その流れで <https://humanstxt.org> という取り組みを知ったので、<https://t28.dev/humans.txt> を作ってみた。

## humans.txt

`humans.txt` は「誰がサイトを作ったか」を伝えるための "人間向けの" テキストファイル。
"機械向け" の `robots.txt` のようにサイトのルートに置く。テキストファイルなのでシンプルで素早く作れて、

> it's something simple and fast to create.

既存のサイトに手を加えずに

> it's not intrusive with the code.

著者の主張ができる。

> you can prove your authorship

## `rel="author"`

<https://humanstxt.org> は `humans.txt` を [`rel="author"`](https://developer.mozilla.org/ja/docs/Web/HTML/Reference/Attributes/rel#author) で紐づけることを推奨している。

```html
<link type="text/plain" rel="author" href="http://domain/humans.txt" />
```

`rel="author"` は著者情報を示すための属性値で、[Web 標準として定義されている](https://html.spec.whatwg.org/multipage/links.html#link-type-author)。

Google が `rel="author"`に関するガイド ([rel="author" に関するよくある質問（上級編）](https://developers.google.com/search/blog/2013/08/relauthor-frequently-asked-advanced?hl=ja)) を出しているが、2013 年と古い...。
最近の参考として使えそうなドキュメントを見つけられなかったが、情報の意味づけ・紐づけの方法としては構造化データの方が主流になっている...ということだと思う。

## プロフィールページにはならない

最初「humans.txt がお手軽プロフィールページになれば良いな〜」なんて思ったが、これはただのテキストファイルなので、意味づけされたページにならない。
`<head>` がないので JSON LD は書けないし、HTML じゃないのでタグも書けないし Microdata も使えない。

humans.txt はセマンティックなプロフィールページではなく、あくまで人間向けの簡易ページとして考えるのが良さそう。

## 構造化データに紐づけるのはやめた

前述のことから humans.txt は構造化データに紐づける必要はないと考えた。

```json
{
  "@type": "Person",
  "@id": "https://t28.dev/#person",
  "name": "YAMAMOTO Tatsuya",
  "url": "https://t28.dev/humans.txt", // 👈️ ここや
  "sameAs": [
    "https://t28.dev/humans.txt", // 👈️ ここ
    "https://twitter.com/T28_tatsuya",
    "https://x.com/T28_tatsuya",
    "https://github.com/TatsuyaYamamoto"
  ]
}
```
