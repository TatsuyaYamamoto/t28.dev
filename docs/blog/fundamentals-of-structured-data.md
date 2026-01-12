---
title: "構造化データの基礎"
date: 2026-01-04
---

> [!WARNING]
> 著者のための「基礎」です。
>
> 本記事は「構造化データの**基礎**」を謳っていますが、あくまで著者の学習メモです。
> 正確で網羅的な基礎の情報は公式ドキュメントを参照しましょう。

このブログに構造化データを追加することで

- 機械判読可能なデータを提供する
- Google 検索で[リッチリザルト](https://developers.google.com/search/docs/appearance/structured-data/search-gallery?hl=ja)を表示する

ようにしてみたい。
正直リッチリザルトにはあまり興味がなくて(というかこんなブログ記事がリッチリザルトになる訳がない)、
[SEO への影響](https://developers.google.com/search/docs/fundamentals/get-started?hl=ja#help-google-understand-your-site)以上に、
機械判読可能なデータは将来的に [LLM friendly なページ作成につながるかもしれない](https://www.linkedin.com/posts/davidmihm_fabrice-canel-confirms-that-schema-markup-activity-7307785448548941830-AkW8/)点[^1]に関心がある。今のうちに現状の仕組みを理解しておきたい。

## 構造化データとは

構造化データとは、ページの情報を表すデータ形式。

> ページに関する情報をさまざまなサイトで活用できるように標準化したデータ形式
>
> ref: [Google 検索における構造化データのマークアップの概要](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=ja#:~:text=%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8B%E6%83%85%E5%A0%B1%E3%82%92%E3%81%95%E3%81%BE%E3%81%96%E3%81%BE%E3%81%AA%E3%82%B5%E3%82%A4%E3%83%88%E3%81%A7%E6%B4%BB%E7%94%A8%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%88%E3%81%86%E3%81%AB%E6%A8%99%E6%BA%96%E5%8C%96%E3%81%97%E3%81%9F%E3%83%87%E3%83%BC%E3%82%BF%E5%BD%A2%E5%BC%8F)

これによってページに訪れたコンピューターはページのコンテンツ・意図を正確に理解できる。

Google検索の場合、この情報でリッチリザルトを表示している。
例えばレシピの作成者、材料、カロリー数、加熱時間などの詳細情報を記載すると、各要素がラベル付けされ、それらの情報でも検索できるようになる。

> ![](./assets/fundamentals-of-structured-data/article-rich-result.png)
>
> ref: [Google 検索がサポートする構造化データ マークアップ](https://developers.google.com/search/docs/appearance/structured-data/search-gallery?hl=ja)

## 構造化データをページに追加する理由

「[Semantic な HTML](https://web.dev/learn/html/semantic-html?hl=ja)を書いていれば、コンピューターは意味付けされた文書を読めるんじゃないの？」という疑問が出てくる。
これに対しては[Google も初心者向けガイドとして紹介している](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=ja#get-started)、「[Getting started with schema.org using Microdata](https://schema.org/docs/gs.html)」の説明が分かりやすかった。

`<h1>Avatar</h1>` という HTML 要素を考える。
`<h1>` はセマンティックな要素なので、`<h1>Avatar</h1>` となっていれば「Avatar」がその文書の見出しであることが分かる。
しかしその見出しの文字が具体的に何を意味するか分からないため、「Avatar」が 3D 映画なのか、プロフィール写真の一種なのか (少なくともコンピューターは) 判別が難しい。

```html
<div>
  <!-- 👇️ "Avatar" って何？映画？アニメ？プロフィール画像？ -->
  <h1>Avatar</h1>
  <!-- 👇️ 複数の情報を持ったただのテキストが並んでいる -->
  <span>Director: James Cameron (born August 16, 1954)</span>
  <!-- 👇️ これはジャンル？キャッチコピー？カテゴリ？意味付けがない -->
  <span>Science fiction</span>
  <!-- 👇️ 予告編？公式サイト？関連ニュース？ リンクの役割が分からない -->
  <a href="../movies/avatar-theatrical-trailer.html">Trailer</a>
</div>
```

上記の HTML に対して「この情報は特定の映画、場所、人物、または動画について説明しています」と伝えるタグを追加することで、
コンピューターはコンテンツをより深く理解し、有用かつ関連性のある方法で表示できるようになる。
`itemscope`、`itemtype`、`itemprop` は [HTML 標準である Microdata](https://html.spec.whatwg.org/multipage/microdata.html) で定義されている属性。
これらの属性を用いて machine-readable なラベルを注釈として付けることができる。

```html
<!-- 👇️ この div 全体が映画についての情報と分かる -->
<div itemscope itemtype="https://schema.org/Movie">
  <!-- 👇️ 映画の名前 -->
  <h1 itemprop="name">Avatar</h1>
  <div itemprop="director" itemscope itemtype="https://schema.org/Person">
    Director:
    <!-- 👇️ 監督の名前 -->
    <span itemprop="name">James Cameron</span>
    <!-- 👇️ 監督の生年月日 (コンピューターに優しい) -->
    (born <span itemprop="birthDate">1954-08-16</span>)
  </div>
  <!-- 👇️ 映画のジャンル -->
  <span itemprop="genre">Science fiction</span>
  <!-- 👇️ この URL は映画の予告編 -->
  <a href="../movies/avatar-theatrical-trailer.html" itemprop="trailer">
    Trailer
  </a>
</div>
```

`itemtype` と `itemprop` に自由な文字列を入れてしまうとコンピューターは意味づけされた情報として理解できないため、
Schema.org が定義する型とプロパティ ([vocabulary](https://schema.org/docs/gs.html#schemaorg)) を用いる。

## 構造化データを記述する手段

構造化データを記述する例として Microdata を前述したが、[Google 検索では以下の形式をサポートしている](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=ja#supported-formats)。

- [JSON-LD](https://json-ld.org/) (Google が推奨している)
  - JSON で記述する方法。ユーザーに表示するマークアップとは別で記述するのでネストした情報を書きやすい。
  - 仕様: [JSON-LD 1.1 (W3C Recommendation)](https://www.w3.org/TR/json-ld11/)
  ```html
  <script type="application/ld+json">
    {
      "@context": "https://schema.org"
      "@type": "Movie",
      "name": "Avatar"
    }
  </script>
  ```
- Microdata
  - HTML の仕様に基づいた属性で記述する。
  - 仕様: [HTML Living Standard - 5. Microdata](https://html.spec.whatwg.org/#toc-microdata)
  ```html
  <div itemscope itemtype="https://schema.org/Movie">
    <h1 itemprop="name">Avatar</h1>
  </div>
  ```
- [RDFa](https://rdfa.info/)
  - 仕様: [RDFa Lite 1.1 - Second Edition (W3C Recommendation)](https://www.w3.org/TR/rdfa-lite/#the-attributes)

以下を理由に Google は JSON-LD を推奨しているため、このブログでも JSON-LD を使って実装する。

> 一般的に、Google はサイトの設定で許容されている限り、JSON-LD を構造化データに使用することを推奨します。これは、ウェブサイトの所有者が実装と管理を最も容易に行うことができる（つまり、ユーザーエラーの発生する可能性が低い）ソリューションであるためです。

## JSON-LD と Schema.org

JSON-LD は [Linked Data](https://en.wikipedia.org/wiki/Linked_data) を表現するための JSON ベースの形式で、
"[JSON-LD 1.1](https://www.w3.org/TR/json-ld/)" で仕様化されている Web 標準である。

> JSON-LD is a lightweight Linked Data format.
>
> ref: [JSON for Linking Data](https://json-ld.org/)

Linked Data は [IRI (Internationalized Resource
Identifier)](https://datatracker.ietf.org/doc/html/rfc3987#section-2) とリンクを使って、Web 上のデータ同士を機械判読可読な (semantic と言っても良い) データでつなぐ方法。

> Linked Data [LINKED-DATA] is a way to create a network of standards-based machine interpretable data across different documents and Web sites.
>
> ref: [JSON-LD 1.1 - 1. Introduction](https://www.w3.org/TR/json-ld/#introduction)

映画の情報を JSON で書くと、以下のような構造 [^2] になる (あくまで一例)。

```json
{
  "name": "Avatar",
  "director": {
    "name": "James Cameron",
    "birthDate": "1954-08-16"
  },
  "genre": "Science fiction",
  "trailer": "../movies/avatar-theatrical-trailer.html"
}
```

映画の情報であることが人間には一目瞭然だが、機械にとっては単なる文字列の Key と Value なので直感的に理解できない。
また人間にとっても曖昧さを残している情報である。
例えば、 `birthDate` はルールに従った形式なのだろうか？`genre` は enum なのか free text なのか？ `trailer` は複数設定できるのか？など...

JSON-LD は用語を [IRI (Internationalized Resource Identifier)](https://datatracker.ietf.org/doc/html/rfc3987#section-2) に拡張することで、
各用語を識別し、用語の定義を取得し、誤用を防止する。

> It is useful for terms, like name and homepage, to expand to IRIs so that developers don't accidentally step on each other's terms. Furthermore, developers and machines are able to use this IRI (by using a web browser, for instance) to go to the term and get a definition of what the term means.
>
> ref: [3. Basic Concepts](https://www.w3.org/TR/json-ld/#basic-concepts)

JSON-LD の仕様上は IRI であれば良いが、[一般的に使用されている語彙として Schema.org を使って](https://www.w3.org/TR/json-ld/#basic-concepts:~:text=Leveraging%20the%20popular%20schema.org%20vocabulary%2C%20the%20example%20above%20could%20be%20unambiguously%20expressed%20as%20follows)例を記述している。
Schema.org は Google、Bing、Yahoo! によるウェブページの構造化データのマークアップのための共通のタグセット。各種検索エンジンは Schema.org の語彙を元に web ページを理解している。

> 今回は、Google、Bing、Yahoo! による新しい取り組みである schema.org をご紹介します。これは、ウェブページの構造化データのマークアップのための共通のタグセットをつくる取り組みです。
>
> ref: [schema.org のご紹介: より便利なインターネットのための検索エンジンの取り組み](https://developers.google.com/search/blog/2011/06/introducing-schemaorg-search-engines?hl=ja)

Schema.org は "誕生日" を https://schema.org/birthDate として定義しているため、宣言する人も、読む人も同じ意味で "誕生日" を宣言・理解することができる。

```json
{
  "@type": "https://schema.org/Movie",
  "https://schema.org/name": "Avatar",
  "https://schema.org/director": {
    "@type": "https://schema.org/Person",
    "https://schema.org/name": "James Cameron",
    "https://schema.org/birthDate": "1954-08-16"
  },
  "https://schema.org/genre": "Science fiction",
  "https://schema.org/trailer": {
    "https://schema.org/name": "Trailer",
    "@id": "../movies/avatar-theatrical-trailer.html"
  }
}
```

都度 IRI を書くのは大変なので JSON-LD は [JSON を圧縮する方法](https://www.w3.org/TR/json-ld/#compacted-document-form)を定義している。
@context に「どの IRI に結びつけるかのルール」を書くことで、`name` や `Movie` のような名前が IRI に展開され、内部的には完全な IRI として解釈される。

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Movie",
    "name": "Avatar",
    "director": {
      "name": "James Cameron",
      "birthDate": "1954-08-16"
    },
    "genre": "Science fiction",
    "trailer": {
      "name": "Trailer",
      "url": "../movies/avatar-theatrical-trailer.html"
    }
  }
</script>
```

`https://schema.org/` に対して curl してみると、`https://schema.org/docs/jsonldcontext.jsonld` に「どの IRI に結びつけるかのルール」が書かれていることを教えてくれた。

```bash
$ curl --silent --head https://schema.org | grep link
link: </docs/jsonldcontext.jsonld>; rel="alternate"; type="application/ld+json"

$ curl --silent https://schema.org/docs/jsonldcontext.jsonld | head -10
{
  "@context": {
    "type": "@type",
    "id": "@id",
    "HTML": {
      "@id": "rdf:HTML"
    },
    "@vocab": "http://schema.org/",
    "brick": "https://brickschema.org/schema/Brick#",
    "csvw": "http://www.w3.org/ns/csvw#",
```

## Google における推奨プロパティ

JSON-LD はデータを記述する形式であり、 Schema.org はその形式内で使う語彙 (vocabulary) なので、
そこから作られた "ページのコンテンツ・意図" をどのように扱うかは読み手次第である。[Google の場合はコンテンツの種類毎に推奨プロパティを定義している](https://developers.google.com/search/docs/appearance/structured-data/search-gallery?hl=ja) が、
他の検索エンジンにはそれらを記す公式ドキュメントはない (多分)。

[記事（Article、NewsArticle、BlogPosting）の構造化データ](https://developers.google.com/search/docs/appearance/structured-data/article?hl=ja#structured-data-type-definitions) の推奨プロパティは以下の通り。

> | プロパティ      | 型                                                                                                |
> | :-------------- | :------------------------------------------------------------------------------------------------ |
> | `author`        | [`Person`](https://schema.org/Person) または [`Organization`](https://schema.org/Organization)    |
> | `author.name`   | [`Text`](https://schema.org/Text)                                                                 |
> | `author.url`    | [`URL`](https://schema.org/URL)                                                                   |
> | `dateModified`  | [`DateTime`](https://schema.org/DateTime)                                                         |
> | `datePublished` | [`DateTime`](https://schema.org/DateTime)                                                         |
> | `headline`      | [`Text`](https://schema.org/Text)                                                                 |
> | `image`         | [`ImageObject`](https://schema.org/ImageObject) または [`URL`](https://schema.org/URL) の繰り返し |

## Google を参考にする

具体的な例が知りたかったので、Google のページの構造化データを見てみたが、ゆーほど、推奨プロパティに従っていないような...😅

### web.dev

#### トップページ

https://web.dev/

`Article` 型の node object では、headline が空文字 。
[`Organization` 型の推奨プロパティ](https://developers.google.com/search/docs/appearance/structured-data/organization?hl=ja#structured-data-type-definitions) も大分足りていない気がするけれど、"必要に応じて" なプロパティが多いから、こっちはまあ良いのかな？

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ""
  }
</script>
<script type="application/ld+json">
  {
    "@context": "http://schema.org/",
    "@type": "Organization",
    "name": "web.dev",
    "logo": "https://www.gstatic.com/devrel-devsite/prod/ve08add287a6b4bdf8961ab8a1be50bf551be3816cdd70b7cc934114ff3ad5f10/web/images/touchicon-180.png",
    "url": "https://web.dev/"
  }
</script>
<script type="application/ld+json">
  {
    "@context": "http://schema.org",
    "@type": "WebSite",
    "name": "web.dev",
    "url": "https://web.dev/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://web.dev/s/results?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
</script>
```

ちなみにこのページでは複数の script tag で構造化データを定義しているが、これらは単一のデータセットにマージして処理されることが仕様で決まっている。

> all script elements with type `application/ld+json` MUST be processed and merged into a single dataset
>
> ref: [7. Embedding JSON-LD in HTML Documents](https://www.w3.org/TR/json-ld/#embedding-json-ld-in-html-documents)

#### 記事ページ

https://web.dev/shows/web-dev-live-day-1/himvKu12YCY?hl=ja

こちらのページも `Article` 型の node object は自由って感じ。

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "dateModified": "2020-06-30",
    "headline": "JavaScript SEO に関する問題のデバッグ"
  }
</script>
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "web.dev LIVE Day 1",
        "item": "https://web.dev/shows/web-dev-live-day-1"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "JavaScript SEO に関する問題のデバッグ",
        "item": "https://web.dev/shows/web-dev-live-day-1/himvKu12YCY"
      }
    ]
  }
</script>
```

### Google Search Central

#### トップページ

https://developers.google.com/search

このページも `haedline` だけ。そんなもんで良い...ってこと？🤔

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Google 検索セントラル | Google の公式 SEO 関連情報ポータル"
  }
</script>
```

#### 記事ページ

https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

ここは [`パンくずリスト型`](https://schema.org/BreadcrumbList) の node object しかない不思議。
`"position": 3` の ListItem の `name` が `<title>` と同じなので、
https://schema.org/name が https://schema.org/headline の代わりになっているのかもしれない？🤔

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Search Central",
        "item": "https://developers.google.com/search"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Documentation",
        "item": "https://developers.google.com/search/docs"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "構造化データ マークアップとは | Google 検索セントラル",
        "item": "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data"
      }
    ]
  }
</script>
```

ちなみに [docs のトップページ](https://developers.google.com/search/docs/) ではパンくずリストのアイテムが減っただけだった。

## 構造化データをチェックする

実装した構造化データのマークアップは https://developers.google.com/search/docs/appearance/structured-data?hl=ja で紹介されている

- リッチリザルト テスト
- スキーママークアップ検証ツール

を使って検証できる。

[^1]: 一方、[なんでもかんでも構造化データにすれば良いわけではない](https://www.linkedin.com/feed/update/urn:li:activity:7308780217668378624?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7308780217668378624%2C7309157919671939072%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287309157919671939072%2Curn%3Ali%3Aactivity%3A7308780217668378624%29)という話もある。

[^2]: 相対パスも IRI (reference) として宣言できる (ref: [1.4 Terminology](https://www.w3.org/TR/json-ld/#terminology))
