---
title: "(Node.js にとっての) ES modules ってなに"
date: 2023-05-05
---

## 俺、 ESM のことを全部知ってる気になってた

「ES modules? TypeScript で書いているぜ 👊😁」ってなってたり、
「ES modules? [Vite で使ってる](https://vitejs.dev/guide/why.html) ぜ 🫰😘」ってなる

```ts
export const addOne = (num: number) => num + 1;
// ってやって

import { addOne } from "./hoge";
// ってやる！
```

「最近 `.mjs` って拡張子見かけるようになったな〜」とか、
「~~適当に書いてたら~~ `ERR_REQUIRE_ESM` って出てきたことあったな〜」とか、
色々思い返してみると、「俺、 ES modules って」

ってことで、 Node.js の `Modules:*` のドキュメントを読んで整理しておくことにしました。

## Modules: ECMAScript modules (Node.js v18.16.0)

https://nodejs.org/dist/latest-v18.x/docs/api/esm.html

### Introduction

> ECMAScript modules are [the official standard format](https://tc39.github.io/ecma262/#sec-modules) to package JavaScript code for reuse. Modules are defined using a variety of import and export statements.

- "ECMAScript modules" 自体は ECMAScript で定義されている再利用のための仕組み
- 概要の範囲では「`import`/`export` 宣言使ってるぜ！」で ESM 使えてるって言えそう

> Node.js fully supports ECMAScript modules as they are currently specified and provides interoperability between them and its original module format, CommonJS.

- Node.js は ESM を完全にサポートしている
- 既存の [CommonJS](https://nodejs.org/dist/latest-v18.x/docs/api/modules.html) との相互運用性を提供している

### Enabling

- Node.js には２つのモジュールシステム (ESM/CommonJS) があるから、モジュールローダーに ESM を使うことを伝える必要がある
  - `.mjs` 拡張子
  - package.json の `type` フィールド
  - `--input-type` フラグ
- 伝えない場合、CommonJS を使う

### Import assertions

`Stability: 1 - Experimental` なので、skip

### Builtin modules

### `import()` expressions

### import.meta

> The import.meta meta property is an Object that contains the following properties.

- `Object` だから、[Vite 独自の機能](https://vitejs.dev/guide/features.html#glob-import) を生やせるわけだね

> import.meta, a host-populated object available in Modules that may contain contextual information about the Module
> (ref: [Introduction](https://tc39.es/ecma262/#sec-intro))
>
> An object exposed through the import.meta meta property. It is empty until it is accessed by ECMAScript code.
> (ref: [Table 54: Additional Fields of Source Text Module Records](https://tc39.es/ecma262/#table-additional-fields-of-source-text-module-records))

- 仕様(ECMA-262)を見る限りでは~~さっぱり意味が分からないけれど~~、ECMAScript の範囲で定義される `import.meta` オブジェクトのプロパティはなさそう
- モジュールに関するコンテキスト情報が入る **かも** だけれど、それは実行環境に依存しているみたい
  - Node.js の場合は、今の所、👇
    - `import.meta.url`
    - `import.meta.resolve`

### Interoperability with CommonJS

#### import statements

- `import` 文は ESM、CommonJS モジュールを読み込める
- `import` 文 ESM モジュール内でのみ使える
- CommonJS モジュール内では `import()` 式で ESM モジュールを読み込める
- CommonJS モジュールを読み込んだ場合、
  - `module.exports` オブジェクトは default export として扱われる
  - > Named exports may be available
    - **may** って困る...。駄目な時はいつだ...。

TypeScript では `esModuleinterop` を true にしていた部分だけれど、
Node.js の 相互運用性を提供してくれていた

#### `require`

- `require` は、参照するファイルを常に CommonJS として扱います
  - => CommonJS モジュールから `require` で ESM モジュールは読み込めないはず...
- ESM は非同期で実行されるため、`require` (同期的な読み込み) を使用して ESM モジュールを読み込めない
- CommonJS では `import()` (非同期関数) を使用して、ES モジュールを読み込む

#### CommonJS Namespaces

- CommonJS モジュールは `module.exports` オブジェクトで構成されている
- CommonJS モジュールを `import` 文で読み込んだ場合、`module.exports` オブジェクトは ESM の default export に割り当てられる

#### Differences between ES modules and CommonJS

- `require`、`exports`、`module.exports` が使えない
  - `import` 文を使う
- `__filename`、 `__dirname` が使えない
  - `import.meta.url` で自分で作る
- Addon (が何か分からないけれど、[ドキュメント](https://nodejs.org/dist/latest-v18.x/docs/api/addons.html) を見る限りネイティブを使ったあれこれ...) が使えない
- `require.resolve` が使えない
  - `new URL('./local', import.meta.url)` か `(experimental) import.meta.resolve` か　`module.createRequire()` を使う
- NODE_PATH が使えない
- `require.extensions` が使えない
- `require.cache` が使えない

### JSON modules

`Stability: 1 - Experimental` なので、skip

### Wasm modules

`Stability: 1 - Experimental` なので、skip

### Top-level await

- ES モジュール内では最上位の body で `await` キーワードが使える

> ECMAScript 2022, the 13th edition, introduced top-level await
> (ref: [Draft ECMA-262 / May 3, 2023 - Introduction](https://tc39.es/ecma262/#sec-intro))

top-level await は ECMAScript (仕様) の範囲

### HTTPS and HTTP imports

`Stability: 1 - Experimental` なので、skip

### Loaders

`Stability: 1 - Experimental` なので、skip

### Resolution algorithm

## Modules: Packages (Node.js v18.16.0)

https://nodejs.org/dist/latest-v18.x/docs/api/packages.html

WIP
