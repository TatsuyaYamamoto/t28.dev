---
title: 新旧 JSX Transform と @jsx・@jsxImportSource がやっていることにちょっとだけ詳しくなる
date: 2021-03-22
description: "React v17で提供される 新しいJSX Transformと以前のJSX Transformの違いを知って、pragma, import source optionが"
---

## 何この記事？

emotion で必要な pragma[^1] について知ろうとしたら、React v17 の [the New JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) にちょっとだけ詳しくなれた、その幸せの共有

脳みそ止めて `import React from "react"` とか、 `/* @jsx jsx */` とかしていたものが、スッキリしました。

## ことの発端 1 (読み飛ばしていいヤツ)

<details>
    <summary>Next.js(v10)でemotionを使おうとしたら、エラーが出た</summary>

```shell
% npx create-next-app next-v-10 # Next.js のプロジェクト作って
% cd next-v-10
% npm i @emotion/react
% hogehoge                      # emotion のあれを付けて
% npm run dev                   # サーバーを起動...

error - ./pages/index.js
SyntaxError: next-v-10/pages/index.js: pragma and pragmaFrag cannot be set when runtime is automatic.
> 1 | /* @jsx jsx */
    | ^
  2 | import {jsx, css} from "@emotion/react";
  3 | import Head from 'next/head'
  4 | import styles from '../styles/Home.module.css'
    at transformFile.next (<anonymous>)
    at run.next (<anonymous>)
```

</details>

...ので、[公式ドキュメント(#jsx-pragma)](https://emotion.sh/docs/css-prop#jsx-pragma) を見てみました(意訳注意)。

> css prop を使うときは、the jsx pragma (`/** @jsx jsx */`)を使う
> [the new JSX runtimes](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) の React を使用している場合、 `/** @jsx jsx */` pragma の代わりに、 `/** @jsxImportSource @emotion/react */` を使う

解決策(`/** @jsxImportSource @emotion/react */` を使う)は分かったけれど... 💭

## ことの発端 2

[emotion のドキュメントに従って](https://emotion.sh/docs/css-prop#jsx-pragma)

👊😊 emotion 使いてぇ〜！ => 💻`/* @jsx jsx */` or 💻`/* @jsxImportSource @emotion/react */`

が板につくのもいいけれど、

- なんで pragma で css prop を解決できるんだ?
- なんで @jsx, @jsxImportSource で使い分ける必要があるんだ (React の classic, automatic runtime ってなに)?

を解決して、スッキリしたくなった。

## pragma ってなに

とりあえず [ググる](https://www.google.com/search?q=pragma&oq=pragma) 。

どうやら、pragma は**コンパイラに何かしらの指示を渡すもの**のことらしい。
つまり今回のケースでは、pragma(`/*@jsx jsx*/`)はコンパイラ(Babel, TypeScript)へ何かしらの指示を渡すものなんですね。

## JSX pragma ってなに

じゃあ `/*@jsx jsx*/` で何を コンパイラに伝えているか、ですが

### そもそも JSX ってなに

[JSX In Depth](https://reactjs.org/docs/jsx-in-depth.html#gatsby-focus-wrapper)

> JSX just provides syntactic sugar

JSX は React コンポーネントを簡潔に記述するためのシンタックスシュガーです。
コンパイラは、JSX を ブラウザが理解できる JS に変換する時、JSX 記法の部分(`<div></div>`)を JS の関数(`React.createElement("div")`)に変換しているわけです。

- Babel によるコンパイル([playground](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBAFiA5gUxgXhgCgFAxgHgBMBLANwD5g5iAbQgJ2THwHoSLsBKIA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.13.11&externalPlugins=) )。

  ```js
  // from
  const hoge = <div>children</div>;

  // to
  const hoge = /*#__PURE__*/ React.createElement("div", null, "children");
  ```

- TypeScript によるコンパイル ([playground](https://www.typescriptlang.org/play?ssl=1&ssc=1&pln=3&pc=1#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wG4AoNCAOwGd4ALCAcyTgF44AeAE2ADcAfGgbAANjyLUuAej5CKQA) )。

  ```js
  // from
  import React from "react";
  const hoge = <div>children</div>;

  // to
  import React from "react";
  const hoge = React.createElement("div", null, "children");
  ```

今まで jsx ファイルを作るときにおまじないのように `import React from "react"`を書いていたけれど、変換後に React オブジェクトが読み込まれるからそれを解決するために import していたんだね！スッキリ 🌟

### つまり、JSX pragma って

Babel は [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx/) で pragma のサポートを提供しているみたいです。
TypeScript は [この PR(#21218)](https://github.com/Microsoft/TypeScript/pull/21218) で pragma の 機能が導入されたようです。

それぞれ、pragma によって JSX 記法から変換する JS の関数を指定するために pragma をサポートしています。
例えば emotion の場合、 標準の関数(`React.createElement`) から css prop を使える 関数(`jsx()`)[^2]に pragma で置き換えています。

[emotion.sh/docs/css-prop#get-started](https://emotion.sh/docs/css-prop#get-started)

> compiled jsx code will use emotion’s jsx function instead of React.createElement

~~Getting Stared ののっけから核心が書いてある...。ものすごく遠回りした気分~~

## New JSX Transform(classic/automatic runtime) ってなに

ここで React のドキュメント [Introducing the New JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) に行きます。
Babel と協力して、React v17 で新しい JSX Transform を提供するようです。
([新しい JSX Transform のメリット、古いものの課題はスキップします](https://ja.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform)。)

今までこれ(↓)を

```js
import React from "react";
const App = () => <h1>Hello World</h1>;
```

こう(↓)してたもの (前述の変換と同じ)が、

```js
import React from "react";
const App = () => React.createElement("h1", null, "Hello world");
```

これ(↓)を

```js
const App = () => <h1>Hello World</h1>;
```

こう(↓)するように変わりました。

```js
import { jsx as _jsx } from "react/jsx-runtime";
const App = () => _jsx("h1", { children: "Hello world" });
```

大事なポイントは、React コンポーネントを定義する関数(`jsx as _jsx`)をコンパイル時に自動でインポートしてくれている点です。
変換後コード内で React オブジェクトを読み込まなくなったため、自分で `import React from "react"`する必要がなくなっています。

以前の変換で使用するものが classic runtime、新しい変換で使用するものが automatic runtime ってことだね。スッキリ 🌟🌟

## つまり@jsxImportSource がやっていることは

前述の通り、変換後のコードが新旧 transform で大きくことなるため、標準の関数(`React.createElement()` or `_jsx()`)から別の関数(emotion の`jsx()`)に置き換える手段も変わりました。
[the importSource option](https://babeljs.io/docs/en/babel-preset-react#importsource) で行います([公式ドキュメント](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) )。

つまり、

新しい transform でこれ(↓)が

```js
const hoge = <div>children</div>;
```

このように(↓)、自動でインポートしてくれる `require("react/jsx-runtime")` を

```js
var _jsxRuntime = require("react/jsx-runtime");

const hoge = /*#__PURE__*/ (0, _jsxRuntime.jsx)("div", {
  children: "children",
});
```

このように(↓)、`@jsxImportSource` を使うことで

```js
/* @jsxImportSource hogehoge */
const hoge = <div>children</div>;
```

`require("hogehoge/jsx-runtime")` に変えてインポートさせること出来ます。

```js
var _jsxRuntime = require("hogehoge/jsx-runtime");

/* @jsxImportSource hogehoge */
const hoge = (0, _jsxRuntime.jsx)("div", {
  children: "children",
});
```

[playground(OPTIONS React Runtime を automatic にしてください)](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=PQKgBAAgVgzgHgSQLYAcD2AnALgZTQVwwGMBTMACzQHMTKawRgAoItAOxiwurIF4wAFEzBgAPABMAlgDcAfEXKSANuIwk2o4FLlMAlEA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=false&presets=env%2Creact&prettier=false&targets=&version=7.13.11&externalPlugins=)

## とどのつまり

- Babel や TypeScript は JSX を `React.createElement` を使った形式(JS)に変換してくれる。
- emotion が使う css prop は標準の`React.createElement` にないから、pragma(`/* @jsx jsx */`) を使って`import { jsx } from '@emotion/react'`の`jsx()`で React コンポーネントを定義するようにする。
- React v17 が [the New JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) を導入したことで、JSX の変換結果が変わった。
- 新しい変換済みのコードに併せて、標準の関数(`require("react/jsx-runtime")`)を置き換えるために、importSource option(`/* @jsxImportSource @emotion/react */`)を使って、`require("@emotion/react/jsx-runtime")` で React コンポーネントを定義するようにする。

**余談**

ライブラリ側はもちろん新しい transform をサポートする必要があるため、emotion では[こんな issues](https://github.com/emotion-js/emotion/issues/2041) で報告・解決されていました。

[^1]: emotion 使いてぇ〜！ 👊😊 => これ `/* @jsx jsx */`
[^2]: [emotion-js/emotion の jsx.js](https://github.com/emotion-js/emotion/blob/master/packages/react/src/jsx.js)
