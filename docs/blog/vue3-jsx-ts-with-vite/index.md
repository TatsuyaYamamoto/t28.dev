---
title: 'vite で Vue3 + "JSX" + TypeScript のビルド環境 を構築する'
date: 2021-06-10
description: 'vite で "Vue3 + "JSX" + TypeScript のビルド環境を構築するための極小メモ記事'
---

## 背景

- [vite](https://github.com/vitejs/vite) を使って
- Vue3 + JSX + TypeScript で
  - vue ファイル内で
  - `<script lang="tsx">` って書いて
  - `setup(){ return ()=> <></> }` する
- ビルド (`npx vite`) したいんだけれど、

[vite/create-app](https://github.com/vitejs/vite/tree/main/packages/create-app) に jsx 用のテンプレートがない 😭

## やること

### ボイラープレート持ってきて

```shell
npm init @vitejs/app my-vue-app -- --template vue-ts
```

### プラグインいれる

[@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite/blob/main/packages/plugin-vue-jsx/README.md)

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(), // <= を "追加" する
  ],
});
```

個人的ちょっと[readme](https://github.com/vitejs/vite/blob/main/packages/plugin-vue-jsx/README.md) が不親切かなと思うのが、`plugin-vue-jsx`のみを plugin に入れると、vue ファイルは扱えない環境になる(おそらく、jsx ファイルのみが扱える)。
script tag で `defineComponent`、style tag で css を書くなら、`plugin-vue` と `plugin-vue-jsx` を**併用する**。

vue 界隈では普通なのかな...。vue-jsx って名前だし、まぁそうかも、、、。

### JSX かく

- lang を tsx にして
- `setup()`の戻り値に JSX を書く
- 画像ファイルのパスを src からの相対パスにする(SFC のときは vue ファイルからの相対パス)

```vue
<script lang="tsx">
// 略
export default defineComponent({
  // 略
  setup() {
    return () => (
      <>
        <img alt="Vue logo" src="src/assets/logo.png" />
        <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
      </>
    );
  },
});
</script>

<style>
/* 略 */
</style>
```

- `@click` は onClick で中身に関数を書く
- ref の値 (`count`) は、JSX 内では `count.value` で参照・更新をする

```vue
<script lang="tsx">
/* 略 */
export default defineComponent({
  /* 略 */
  setup(props) {
    const count = ref(0);
    return () => (
      <>
        // 略
        <button type="button" onClick={() => count.value++}>
          count is: {count.value}
        </button>
        // 略
      </>
    );
  },
});
</script>

<style scoped>
/* 略 */
</style>
```

---

これで 快適 vue vite ライフ！😊
