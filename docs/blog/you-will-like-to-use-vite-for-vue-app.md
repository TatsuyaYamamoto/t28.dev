---
title: '"out-of-the-box" な Vite で あなたも Vue を開発したくなる (のメモ)'
date: "2022-10-19"
---

**前提**

この記事は、私が "[UIT Meetup vol.17『もっと好きになる Vue.js』](https://uit.connpass.com/event/258384/)" に登壇するに際して事前に調べた情報の**メモを(ほぼ)そのまま流用したもの**です。
いろんな都合で登壇時には言及しない余談(多分)等もそのままの雑な読み物ですが、参考までにということで 🙏

![UIT Meetup vol.17『もっと好きになるVue.js』](/assets/blog/you-will-like-to-use-vite-for-vue-app/uit_meetup_vol_17.jpg)

---

## Vite って何？

公式ページの紹介文を部分的に流用して説明すると

> 現代の Web プロジェクトのための、より速い開発体験を提供する、ビルドツール
>
> ref: https://vitejs.dev

### 各要素の個人的な解釈

1. 現代の Web プロジェクト
   - ES Modules サポート前提の環境
     - `native ES Modules`
     - `native ESM dynamic import`
     - `import.meta`
2. より速い開発体験
   - ネイティブ ES モジュールを利用した開発サーバ
   - 事前に設定されたビルドコマンド
3. ビルドツール
   - esbuild
     - TypeScript や JavaScript の構文のトランスパイル、minify を行う
   - Rollup
     - production ビルド時のバンドルを行う

### Vue による Vite の紹介

> Vite は、ファーストクラスの Vue SFC のサポートがある軽量で高速なビルドツールです。
>
> ref: https://ja.vuejs.org/guide/scaling-up/tooling.html

- ビルドツールの部分は、Vite 公式ページの紹介と同じ
- 「ファーストクラスの VueSFC のサポート」の意味 (個人的解釈)
  1. @vitejs/plugin-vue を Vite が公式プラグインとして提供している
  2. Plugin の仕組みがしっかりしているので、Vue でなくてもいい (@vitejs/plugin-react もある) んだけれど… vue を考慮したロジックが Vite 内にある
     - esbuild (minify) の設定
     - HMR の読み込みポーリング (Vue ファイルの更新イベントに対する読み込みが早すぎるときがあるらしい）

## Vite っていいよね〜だって...

![Vite features](/assets/blog/you-will-like-to-use-vite-for-vue-app/vite_features.jpg)

ref: https://vitejs.dev

- めちゃくちゃな超意訳
  1. はやい (Instant Server Start)
  2. うまい (Lightning Fast HMR)
  3. やすい (Out-of-the-box support) 👈❤️

Vite は早い(`Instant Server Start`, `Lightning Fast HMR`) に注目が行きがちだけれど、`Out-of-the-box support` が私の推しポイント

## out-of-the-box ってなに？

「すぐ使える」ってこと

> OOTB とは、「箱から出て」という意味の英語表現だが、IT 分野では製品などを入手後にすぐ使えるという意味の慣用表現として用いられる。
>
> ref: https://e-words.jp/w/OOTB.html

個人的に out-of-the-box で嬉しいポイントは

```
すぐ使える
↓
開発者によるオレオレ設定が少ない
↓
プロダクト毎の設定のばらつきが少ない
↓
最高 ❤️
```

って感じ ❤️

## 本当に "out-of-the-box" なわけ？

`npm create vite@latest` の [vite.config.ts](https://github.com/vitejs/vite/blob/main/packages/create-vite/template-vue-ts/vite.config.ts) を覗いてみる。
実際には追加で色々設定を書くことにはなるけど、大事なポイントは「開発の基本設定はプラグインで終わる」ということ

```
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]
})
```

例えば、Vite ではこんなことをやってくれる

1. Vite の機能 (超一部)
   - TypeScript
     - `.ts`のインポート
     - トランスパイル (esbuild)
   - Sass
     - `.scss`, `.sass`, `.less`, `.styl`, `.stylus` のインポート
     - コンパイル (インストールしたプリプロセッサを認識してくれる)
   - Static Assets
     - `.png` とか (images)、`.mp4` とか (media)、`.woff` とか (fonts)、`.webmanifest` とか (other) のインポート
     - public URL の解決
     - インライン化
   - JSON
     - `.json` のインポート
2. @vitejs/plugin-vue (公式プラグイン)
   - Vue
     - `.vue` のインポート
     - コンパイル (vue/compiler-sfc)
3. vite-svg-loader (コミュニティプラグイン)
   - SVG as Vue Component
     - `.svg` を `@vue/compiler-sfc` で Vue Component に変換する

### (余談 1) 内部 Plugin

Vite 自体の各種機能も内部プラグインのような形式で、Plugin Interface の実装として作られている

ref: https://github.com/vitejs/vite/tree/main/packages/vite/src/node/plugins

### (余談 2) Vite が提供する型定義

Vite は クライアント向け `d.ts` 定義ファイルを提供している ([client.d.ts](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts))。

```
/// <reference types="vite/client" />
```

この中には Vite 独自拡張 (`import.meta`) の型以外にも、Vite がインポートできるファイル形式の定義も含まれている

```
declare module '*.png' {
  const src: string
  export default src
}
```

"out-of-the-box" な感じがナイス！

## 一方、Vue CLI

"out-of-the-box" の観点なら、Vue CLI でもいいじゃん！ 細かい設定を隠蔽してくれているのは同じじゃん！

| Vite                 | Vue CLI                                                                                                                                                                                  |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript           | [ts-loader で `.ts` をトランスパイル](https://github.com/vuejs/vue-cli/blob/6b163f28fc3428284a06957f157f7825cd8fd74c/packages/@vue/cli-plugin-typescript/index.js#L61)                   |
| Sass                 | プリプロセッサのパッケージ (例えば sass) を追加インストールしたら[コンパイル出来る](https://github.com/vuejs/vue-cli/blob/6b163f28fc/packages/%40vue/cli-service/lib/config/css.js#L203) |
| Static Assets        | webpack がサポートしている (Asset Modules)                                                                                                                                               |
| JSON                 | webpack がサポートしている                                                                                                                                                               |
| Vue                  | vue-loader (公式プラグイン) を使う                                                                                                                                                       |
| SVG as Vue Component | vue-svg-loader (コミュニティプラグイン) を使う                                                                                                                                           |

### (余談) 型チェック

- Vite
  - build コマンド (内部的には esbuild) は型を落とすだけ
  - 型チェックは `vue-tsc --noEmit` で行う
- Vue CLI もプロセスを分けるという意味では同じ
  - [ts-loader](https://github.com/TypeStrong/ts-loader) で型を落とす
    - ref: https://github.com/vuejs/vue-cli/blob/6b163f28fc3428284a06957f157f7825cd8fd74c/packages/@vue/cli-plugin-typescript/index.js#L64
  - [fork-ts-checker-webpack-plugin](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin) で型チェックする
    - ref: https://github.com/vuejs/vue-cli/blob/6b163f28fc3428284a06957f157f7825cd8fd74c/packages/@vue/cli-plugin-typescript/index.js#L92

## Build Performance の観点

じゃあ Vite は Vue CLI でやっていたこと同じで、後発なりに洗練されているだけなの？

=> 否！webpack のビルドパフォーマンスに関する記事を見ると、Vite が "out-of-the-box" 的に対応してくれているものがあった 😊

### webpack - Build Performance

ビルドパフォーマンスを上げるためのガイドが webpack の公式ページ内にある。今回は「Dlls」に注目してみる。

ref: https://webpack.js.org/guides/build-performance/

- General
  - Stay Up to Date
  - Loaders
  - Bootstrap
  - Resolving
  - Dlls 👈
  - Smaller = Faster ❗️
  - Worker Pool
  - Persistent cache
  - Custom plugins/loaders
  - Progress plugin
- Development
  - Incremental Builds
  - Compile in Memory
  - stats.toJson speed
  - Devtool ❗️
  - Avoid Production Specific Tooling ❗️
  - Minimal Entry Chunk ❗️
  - Avoid Extra Optimization Steps ❗️
  - Output Without Path Info ❗️
  - Node.js Versions 8.9.10-9.11.1
  - TypeScript Loader
- Production
  - Source Maps
- Specific Tooling Issues
  - Babel
  - TypeScript ❗️
  - Sass

(❗️ は 参考にはなりそうだけれど、Vue CLI にも同等のものがあったり no-bundled だからで片付く話が多いので skip)

## DLLPlugin - webpack

> move code that is changed less often into a separate compilation
>
> ref: https://webpack.js.org/guides/build-performance/

- 前述の「Dlls」は webpack の DLL Plugin のことを指している。
- DLLPlugin を使って、あまり更新されないコード（一般的には npm パッケージ）のビルドプロセスをアプリケーションのものと分けることで、パフォーマンスの改善を図る

### 一般的な webpack.config.js のビルド

![](/assets/blog/you-will-like-to-use-vite-for-vue-app/webpack_config_single.jpg)

npm パッケージや自分で書いたアプリケーションのモジュールを全て対象にビルド・バンドルするので重いよってこと。

### DllPlugin を使ったビルド

![](/assets/blog/you-will-like-to-use-vite-for-vue-app/webpack_config_multi.jpg)

DllPlugin を使って２つのビルドプロセスに分ける

1. イラスト左側の忍者
   - `webpack.DllPlugin` を持った `webpack.vendor.config.js` で npm パッケージ (例えば vue) を指定してビルドする
   - 出力結果
     - `vendor-manifest.json` (バンドル結果の情報が入っている)
     - `vendor-bundle.js` (vue が入っている)
2. イラスト右側の忍者
   - `webpack.DllReferencePlugin` を持った `webpack.app.config.js` で
   - `vendor-manifest.json` を読み取ってビルド
   - 出力結果
     - `app-bundle.js`

### ビルドツールのサポート

- Vue CLI
  - サポートなし (`vue.config.js` を編集したり、npm script の検討が必要)
- Vite
  - NPM Dependency Resolving and Pre-Bundling 🤗

## NPM Dependency Resolving and Pre-Bundling

ref: https://vitejs.dev/guide/dep-pre-bundling.html

webpack が課題としていたこと (更新頻度が低いモジュールまでコンパイル対象になる) に対して、`npx vite serve` だけで解決出来る!

- Vite がやっていること
  - dev-server の起動前に
    - npm パッケージを ES Module に変換する
    - npm パッケージを単一の ES Module にバンドルする
- 嬉しいこと
  - ファイル監視・再ビルドするのは、npm パッケージ以外のみ (ここは DLLPlugin と同じ)
  - ES Modules 単位 (自分で書いたモジュールや npm パッケージ毎) にキャッシュを効かせられる

![](/assets/blog/you-will-like-to-use-vite-for-vue-app/vite_prebundle.jpg)

## Vue が今推奨しているのは Vite

- [Vue 3 Tooling Guide](https://vuejs.org/guide/scaling-up/tooling.html) では Vite を推奨している
- [Vue CLI](https://cli.vuejs.org/) は既にメンテナンスモードで Vite を推奨している

## 結論

- out-of-the-box な Vite は
  - はやい (事前バンドルでビルドパフォーマンスアップ！)
  - うまい (no bundle とか HMR の話はしていない…)
  - やすい (内部/公式/コミュニティプラグインで手軽に環境構築！)

ってことで、Vite を使おう！

```
npm create vite@latest my-vue-app -- --template vue-ts
```

## 記事とは全く関係ないけれど、流れで読んだ記事

- https://neos21.net/blog/2020/09/04-02.html#rollup-%E3%81%A8-webpack-%E3%81%AE%E9%81%95%E3%81%84
- https://postd.cc/webpack-and-rollup-the-same-but-different/
- https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c
- https://zenn.dev/mizchi/articles/native-esm-age

## その他余談

- ES Modules において `import * as name from "module-name";` の `module-name` が解釈できるのは相対または絶対パス名のみ
  - https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import#%E6%A7%8B%E6%96%87
- npm package のような path で表現しない module を bare module というらしい
- Vite の Plugin は Rollup の Plugin の superset で、Vite 用の property が少し増えている
  - `@rollup/plugin-*` をそのまま使えたり、使えなかったりする
