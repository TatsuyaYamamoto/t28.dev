---
title: "[Tips] Vue.js(v3)内でWebComponentsを使うための設定"
date: 2021-03-06
description: "Vue.js 内で web componentsを使おうとしたときに発生したwarnを解消するためのTips"
---

```bash
# 当時の環境
% npm ls vue vue-loader --depth=1
hoge
├─┬ @vue/cli-service@4.5.11
│ └── vue-loader@15.9.6
├─┬ @vue/compiler-sfc@3.0.5
│ └── vue@3.0.5
```

SFC(Vue3)内で Web Components を

```vue
<template>
  <hoge-web-component></hoge-web-component>
</template>
```

という感じで使おうとすると、

```
[Vue warn]: Failed to resolve component: hoge-web-component
```

と warn が出ます。 Vue のコンポーネントとして定義・import していないので、そりゃそうですね...。

[web components [Vue warn]: Failed to resolve component: xy-button" #1221](https://github.com/vuejs/vue-next/issues/1221) で回答されている通り、
`isCustomElement` を使えばいいわけですが、issues 上の方法のままでは解消出来なかったです。

## 公式ドキュメントを見る

[Global API - config.ignoredElements Is Now config.isCustomElement](https://v3.vuejs.org/guide/migration/global-api.html#config-ignoredelements-is-now-config-iscustomelement) によると、
Vue3 ではコンポーネントのチェックをコンパイル時に行うので、使用する Web Components をコンパイラーに教える必要があります。

issues 上の`app.config.isCustomElement`は、コンパイラーも内蔵した vue のビルド成果物を使用するとき用の API です。
そのため、テンプレートを事前にコンパイルしている(ランタイムのみの vue ビルド成果物を使用している)場合は vue-cli に内蔵している vue-loader に [chainWebpack](https://cli.vuejs.org/guide/webpack.html#chaining-advanced) で option を追加して、Web Components を教えます。

## webpack の設定を上書きする

`npx vue inspect --rule vue` で現状を確認して、 標準出力されている通り、`config.module.rule('vue').use('vue-loader')`で上書きします。

```js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => ({
        ...options,
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("hoge-"),
        },
      }));
  },
};
```

これで prefix が `hoge-`な Web Components は vue コンパイラーのお目通しのうえ、[custom elements(Web Components)](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_custom_elements) として使用できるようになりました。

やったぜ 💪
