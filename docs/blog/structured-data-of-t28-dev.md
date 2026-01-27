---
title: "このウェブページ (t28.dev) の構造化データを考える"
date: 2026-01-24
---

「[構造化データの基礎](./fundamentals-of-structured-data)」を書いたことで構造化データを完全に理解した [^1] ので、早速、このウェブページ (t28.dev) の構造化データを考える。

## 調べたこと・決めたことまとめ

構造化データを考えるなかで、調べたこと・決めたことをまとめておく。

### `@graph` を使う

JSON-LD は

- 単一の [node object](https://www.w3.org/TR/json-ld11/#dfn-node-object)
- `@context` と/または `@graph` のみを含むマップ
- node object の配列

いずれかの形式で記述する。

> A JSON-LD document MUST be a single node object, a map consisting of only the entries @context and/or @graph, or an array of zero or more node objects.
>
> ref: [9. JSON-LD Grammar](https://www.w3.org/TR/json-ld11/?utm_source=chatgpt.com#json-ld-grammar)

仕様上、推奨されている形式はない。
複数の node object を含む場合、 `@graph` によって `@context` を共有できるので便利なようだ。

> This mechanism can be useful when a number of nodes exist at the document's top level that share the same context, which is, e.g., the case when a document is flattened. The @graph keyword collects such nodes in an array and allows the use of a shared context.
>
> ```json
> {
>   "@context": {
>     "@vocab": "http://xmlns.com/foaf/0.1/"
>   },
>   "@graph": [
>     {
>       "@id": "http://manu.sporny.org/about#manu",
>       "@type": "Person",
>       "name": "Manu Sporny"
>     },
>     {
>       "@id": "https://greggkellogg.net/foaf#me",
>       "@type": "Person",
>       "name": "Gregg Kellogg"
>     }
>   ]
> }
> ```
>
> ref: [4.9 Named Graphs](https://www.w3.org/TR/json-ld11/?utm_source=chatgpt.com#named-graphs)

### `@id` で fragment を使う

JSON-LD において `@id` (IRI) による node object の識別は[必須ではない](https://www.w3.org/TR/json-ld11/#identifying-blank-nodes)。
しかし node object が別の node object を参照する場合、`@id` を指定する必要がある。

> To be able to externally reference nodes in an RDF graph, it is important that nodes have an identifier.
>
> ref: [3.3 Node Identifiers](https://www.w3.org/TR/json-ld11/#node-identifiers)

「私」を表現する node object を <https://schema.org/Person> type で作りたいが、<https://t28.dev> にプロフィールページはない。
そのため、プロフィール情報が含まれるトップページの URL を使って IRI を定義することにした。

```json
{
  "@type": "Person",
  "@id": "https://t28.dev/#person"
}
```

IRI には fragment を含めてよい。

> **IRI**: The absolute form of an IRI containing a scheme along with a path and optional query and fragment segments.
>
> ref: [1.4 Terminology](https://www.w3.org/TR/json-ld11/?utm_source=chatgpt.com#terminology)

また IRI は URL (Web 上のリソースを特定する)ではなくリソースを識別するものであるため、
逆参照[^2] は必須ではない (できるに越したことはないけど)。

> the primary distinction is that a URL locates a resource on the web, an IRI identifies a resource. While it is a good practice for resource identifiers to be dereferenceable, sometimes this is not practical.
>
> ref: [3.2 IRIs](https://www.w3.org/TR/json-ld11/?utm_source=chatgpt.com#iris)

そのため対応した anchor をHTML 内に設置せず、<https://schema.org/Person> の IRI として `https://t28.dev/#person` を宣言する。

### ページをまたいだ node reference を使わない

[node reference](https://www.w3.org/TR/json-ld11/#dfn-node-reference) は `@id` のみを持つ node object で、他の node object を参照するために使う。
重複した宣言が減るので便利な仕組みではある。

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://t28.dev/#person",
      "name": "YAMAMOTO Tatsuya"
    },
    {
      "@type": "WebSite",
      "name": "t28.dev",
      "url": "https://t28.dev/",
      // 👇️ node reference
      "publisher": { "@id": "https://t28.dev/#person" }
    }
  ]
}
```

しかし構造化データの読み手の Google Search を考慮すると、少々不安になる。
クローラーが JSON-LD をどのように評価するか明確ではなく、node reference をページ外の node object を参照した上で評価してくれるかが分からない。
下記など、ガイドラインからは「情報はページ内で完結させてね」と読めなくも...ない。

> 場所
>
> - ドキュメントで特に指定されていない限り、構造化データは、内容を記述するページに実装します。
> - コンテンツが同一の重複するページがある場合は、正規ページだけでなく、重複するすべてのページに同じ構造化データを実装することをおすすめします。
>
> ref: [構造化データに関する一般的なガイドライン](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

そのため無難に node reference を使わず、同じ IRI の node object を都度宣言することにする。
このサイトは Astro で SSG しており JSON-LD も TypeScript の変数から構築するので、冗長な宣言の辛さはそこまで大きくないはず。

### `WebSite` と `WebPage` の違い

<https://schema.org/WebSite> は [Web ページの集合体のこと](https://schema.org/WebSite#:~:text=a%20set%20of%20related%20web%20pages)。
一方、<https://schema.org/WebPage>　は [Webページのこと](https://schema.org/WebPage#:~:text=%5Bmore...%5D-,A%20web%20page,-.%20Every%20web%20page)。

- `https://t28.dev/**/*` (ページ全体) を表現する `WebSite` と
- `https://t28.dev/` (単一ページ) を表現する `WebPage`で

役割が違うので、トップページでは両方の node object を宣言する。

意外とこの２つの違いを即答するのは難しいかも。 Schema.org による語彙の定義の重要性を感じる。

### `CollectionPage` と `Blog` どちらを使うか

<https://schema.org/CollectionPage> は [`WebPage` を継承した、より具体的な型](https://schema.org/WebPage#:~:text=g.%20video%20file.-,More%20specific%20Types,-AboutPage)。

実態として、現状のトップページにはブログ記事の一覧しかないので <https://schema.org/Blog>　が良さそうな気もする。
しかし他の種類のコンテンツを含める可能性がない...とは言い切れない [^3] ので、「リンクされたコンテンツ (<https://schema.org/CreativeWorks>) の集合」として汎用性を持たせておく。
<https://t28.dev/blog> が出来たら、そこには `Blog` を使うと良さそう。

## t28.dev のページ構造

`https://t28.dev` 配下には 4 種類のページがある。それぞれの 構造化データを考える。

| ページ名               | パス                                                              |
| :--------------------- | :---------------------------------------------------------------- |
| トップページ           | https://t28.dev                                                   |
| ブログ記事ページ       | https://t28.dev/blog/fundamentals-of-structured-data              |
| s-works トップページ   | https://t28.dev/s-works                                           |
| s-works 成果紹介ページ | https://t28.dev/s-works/achievement/lovelive-days-5th-anniversary |

## トップページ

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://t28.dev/#person",
      // Google required properties
      // https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ja#profile-target-specification
      "name": "YAMAMOTO Tatsuya",
      // Google recommended properties
      // https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ja#profile-target-specification
      "alternateName": ["@T28_tatsuya"],
      "description": "LLer and programmer.",
      "image": "https://t28.dev/profile.jpg",
      "sameAs": [
        "https://twitter.com/T28_tatsuya",
        "https://x.com/T28_tatsuya",
        "https://github.com/TatsuyaYamamoto"
      ]
      // other properties
    },
    {
      "@type": "WebSite",
      "@id": "https://t28.dev/#website",
      // Google required properties
      // https://developers.google.com/search/docs/appearance/site-names?hl=ja#website
      "name": "t28.dev",
      "url": "https://t28.dev/",
      // Google recommended properties
      // https://developers.google.com/search/docs/appearance/site-names?hl=ja#website
      // "alternateName": [],
      // other properties
      "publisher": {
        "@id": "https://t28.dev/#person"
      },
      "description": "@T28_tatsuyaが、あれこれ書いている。"
    },
    {
      "@type": "CollectionPage",
      "@id": "https://t28.dev/#collectionpage",
      "name": "t28.dev",
      "url": "https://t28.dev/",
      "publisher": {
        "@id": "https://t28.dev/#person"
      },
      "mainEntity": {
        "@type": "ItemList",
        // Google required properties
        // https://developers.google.com/search/docs/appearance/structured-data/recipe?hl=ja#item-list
        "itemListElement": [
          {
            "@type": "ListItem",
            // required
            "position": 1,
            "url": "",
            // others
            "item": {
              "@type": "BlogPosting",
              "url": "https://t28.dev/blog/fundamentals-of-structured-data",
              "headline": "構造化データの基礎",
              "datePublished": "2026-01-04",
              "dateModified": "2026-01-05"
            }
          }
          // 以降、記事のリスト...
        ]
      }
    }
  ]
}
```

## ブログ記事ページ

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://t28.dev/#person",
      // Google required properties
      // https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ja#profile-target-specification
      "name": "YAMAMOTO Tatsuya",
      // Google recommended properties
      // https://developers.google.com/search/docs/appearance/structured-data/profile-page?hl=ja#profile-target-specification
      "alternateName": ["@T28_tatsuya"],
      "description": "LLer and programmer.",
      "image": "https://t28.dev/profile.jpg",
      "sameAs": [
        "https://twitter.com/T28_tatsuya",
        "https://x.com/T28_tatsuya",
        "https://github.com/TatsuyaYamamoto"
      ]
      // other properties
    },
    {
      "@type": "WebPage",
      "@id": "https://t28.dev/blog/fundamentals-of-structured-data#webpage",
      "url": "https://t28.dev/blog/fundamentals-of-structured-data",
      "mainEntity": {
        "@id": "https://t28.dev/blog/fundamentals-of-structured-data#blogposting"
      },
      "publisher": {
        "@id": "https://t28.dev/#person"
      }
    },
    {
      "@type": "BlogPosting",
      "@id": "https://t28.dev/blog/fundamentals-of-structured-data#blogposting",
      "url": "https://t28.dev/blog/fundamentals-of-structured-data",
      // Google recommended properties
      // https://developers.google.com/search/docs/appearance/structured-data/article#article-types
      "author": {
        "@id": "https://t28.dev/#person"
      },
      "headline": "構造化データの基礎",
      "datePublished": "2026-01-04",
      "dateModified": "2026-01-05",
      "image": "https://t28.dev/blog/fundamentals-of-structured-data.ogp.png",
      // other properties
      "mainEntityOfPage": {
        "@id": "https://t28.dev/blog/fundamentals-of-structured-data#webpage"
      },
      "articleSection": "Tech",
      "inLanguage": "ja",
      "description": "著者の学習メモとしての構造化データ入門。JSON-LD を使う理由や基本的な書き方を説明しています。"
    }
  ]
}
```

## s-works トップページ

また、こんど...😅

## s-works 成果紹介ページ

これも、またそのうちで...😂

[^1]: https://www.google.com/search?q=%E3%83%80%E3%83%8B%E3%83%B3%E3%82%B0%E3%82%AF%E3%83%AB%E3%83%BC%E3%82%AC%E3%83%BC%E5%8A%B9%E6%9E%9C

[^2]: HTTP Get が出来て、HTML 内に anchor がある

[^3]: 多分、ないけど。
