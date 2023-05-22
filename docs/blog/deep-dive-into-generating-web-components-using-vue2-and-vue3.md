---
title: "Vue2, Vue3 による Web components の出力について深ぼる"
date: 2021-11-12
description: ""
---

- [例によって UIT INSIDE](https://uit-inside.linecorp.com/episode/104) に向けて、 Vue の Web components ビルドについて色々文書化しておく
- これを書いた時点の Vue3 は v3.2.21

---

## defineCustomElement の概要

### Vue v3.2 で追加された `defineCustomElement`

公式ドキュメント: [Vue and Web Components - defineCustomElement](https://v3.vuejs.org/guide/web-components.html#definecustomelement)

- `defineCustomElement` === VueComponent を HTMLElement で wrap するための関数
  - 正確には...
    - 引数は `defineComponent` が受け取れる引数と[同等のもの](https://github.com/vuejs/vue-next/blob/v3.2.21/packages/runtime-dom/src/apiCustomElement.ts#L127)
    - 戻り値は HTMLElement を継承した [`VueElement`](https://github.com/vuejs/vue-next/blob/v3.2.21/packages/runtime-dom/src/apiCustomElement.ts#L27-L29)
- wrap した`HTMLElement` を [`customElements.define`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) に渡して Web components を定義する

### Vue v2 では `@vue/web-component-wrapper` があった

Repo: [github.com/vuejs/vue-web-component-wrapper](https://github.com/vuejs/vue-web-component-wrapper)

- 使い方は `defineCustomElement` とほぼ同じ
  - VueComponent と Vue Object を渡して、返ってきた `HTMLElement` を `customElements.define` する。

## Web components の作り方

### Vue2 & Vue CLI

- [Vue CLI - Build Targets - Web component](https://cli.vuejs.org/guide/build-targets.html#web-component)
- `$ vue-cli-service build --target wc --name my-element [entry]`

### Vue3 & Vue CLI

- Vue CLI は [v5.0.0-rc 時点で Vue3 の Web components ビルドは非サポート](https://github.com/vuejs/vue-cli/blob/v5.0.0-rc.0/packages/%40vue/cli-service/lib/commands/build/resolveWcConfig.js#L19) なので、Loader の設定をカスタマイズする必要がある

1. Vue Component から HTMLElement を作って、登録する ([公式ドキュメントのママ](https://v3.vuejs.org/guide/web-components.html#sfc-as-custom-element))

   ```js
   import { defineCustomElement } from "vue";
   import Example from "./Example.ce.vue";

   const ExampleElement = defineCustomElement(Example);
   customElements.define("my-example", ExampleElement);
   ```

2. [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements) 、[vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options) の設定

   - vue-plugin, webpack-loader は通常、 style 文字列を `<head>` 内に挿入しますが、Web components の場合は shadow root 内に挿入して欲しいです。
   - そのためのおまじない機能が `defineCustomElement` のリリースに合わせて追加されています。

   ```ts
   // vite.config.ts
   export default defineConfig({
     plugins: [vue({ customElement: true })],
   });
   ```

   - ちなみに、上記 `import Example from "./Example.ce.vue";` の用に ファイル名から対象を選択することも出来ます。

## `defineCustomElement` の実装を見てみる

- [VueElement class](https://github.com/vuejs/vue-next/blob/v3.2.21/packages/runtime-dom/src/apiCustomElement.ts#L149)
  - [Shadow root に VNode を描画](https://github.com/vuejs/vue-next/blob/v3.2.21/packages/runtime-dom/src/apiCustomElement.ts#L312) したり
  - Web components 側の attributes を[監視](https://github.com/vuejs/vue-next/blob/v3.2.21/packages/runtime-dom/src/apiCustomElement.ts#L211) して再描画したり
  - Vue 側の emit を [CustomElement として dispatch](https://github.com/vuejs/vue-next/blob/v3.2.21/packages/runtime-dom/src/apiCustomElement.ts#L343) したり
- [`constructor`](https://github.com/vuejs/vue-next/blob/v3.2.21/packages/runtime-dom/src/apiCustomElement.ts#L160) で
  - `mode: 'open'` で [Element#attachShadow](https://developer.mozilla.org/ja/docs/Web/API/Element/attachShadow)
- [`connectedCallback`](https://github.com/vuejs/vue-next/blob/v3.2.21/packages/runtime-dom/src/apiCustomElement.ts#L179) で
  - MutationObserver で attributes を監視
  - Vue component の props を取得
    - Number なら Number として扱う
  - Vue component の styles を取得
    - style element を作って、ShadowRoot に appendChild
  - `@vue/runtime-core` の renderer に渡して、ShadowRoot に VNode を描画する
  - emit は `dispatchEvent(new CustomEvent())` に変換
- 感想
  - 「Vue の Core API(外部ライブラリじゃない)」らしい実装になっている
  - Vue2 では、[Vue インスタンスを作って](https://github.com/vuejs/vue-web-component-wrapper/blob/master/src/index.js#L86) 、 [shadowRoot に appendChild](https://github.com/vuejs/vue-web-component-wrapper/blob/master/src/index.js#L163) していた。

## 考慮しないといけないポイント

### Vue の props と Web components の attribute の扱い

- Vue は js で props の定義を行うので、この props を読み取って、いい感じに Web components の attribute に変換してくれると思った
- => 違った 😭
  - Number で扱えそうなら(`parseFloat`)、Number に 変換
  - Number で扱えなさそうなら、そのまま
- 困ったこと
  - 構文解析に使っている `parseFloat()` は厳密な解析ではないので...出来る範囲で Number 化してしまう。
    - 先頭文字が数字であれば、とりあえず数字の部分を抜き出して Number
    - 1000-0000-0000 みたいな文字列のクーポンコードも Number として解釈される
- PR で修正したいが...。
  - 対象の vue 内共通モジュールの参照先が多くて、変更が厳しそう...。
  - [fix(shared): Parse string value including a leading number as string value #4946](https://github.com/vuejs/vue-next/pull/4946)

### style の扱い

- 子要素の SFC 内の style もまとめて ShadowRoot に挿入してくれると思った。
- => 違った 😭
  - `defineCustomElement` は wrap する SFC 自身の style のみを読み込んで、ShadowRoot に挿入する
  - wrap する SFC の**子**コンポーネントの style は挿入されない
- 困ったこと
  - 入れ子構造になっている SFC で構成された VueComponent をそのままでは Web components 化出来ない。
- Evan さん的には、子コンポーネントも Web components 化して使って欲しいらしい
  - ref: [#4309](https://github.com/vuejs/vue-next/pull/4309#issuecomment-896886449)
  - Vue から Web components を出力するケースって、対象のコンポーネントが比較的大きい（複数の SFC に分けたい)ものだと思うけれど...。
- PR で修正したいが...。
  - 現状の vue と loader だと、style や依存コンポーネントを取得できないケースがあるので、`defineCustomElement` 内の機能に出来ない...。
  - [feat(runtime-dom): Apply nested component styles when using defineCustomElements #4309](https://github.com/vuejs/vue-next/pull/4309)
