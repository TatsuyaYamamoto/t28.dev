---
title: "tsup を使う理由をドキュメントと実装から調べた"
date: 2023-07-01
---

[tsup](https://www.npmjs.com/package/tsup) という TypeScript 製のライブラリ向けバンドラーが良さげ〜ってなったので、tsup がやってくれることを調べてみたメモ (v7.1.0 時点)。

## tsup?

> Bundle your TypeScript library with no config, powered by esbuild.
>
> ref: https://www.npmjs.com/package/tsup

って書いてあるとおり、 tsup は esbuild のラッパー(バンドラー)。`with no config` という部分から「ライブラリ向けの esbuild の設定をいい感じにやってくれるんだな〜」と想像出来るけれど、

- 具体的に何をやってくれているの？🤔
- わざわざ依存関係を増やすほどのメリットあるの？🤔

って部分が気になる。

## tsup を採用している OSS

適当に検索して見つけた tsup の採用事例がこちら。

- chakra-ui
  - [Migrate to pnpm #6356](https://github.com/chakra-ui/chakra-ui/pull/6356) 内の [abffed8](https://github.com/chakra-ui/chakra-ui/pull/6356/commits/abffed8472fbdfe47ae916c4e58101e06029f9b7) で **unbuild** から tsup に移行している
- Redux
  - [Rewrite build/setup and hopefully fix ESM compat #4511](https://github.com/reduxjs/redux/pull/4511) で **Rollup+Babel** から tsup に移行している
- storybook
  - [Build chain upgrades: TS4, Webpack5, modern ESM, TSUP #18205](https://github.com/storybookjs/storybook/pull/18205) で **webpack** から tsup に移行している

一方、なぜ tsup を採用したか、各 OSS のモチベーションは PR を見ても分からなかった...(OSS が依存するライブラリってどうやって選ばれるんだろう...?)。

## 実装を軽く読んでみる

### エントリーポイント

```bash
$ cat package.json | jq '.main'
"dist/index.js"

$ cat package.json | jq '.bin'
{
  "tsup": "dist/cli-default.js",
  "tsup-node": "dist/cli-node.js"
}
```

`cli-*.ts` が複数あるけれど [cli-main.ts](https://github.com/egoist/tsup/blob/v7.1.0/src/cli-main.ts) が CLI 用実装の実体で、メインロジック(`index.ts` の `build()`) を実行する役割を担っている。
`cli-default.ts`, `cli-node.ts` の違いは node だと `skipNodeModulesBundle: true` オプションを渡していることで、bundle から除外するモジュールを決定するために [tsup が実装した esbuild plugin](https://github.com/egoist/tsup/blob/v7.1.0/src/esbuild/external.ts) の振る舞いを少し変える。

### メインロジック

`index.ts` の [`build: (_options: Options) => Promise<void>`](https://github.com/egoist/tsup/blob/v7.1.0/src/index.ts#L131) で設定ファイルの読み込みや options の構築 ([index.ts#L132-L143](https://github.com/egoist/tsup/blob/v7.1.0/src/index.ts#L132-L143)) をした後、

- dtsTask ([index.ts#L161](https://github.com/egoist/tsup/blob/v7.1.0/src/index.ts#L161))
- mainTasks ([index.ts#L197](https://github.com/egoist/tsup/blob/v7.1.0/src/index.ts#L197))

を並列で実行している ([index.ts#L392](https://github.com/egoist/tsup/blob/v7.1.0/src/index.ts#L392))。

#### dtsTask

- `--dts` オプションが有効のとき `worker_threads`(!) で並列に実行されるタスク。
- タスクの実体は [rollup.ts#L278-L288](https://github.com/egoist/tsup/blob/v7.1.0/src/rollup.ts#L278-L288) で、rollup を実行する。
- tsup がいくつかの rollup plugin を設定してくれている。
  - tsupCleanPlugin
    - [tsup 独自 rollup plugin](https://github.com/egoist/tsup/blob/v7.1.0/src/rollup.ts#L117-L124)
    - ビルド時に `options.outDir` 内の`**/*.d.{ts,mts,cts}` を削除する
  - tsResolvePlugin
    - [tsup 独自 rollup plugin](https://github.com/egoist/tsup/blob/v7.1.0/src/rollup/ts-resolve.ts)
    - 外部モジュールとしてマークするかを決定する？（ぱっと見よく分からん）
  - [rollup-plugin-hashbang](https://www.npmjs.com/package/rollup-plugin-hashbang)
    - エントリーファイルに shebang が付いていたら、`chmod 755` してくれる
  - [@rollup/plugin-json](https://www.npmjs.com/package/@rollup/plugin-json)
    - json ファイルを es6 module に変換する
  - ignoreFiles
    - [tsup 独自 rollup plugin](https://github.com/egoist/tsup/blob/v7.1.0/src/rollup.ts#L126-L133)
    - `.(js|cjs|mjs|jsx|ts|tsx|mts|json)` **じゃない**ファイルを無視する
  - [rollup-plugin-dts](https://www.npmjs.com/package/rollup-plugin-dts)
    - 出力する d.ts ファイルをバンドルする
  - fixEnumDeclaration
    - [tsup 独自 rollup plugin](https://github.com/egoist/tsup/blob/v7.1.0/src/rollup.ts#L135-L142)
    - バグ対応用 ([#834](https://github.com/egoist/tsup/issues/834))

#### mainTasks

- タスクの実体は [esbuild/index.ts#L162-L244](https://github.com/egoist/tsup/blob/v7.1.0/src/esbuild/index.ts#L162-L244) で esbuild を実行する。
- esbuild に渡すオプションを tsup のオプションに基づいていい感じに構築してくれたり、いい感じのデフォルト値として設定してくれたり、いい感じの [tsup 独自 esbuild plugin](https://github.com/egoist/tsup/blob/v7.1.0/src/esbuild/index.ts#L121-L150) を渡してくれたりしている。

## ドキュメントを読んでみる

"Why tsup?" 的なセクションがなかったので、[Usage](https://tsup.egoist.dev/#usage) を順番に眺める。

### [Bundle files](https://tsup.egoist.dev/#bundle-files)

`tsup src/index.ts` ってやると、bundle された js ファイルが `./dist` に出力される。

esbuild で同じようなことをする場合は `esbuild src/index.ts --outdir=dist --bundle` ってやるので、 tsup の `with no config` を最小限の CLI からも感じる。

### [Excluding packages](https://tsup.egoist.dev/#excluding-packages)

tsup は dependencies と peerDependencies を**デフォルトでバンドルに含めない**。`--external` を使えばそれ以外のパッケージもバンドルから除外することが出来る。

esbuild も [external オプション](https://esbuild.github.io/api/#external) で依存関係を除外することが出来るけれど、**デフォルトではバンドルする**。

### [Generate declaration file](https://tsup.egoist.dev/#generate-sourcemap-file)

tsup は `--dts` で型定義ファイルを出力することができる (rollup に出力させている)。

一方、esbuild は型定義ファイルの出力をサポートしていない。

- https://esbuild.github.io/content-types/#no-type-system
- https://github.com/evanw/esbuild/issues/95

### [Bundle formats](https://tsup.egoist.dev/#bundle-formats)

tsup は出力する js ファイルの形式として `esm` `cjs` `iife` をサポートしている。
tsup の format オブションは esbuild の format オプションとしてそのまま(例外あるけど)渡される ([esbuild/index.ts#L164-L165](https://github.com/egoist/tsup/blob/v7.1.0/src/esbuild/index.ts#L164-L165))。

esbuild も `esm` `cjs` `iife` を[サポートしている](https://esbuild.github.io/api/#format)...というか、 tsup の format オプションを esbuild に渡している ([esbuild/index.ts#L164-L165](https://github.com/egoist/tsup/blob/v7.1.0/src/esbuild/index.ts#L164-L165))。

加えて tsup は format を配列形式で渡せることが出来るため、複数の形式を出力するビルドが便利になっている。これは format の配列要素分、esbuild を実行することで実現している ([index.ts#L249](https://github.com/egoist/tsup/blob/v7.1.0/src/index.ts#L249))。

### [Target environment](https://tsup.egoist.dev/#target-environment)

tsup の target オプションは esbuild の target オプションとしてそのまま渡される ([index.ts#L172](https://github.com/egoist/tsup/blob/v7.1.0/src/esbuild/index.ts#L172)) ので、機能として同等。

esbuild は [ES5 へ変換は未サポート](https://esbuild.github.io/content-types/#es5)だが、tsup は SWC を使って ES5 へ変換できる。

### [Compile-time environment variables](https://tsup.egoist.dev/#compile-time-environment-variables)

tsup ではビルドタイムで参照できる環境変数を定義することが出来る。
これは Node.js の形式 (`process.env.*`) や Vite (?) 形式 (`import.meta.env.*`) で定義した環境変数を esbuild の [define](https://esbuild.github.io/api/#define) を使って置き換える設定を tsup がやってくれているということ ([esbuild/index.ts#L211-L218](https://github.com/egoist/tsup/blob/v7.1.0/src/esbuild/index.ts#L211-L218))。

### [Building CLI app](https://tsup.egoist.dev/#building-cli-app)

エントリーポイントのファイルに shebang が含まれているとき、そのファイルのパーミッションを 755 にしてくれる。ちょって便利。

### [Minify output](https://tsup.egoist.dev/#minify-output)

esbuild による minify の on/off とは別で、terser による minify を選ぶことが出来る。

余談だけれど、この機能は tsup 専用の [terser plugin](https://github.com/egoist/tsup/blob/v7.1.0/src/plugins/terser.ts) を実装することで実現していて、オプションの型や実装の構造が Vite と似ている。

- https://ja.vitejs.dev/config/build-options.html#build-minify
- https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/terser.ts

### [Tree shaking](https://tsup.egoist.dev/#tree-shaking)

esbuild の [tree shaking](https://esbuild.github.io/api/#tree-shaking) はバンドルする場合デフォルトで有効になりますが、いくつかの不具合の対策として、tsup 独自の `--treeshake` ([plugins/tree-shaking.ts](https://github.com/egoist/tsup/blob/v7.1.0/src/plugins/tree-shaking.ts))を提供している。 このオプションを有効にすると、 rollup による tree shaking をビルドに組み込むことが出来る。

### [What about type checking?](https://tsup.egoist.dev/#what-about-type-checking)

esbuild は[型チェックを行わない](https://esbuild.github.io/content-types/#typescript)

tsup は `--dts` を有効にすると、実際の TypeScript コンパイラが実行されて宣言ファイルが生成され、型チェックも行われます。

### [Inject cjs and esm shims](https://tsup.egoist.dev/#inject-cjs-and-esm-shims)

- `cjs` 環境でのみ使える `__dirname`
- `esm` 環境でのみ使える `import.meta.url`

それぞれが異なる環境でも機能するためのコード ([cjs_shims.js](https://github.com/egoist/tsup/blob/v7.1.0/assets/cjs_shims.js), [esm_shims.js](https://github.com/egoist/tsup/blob/v7.1.0/assets/esm_shims.js)) が tsup によって挿入される([esbuild/index.ts#L220](https://github.com/egoist/tsup/blob/v7.1.0/src/esbuild/index.ts#L220))。便利。

### Copy files to output directory

`--publicDir` でビルド時に出力ディレクトリにコピーするファイルを設定できる。(多分、)便利。

## ってことで

🥰「tsup 使う！」

ライブラリをビルドする上でどうせやることをある程度 [^1]任せられるのはやっぱり楽だ。

[^1]: `with no config` と言いつつ、設定ファイルは普通に必要...。
