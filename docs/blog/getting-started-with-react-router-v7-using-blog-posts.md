---
title: "ブログ記事で Remix (React Router v7) に入門する"
date: 2025-01-05
---

Cloudflare で Web アプリケーションを作ってみたくなりました。
React で開発するときは思考停止で Next.js (または React x Vite) を使っていましたが、

- Next.js -> Vercel
- Remix -> Cloudflare

という認識があった[^1] ので、Remix (React Router v7) に入門してみます。

「Remix の哲学・思想は尖っている」という勝手な印象を持っていたので、それらに触れつつ入門するために[Remix のブログ記事](https://remix.run/blog)を読んでみました。

**_その結果、入門というか深堀りになっちゃった_**

## React Router v7 (2024/11/22)

https://remix.run/blog/react-router-v7

> Today we are happy to announce the stable release of [React Router v7](https://reactrouter.com/).

2024/11/22 に React Router v7 がリリースされた。

> React Router v7 brings everything you love about [Remix](https://remix.run/) back into React Router proper. We encourage all Remix v2 users to upgrade to React Router v7.

React Router **v7** は、React Router **v6** と Remix **v2** の次のバージョンの位置づけ。

> For React Router v6 users, this release brings a wealth of features from Remix back into React Router [in the form of "framework mode"](https://remix.run/blog/react-router-v7#:~:text=in%20the%20form%20of%20%22framework%20mode%22).

昔 React Router にあったフレームワーク的な機能を Remix に切り出したことがあって、それをまた React Router に戻したってことなのかなぁ...？

**(他のブログ記事読んで戻ってきた)**

Web アプリを構築する上で必要な要素の内、[React Router (当時 v6) が提供している機能 (ルーティング) 以外の部分を Remix として提供](https://remix.run/blog/react-router-v6#the-future-remix) したので、これの逆方向ってことかな。

> In addition to the handful of components and hooks that you already use, you now have access to a compiler with broad support for dependencies (based on Vite), server rendering, bundle splitting and optimization, vastly improved type safety, a world-class development environment with HMR, and much more.

具体的な Remix の (React Router v6 になかった) 機能:

- いくつかのコンポーネントとフック
- 依存関係 (Vite ベース) を幅広くサポートするコンパイラ
- サーバー レンダリング
- バンドルの分割と最適化
- 大幅に改善された型安全性
- HMR を使用した世界クラスの開発環境

> For Remix v2 users, this release brings a host of improvements to the type safety in Remix, as well as support for improved routing [via `routes.ts`](https://reactrouter.com/start/framework/routing) and [pre-rendering static pages](https://reactrouter.com/start/framework/rendering).

メジャーアップデートによる機能改善の観点では、Remix v2 ユーザー向けの情報の方が参考になりそう。

- 型安全性に多数の改善
- `routes.ts` を介したルーティングの改善
- 静的ページの事前レンダリング

**(他の文書を読んで戻ってきた)**

[Remix は edge を活用して SSG 相当のパフォーマンスを出す方針](https://remix.run/docs/en/main/guides/performance) だったので、 React Router v7 の`pre-rendering` をサポートは今までの方針と相反しているとも言える。
PR は恐らく "[Add support for prerendering #11539](https://github.com/remix-run/react-router/pull/11539)" で `to support existing SSG use-cases` と書いてあるから、方針変更というよりは、ユーザーのニーズに合わせてって感じかな。

> If you're starting a new app today with React Router, you have a choice: do you want to use React Router as just a library and bring the rest of the pieces yourself? Or do you want a full framework, ala Remix?

React Router v7 では使用法に選択肢がある

- ルーティングライブラリとして使う
- フレームワークとして使う

この境で２つの選択を作っているのは、前述の React Router と Remix の関係から由来している (はず)。

## Incremental Path to React 19: React Conf Follow-Up (2024/5/21)

https://remix.run/blog/incremental-path-to-react-19

> At this point, Remix is just a Vite plugin that makes React Router more convenient to use and deploy. Outside of the plugin, Remix pretty much just re-exports React Router.

Remix (v2) は React Router の使用とデプロイを便利にする Vite プラグインにすぎず、プラグインの外では React Router を再エクスポートするだけ。

...本当？

**(リポジトリ見て戻ってきた)**

流石に `Vite プラグイン` だけではなく、Remix のための実装も普通にある:

- [コンポーネント](https://github.com/remix-run/remix/blob/main/packages/remix-react/components.tsx)
- [CLI](https://github.com/remix-run/remix/tree/main/packages/remix-dev/cli)
- [runtime 毎の実装](https://github.com/remix-run/remix/tree/main/packages/remix-server-runtime)

## Merging Remix and React Router (2024/5/15)

https://remix.run/blog/merging-remix-and-react-router

> The two projects are so closely aligned that we [updated React Router](https://remix.run/blog/remixing-react-router) to include Remix's great loading patterns, and later [rewrote Remix](https://remix.run/blog/react-routering-remix) to even more directly depend on React Router.

React Router と Remix 密接に連携している (密結合とも言う)。

> Turns out we made that bridge a little too well, specifically with the introduction of [our Vite plugin](https://remix.run/blog/remix-vite-stable) and [SPA Mode](https://remix.run/docs/en/main/guides/spa-mode). We found ourselves looking at Remix, then looking at React Router, then looking back at Remix, and we could no longer meaningful tell the difference.

ここだけ読むと、2つのモジュール間の結合度の設計をミスってるんじゃ...? って思わなくもないけれど、Frontend のフレームワークの機能としてルーティングはまず最初にくるし、同じメンテナーだと分けるのは面倒くさいよね...って気持ちになる。

> However, CRA didn't provide a router, a data fetching solution, or any of the features listed above.

- Create React App 製のウェブアプリは実質 React Router 製アプリで、CRA はフレームワークっぽい機能 (ルーター、データ取得ソリューション) を提供していないし、非推奨になっちゃった。
- CRA の代替として Vite (+ plugin-react) が人気だけれど、これもまだフレームワークっぽい機能がない。

=> Remix と React Router がその穴を埋めるぜ！

> Last fall we decided to bet on Vite and start deprecating our classic compiler.
>
> (...)
>
> Switching to Vite opens up Remix to even more users. We also added [SPA mode](https://remix.run/docs/en/main/guides/spa-mode) and [Client Data](https://remix.run/docs/en/main/guides/client-data) to create the best bridge we possibly could to convince devs with React Router apps to migrate to Remix and take advantage of all the great features it has to offer.

- Remix のコンパイラーを Rollup -> esbuild -> Vite (正確には plugin) にして、Vite のユーザーに開放した
- Vite x React の主なユースケースに対応するために、SPA モードとクライアント データも追加した

## Remix Vite is Now Stable (2024/2/20)

https://remix.run/blog/remix-vite-stable

> we’re excited to announce that support for Vite is now stable in Remix v2.7.0!

Vite を使って Remix を(安定的に)構築できるようになったのは、v2.7.0 から

> SPA mode

[v2.5.0](https://github.com/remix-run/remix/blob/main/CHANGELOG.md#v250) で入った SPA mode

> This unlocks an entirely new migration path for React Router consumers to move to Remix without having to switch to a server-rendered architecture

Remix は React Router (SPA の開発でよく使われるルーター) に依存しているにもかかわらず、SPA mode の [RFC](https://github.com/remix-run/remix/discussions/7638) が出たのは思ったより遅めの 2023年10月。
[SSR だけだと React Router (SPA) ユーザーの移行のハードルが高い](https://github.com/remix-run/remix/discussions/7638) ことが課題だったみたい。

> Cloudflare Pages support

Remix は [Hono と同じ用に Web 標準を考慮して開発されている](https://hono-ja.pages.dev/docs/concepts/web-standard) のに、追加でなにが必要なのだろうか？と思ったけれど、
[Vite の開発サーバー (Node 環境) で `context.cloudflar` を参照する](https://github.com/remix-run/remix/blob/main/packages/remix-dev/vite/cloudflare-proxy-plugin.ts#L63) ための plugin だった。

> Presets

~~[実装](https://remix.run/docs/en/main/guides/presets) を見ると、plugin って命名した方が良い気がする~~

外部のツール・ホスティングサービス (例えば Vercel) が Remix の Vite プラグインをカスタマイズするための仕組み。

> Better server and client separation

`.server.ts` ファイルと `.server` ディレクトリがクライアントのコードにインポートされると、コンパイルエラー出るようになった。
以前はランタイムエラーだったらしく、それは全然うれしくない...~~もう漏れてるし...~~ (-> 空のモジュールに置き換えるから、漏れないけどクラッシュする。良かった(良くない)) 。

> Before adopting Vite, Remix used to rely on ESbuild's treeshaking to implicitly separate client and server code.

Vite 導入以前は ESBuild の tree-shaking で暗黙的 (?!) にコードを分離していた。

> Goals:
>
> 1. Simple and robust exclusion of server-only code from the client
> 2. Prefer compile-time errors over runtime errors
> 3. Typesafety for runtime errors
> 4. Avoid performance degradation for common cases

安全に `server-only` コードを分けて、コンパイルエラーを出して、型安全で、ハイパフォーマンスにする。

4つのゴールを実現するための詳細が [remix-run/remix 内の decision (Splitting up client and server code in Vite)](https://github.com/remix-run/remix/blob/main/decisions/0010-splitting-up-client-and-server-code-in-vite.md) に書かれていて、面白かった。

> vite-env-only

[同じモジュール内でサーバー用コードとクライアント用コードを混在させるため](https://remix.run/docs/en/main/discussion/server-vs-client#vite-env-only) に使える `vite-env-only` を公開している。
Remix 固有ではなく Vite 製のフルスタックアプリの問題とはいえ、依存関係が増えるし、柔軟性のためにフレームワークの使用者側が手動で解決するのは Remix アプリの堅牢性が下がりそう...。

> More than just a Vite plugin

当初は “just a Vite plugin” と謳っていたけれど、plugin 以外 (Remix CLI) も出てきた...けど、ほとんどは依然として単なる Vite プラグインであると言っても過言ではないらしい。
このブログ記事以降も `just a Vite plugin` と言っているけれど、むしろややこしくなる (気がする) から辞めた方がよいと思う...。

## Remix ❤️ Vite (2023/10/31)

> In fact, with Vite, Remix is no longer a compiler. Remix itself is just a Vite plugin:

- いままで: Remix とはコンパイラ (Rollup だったり、esbuild だったり)
- これから: Remix は Vite プラグイン

> With this you’ll also get access to the entire ecosystem of [Vite plugins](https://vitejs.dev/plugins). This lets us focus on making the core of Remix the best that it can be while letting Vite plugins handle the rest.

「Remix のコアを可能な限り最適化することに集中して、残りの処理は Vite プラグインに任せる」方針

> Unlike traditional build tools, [**Vite is specifically designed for building frameworks.**](https://vitejs.dev/guide/philosophy.html#building-frameworks-on-top-of-vite)

これは Remix 独自の戦略ではなく、Vite 自身が その上にフレームワークを構築することを推奨していた。

## Remix v2 (2023/9/15)

> If you have a Remix v1 app with all future flags enabled, you have a nearly seamless upgrade to v2 by simply dropping those flags from your Remix config. Of course, this is a major version so we are also taking the opportunity to bump a few of our main dependencies (notably, React 18 and Node 18).
>
> For a comprehensive walkthrough of things you will need to upgrade, please refer to our guide on [upgrading to v2](https://remix.run/docs/en/main/start/v2).

Remix v2 の機能は v1 の future flag で使えるため、v2 は non-braking change になっている (依存関係の更新は除く)。

## React Router 6.4 Release (2022/9/13)

https://remix.run/blog/react-router-v6.4

> After several months of development, the data APIs from Remix have arrived for React Router in v6.4.

Remix の Data API (`loaders`、`actions`、`fetchers` など) が React Router v6.4.0 に組み込まれた。

> Just like `<a href>`, `<form action>` also creates a request and sends it to the server when the user submits it. The only difference is a form can send along some data and usually means you want to update your database.
>
> In other words, data mutations with HTML forms are routing events.

`<a href>` も `<form action>` リクエストをサーバーに送信する。`<form>` はデータ変更を伴うルーティングイベントと言える。

## Data Flow in Remix (2022/6/22)

https://remix.run/blog/remix-data-flow

> [Enter Remix](https://remix.run/docs/en/v1/guides/data-loading): “one of the primary features of Remix is simplifying interactions with the server to get data into components.” Remix extends the flow of data across the network, making it truly one-way and cyclical: from the server (state), to the client (view), and back to the server (action).

Remix を使うことで、サーバーの状態を考慮した一方向のデータフロー（サーバー（状態）からクライアント（ビュー）へ、そして再びサーバー（アクション））を実現することができる。

> Forms, fetchers, loaders, actions, these are all “state management” solutions in Remix (though we don’t call them that). They give you the tools to keep persistent state in sync between the client and the server, ensuring data flows cyclically one-way through your app and across the network: from loaders to a component to an action and back again.

Remix の状態管理はデータが `loader -> component -> action -> loader` の流れでアプリとネットワーク全体で一方向に循環的に流れるようにする。

> With Remix, your UI becomes a function of state across the network, not just locally. An interesting analogy to Remix’s data abstractions is React’s virtual DOM abstraction.

Remix を使用すると、UI はローカルだけでなく、ネットワーク全体の状態関数になる。

## Not Another Framework! (2022/1/26)

https://remix.run/blog/not-another-framework

> When you work in Remix, you're mostly working with standard web APIs.

Remix では 「Web 標準」をよく聞く。

**(検索して戻ってきた)**

React Router v7 の [ドキュメント](https://www.google.com/search?q=site%3Areactrouter.com+web+standard) や [リポジトリ](https://github.com/search?q=repo%3Aremix-run%2Freact-router%20web%20standard&type=code) 内で `web standard` の言及はほぼないっぽい...。

> When you learn how to handle requests and send responses in Remix, you're actually learning the Web Fetch API that's in the browser already. The fetch API is also being adopted in emerging edge platforms like CloudFlare workers and Deno. This knowledge transfers!
>
> This philosophy drives several other APIs in Remix, too:

「Remix の哲学」 = 「Remix で xxx を学ぶと、実際にはブラウザにすでにある yyy を学ぶことになる」

> Data mutations are modeled as HTML forms. You write a plain form and then Remix manages the server communication, providing all the state to your app to build the fanciest of modern web app user interfaces. Did you know that `<button>` can have a value just like `<input>`? This focus on HTML makes building data driven web apps a snap. HTML knowledge transfers.

Remix では HTML の form でデータの更新を行う。
HTML に基づいて Web アプリケーションを開発していると、その知識は Remix 固有ではなく HTML の知識にもなる。

> Form values you work with on the server are standard FormData objects.

サーバー上での処理も `FormData` で行う。

> Remix relies on HTTP caching of static pages instead of wrapping it with a special SSG API: same result, but one is standard web technology that transfers.

`HTTP caching of static pages` は多分 [`stale-while-revalidate`](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Cache-Control) のことを指している。
フレームワーク固有の機能として SSG して静的なコンテンツを予め出力・キャッシュさせるのではなく、HTTP の機能で動的なコンテンツをキャッシュしようとしている。

(その後、[pre-rendering static pages](https://reactrouter.com/start/framework/rendering) 機能が React Router に導入されるけれど...)

> Cookies and sessions are built on top of the Web Fetch API Request and Response objects

[`Cookie` 型は独自に定義している](https://github.com/remix-run/remix/blob/remix%401.19.3/packages/remix-server-runtime/cookies.ts) けれど、これが 「Web Fetch API」に基づいているかどうかが分からなかった。

Web Fetch API 上に cookie object がないから、仕様に基づいて実装している...ってことかな？

## Remix v1 (2021/11/22)

> Remix is an edge-first web framework that embraces JavaScript runtimes running as close as possible to your users.

Remix v1 では edge で動かすためのフレームワークとしている。

**(リポジトリ見て戻ってきた)**

Remix v1 は 意外と多くの種類の [adapter](https://remix.run/docs/en/1.19.3/other-api/adapter) がある:

- [architect](https://github.com/remix-run/remix/tree/v1.6.4/packages/remix-architect)
- [cloudflare-pages](https://github.com/remix-run/remix/tree/v1.6.4/packages/remix-cloudflare-pages)
- [cloudflare-workers](https://github.com/remix-run/remix/tree/v1.6.4/packages/remix-cloudflare-workers)
- [express](https://github.com/remix-run/remix/tree/v1.6.4/packages/remix-express)
- [netlify](https://github.com/remix-run/remix/tree/v1.6.4/packages/remix-netlify)
- [vercel](https://github.com/remix-run/remix/tree/v1.6.4/packages/remix-vercel)

React Router v7 では (少なくとも執筆時点では) adapter が減っているけれど、edge 以外の環境も想定はされている。

- [architect](https://github.com/remix-run/react-router/tree/main/packages/react-router-architect)
- [cloudflare](https://github.com/remix-run/react-router/tree/main/packages/react-router-cloudflare)
- [express](https://github.com/remix-run/react-router/tree/main/packages/react-router-express)

[^1]: 多分 [Cloudflare worker が V8 で構築されていて](https://developers.cloudflare.com/workers/runtime-apis/web-standards/)、[Remix が web standard を謳っている](https://remix.run/) からだとは思う
