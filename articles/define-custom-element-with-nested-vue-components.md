---
title: "Vue3.2のdefineCustomElementで子要素のSFCのstyleも含めてWebComponents化する"
date: 2021-08-12
description: "Vue v3.2 で 提供された defineCustomElementの紹介と課題(子要素のSFCのstyleが適用されない)に対する私の解決策を紹介します。"
topics:
  - javascript
  - vue
  - webcomponents
published: true
type: tech
emoji: 👶
---

**何この記事？**

- Vue3.2 で Vue Component を Web Components にする [defineCustomElement](https://v3.ja.vuejs.org/api/global-api.html#definecustomelement) が提供された。
- `<style>`を持つ SFC を子要素以下にもつ SFC を Web Components 化する場合、現行(v3.2.1)の機能では追加で作業が必要。

---

## defineCustomElement

ref. [Vue and Web Components - Building Custom Elements with Vue](https://v3.vuejs.org/guide/web-components.html#building-custom-elements-with-vue)

[Vue v3.2.0 の新機能として defineCustomElement](https://github.com/vuejs/vue-next/blob/master/CHANGELOG.md#custom-elements) が提供されました。
これは Vue component から Web Components (正確には [customElements#define](https://developer.mozilla.org/ja/docs/Web/API/CustomElementRegistry/define) するための CustomElement) を作成するためのメソッドです。

```js
const MyVueElement = defineCustomElement({
  template: `...`,
});
customElements.define("my-vue-element", MyVueElement);
```

`defineCustomElement` は Vue Component 内の lifecycle や props を Web Components の lifecycle や attribute にいい感じで変換した CustomElement を返却してくれます。

## SFC 内の style も Web Components に閉じ込める

ref. [Vue and Web Components - SFC as Custom Element](https://v3.vuejs.org/guide/web-components.html#sfc-as-custom-element)

`<style>` を持つ SFC に対して `defineCustomElement` を使う場合、少し設定が必要です。

通常、SFC を解釈するツール(vue-loader とか @vitejs/plugin-vue)を使うと、 `<style>` 内の CSS を抽出・結合して 1 つの CSS ファイルが作成されます。
SFC から Web Components を作成する場合、この CSS も shadow root に挿入することで style もカプセル化したいと思うのは自然です。

`vue-loader@^16.5.0`、`@vitejs/plugin-vue@^1.4.0` で "custom elements mode" という機能が追加されており、これを使用します。

```js
import Example from "./Example.vue";
console.log(Example.styles); // ['/* css content */']
```

この機能によってインポートされた SFC は`<style>`内の CSS 文字列が styles property に代入されています。
`defineCustomElement` では、引数として渡した SFC が styles property を持っている場合 shadow root に style tag と CSS 文字列を挿入してくれるため、Web Components 化した SFC には style が適用されます。

SFC を custom element mode として解釈させるには、以下のように `.ce.vue` でファイルを作成するか

```js
import Example from "./Example.ce.vue";
```

以下のように boolean, string, RegExp で対象とするコンポーネントを指定します。

```js
export default defineConfig({
  plugins: [
    vue({ customElement: true }),
    // ...
  ],
  // ...
});
```

## Web Components 化する SFC が子要素として SFC を持っている場合

`defineCustomElement` に渡す SFC(RootComponent)の子要素に SFC(ChildComponent)があり、その ChildComponent が style tag を持っている場合、更に対応が必要です。

[現行(v3.2.1)の`defineCustomElement`では RootComponent の style のみ](https://github.com/vuejs/vue-next/blob/v3.2.1/packages/runtime-dom/src/apiCustomElement.ts#L224) を [shadow root に挿入する](https://github.com/vuejs/vue-next/blob/v3.2.1/packages/runtime-dom/src/apiCustomElement.ts#L237) ため、ChildComponent の style は無視されてしまいます。
そのため、

1. RootComponent 配下の SFC を全て取得して
2. style property を持っているかを確認して
3. RootComponent 配下の CSS 文字列を全て取得して
4. 全ての CSS 文字列を`defineCustomElement`に渡す

必要があります。

## 今のところやっていること

上記 1~3 を行うための関数を定義します。

```ts
const getStylesRecursively = (
  component: Component & {
    components?: Record<string, Component>;
    styles?: string[];
  }
): string[] => {
  // root の SFC から最下層の SFC までの style (CSS文字列) を入れる配列
  const customElementStyles: string[] = [];

  // custom elements mode で import された SFC は styles propety を持っている
  if (component.styles) {
    customElementStyles.push(...component.styles);
  }

  // 子要素として使用する SFC は components に登録されている
  const childComponents = component.components;
  if (childComponents) {
    Object.keys(childComponents).forEach((name) => {
      const childComponent = childComponents[name];
      // 子要素の style を取得するために再帰的に getStylesRecursively を呼ぶ
      const styles = this._getStylesRecursively(childComponent);
      customElementStyles.push(...styles);
    });
  }

  return customElementStyles;
};
```

上記 4 は、 「customElementStyles を styles property として持ち、直下に RootComponent のみを描画する VueComponent」を `defineCustomElement` に渡すことで実現します。

```ts
const myCustomElement = defineCustomElement({
  styles: getStylesRecursively(RootComponent),
  render: () => h(RootComponent),
});

customElements.define("my-element", myCustomElement);
```

SFC がより小さい SFC を配下に持たせるのはコンポーネントの設計としては自然だし、オフィシャルでサポートしてくると嬉しいですね...🤔

---

この記事は [t28.dev/define-custom-element-with-nested-vue-components](https://t28.dev/define-custom-element-with-nested-vue-components/) で公開しているものをコピペしたりごにょったりしたものです。
