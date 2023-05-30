---
title: "Next.js で GA4(&GTM)を使うための構成"
date: 2021-12-14
---

Next.js の リポジトリには Google アナリティクス 4（GA4）を使用するための Example が２つあります。

- [with-google-analytics](https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics)
- [with-google-tag-manager](https://github.com/vercel/next.js/tree/canary/examples/with-google-tag-manager)

しかし後述の余談の通り、あれこれ都合が悪いことがいくつかあったため、「俺はこうする！」をまとめておきます。

## gtag.js で GA4 を使う

wip

## Google Tag Manager から GA4 を使う

### GTM と GA4 の設定

こんな 👇 設定になってる想定。詳細も別記事で書く(WIP)

![](/assets/blog/next-js-with-ga4/gtm-config-for-page-view.jpg)

### Tag Manager のインストール

ref: [Install Google Tag Manager for web pages](https://developers.google.com/tag-platform/tag-manager/web)

#### \_app.js

<details>
<summary>コード</summary>

```jsx
function MyApp({ Component, pageProps }) {
  return (
    <>
      <GtmScript />
      <Component {...pageProps} />
    </>
  );
}
```

```jsx
export const GtmScript = () => (
  <Script
    id={"gtm-script"}
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
    }}
  />
);
```

</details>

`gtm.js` を読み込むためのコードは `_app.js` に [`next/script`](https://nextjs.org/docs/basic-features/script) を使って書きます。

GTM のガイドでは

> Copy the code and install on all pages based

と言っている、かつ、状態を持つものでもないので`_document.js` に素の script タグで書くのもアリかと思います([書いている人いた](https://www.learnbestcoding.com/post/9/easiest-way-to-integrate-google-analytics-with-react-js-and-next-js) )が、
同期的なスクリプトをそのまま書くとパフォーマンス的にまずい([と Next.js も言っている](https://nextjs.org/docs/messages/no-sync-scripts) )ので、Client-side の js で読み込んでもらいます([afterInteractive](https://nextjs.org/docs/basic-features/script#afterinteractive) )。

[Next.js の Example](https://github.com/vercel/next.js/blob/canary/examples/with-google-tag-manager/pages/_app.js) と異なるのは 2 つ。

1 つは、[`next/router` で routing の変化を監視して pageview を送信](https://github.com/vercel/next.js/blob/canary/examples/with-google-tag-manager/pages/_app.js#L8-L13) **していない**こと。これの詳細は後述。

もう 1 つは、`<Script>` に id を指定していること。
`next/script` では、[id または src で読み込み済み等の状態を管理している](https://github.com/vercel/next.js/blob/canary/packages/next/client/script.tsx#L42) ので、これが無いとページの読み込み毎に `<script>`が増え続ける...。 Next.js に PR 送ろ...。

#### \_document.js

<details>
<summary>コード</summary>

```jsx
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <GtmNoscript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

```jsx
export const GtmNoscript = () => (
  <noscript>
    <iframe
      src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
      height="0"
      width="0"
      style={{ display: "none", visibility: "hidden" }}
    />
  </noscript>
);
```

</details>

`<noscript>`用のコードは`_document.jsx`に書きます。js が実行できない環境用のもののため、SSR 時に html に反映しておいてもらいます。

### page_view イベントの送信方法

前述の通り、本記事における `_app.js`は Next.js の Example とは異なり「[`next/router` で routing の変化を監視して pageview を送信](https://github.com/vercel/next.js/blob/canary/examples/with-google-tag-manager/pages/_app.js#L8-L13) 」しません。
GTM と GA4 の機能をそれぞれ使って page_view イベントを送信します。

#### GA4 の拡張計測機能で、browser history 変更毎に page_view を送信する

GA4 では拡張計測機能によって[色々なイベントを自動的に収集してくれます](https://support.google.com/analytics/answer/9234069?hl=ja) 。自動測定対象にはページビューもあるため、自前でイベントを送信しなくて OK🤗

![](/assets/blog/next-js-with-ga4/ga4-config-for-page-view.jpg)

ページビュー数には設定があって、history api の更新を監視して(多分) 自動でイベントを送信するか否かを制御出来ます。デフォルトで ON なのであまり気にしなくて良い。

![](/assets/blog/next-js-with-ga4/ga4-config-for-page-view-2.jpg)

#### GTM の設定で、最初の page_view を送信する

拡張計測機能によるページビューは browser history の更新がトリガーなので、ページアクセス時の`page_view`も送信できるようにします。

[gtag.js の場合は インストール時に書く 👇 ](https://developers.google.com/tag-platform/gtagjs/install?hl=ja) で最初の `page_view` イベントを送信していました。

```js
gtag("config", "G-XXXXXX");
```

[gtm.js のインストール](https://developers.google.com/tag-platform/tag-manager/web?hl=ja) だけでは`page_view`イベントが送信出来ませんが、さすが Google、GTM 上の設定で送ることが出来ます。

ページ読み込み GTM のタグとしての GA4 の設定で、設定が読み込まれるとき[^1]、`page_view`を送信してもらうようにします。

![](/assets/blog/next-js-with-ga4/gtm-config-for-page-view.jpg)

### カスタムイベント送信用の関数があってもいいんじゃないかな

<details>
<summary>コード</summary>

```jsx
export const sendEvent = (event, parameters) => {
  window.dataLayer.push({
    event,
    ...parameters,
  });
};
```

</details>

Next.js 関係ないけれど、書いちゃう。gtag.js をインストールしていないので[^2]、`dataLayer#push`からイベントを送信します。

## 余談

WIP

---

[^1]: 具体的には、gtm.js が gtag.js を読み込んだとき
[^2]: 正確には「`dataLayer#push`をラップする `gtag()`を定義していないので」
