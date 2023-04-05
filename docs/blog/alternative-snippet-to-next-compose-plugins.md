---
title: "next-compose-plugins の代替スニペット"
date: "2022-11-28"
---

## 先に結論

(私の Next.js のプロジェクトに限っては) こんな感じの next.config.js を定義して、plugin を読み込む

```js
const getNextConfig = (phase) => {
  /** @type {import('next').NextConfig} */
  return {
    reactStrictMode: true,
  };
};

/**
 * @see https://t28.dev/blog/alternative-snippet-to-next-compose-plugins
 * @see https://github.com/cyrilwanner/next-compose-plugins/issues/59#issuecomment-1192523231
 */
export default (phase) => {
  const nextConfig = getNextConfig(phase);
  const plugins = [withFugaPlugin, withChunPlugin];
  return plugins.reduce((acc, plugin) => plugin(acc), { ...nextConfig });
};
```

## 以降、細かい話

### NextPlugin

Next.js の プラグインについて明確な定義はない(はず)ですが、ここ([next-mdx](https://github.com/vercel/next.js/blob/canary/packages/next-mdx/index.d.ts))とかここ([next-bundle-analyzer](https://github.com/vercel/next.js/blob/canary/packages/next-bundle-analyzer/index.d.ts))を見る限り、
NextPlugin は NextConfig (`{import("next").NextConfig}`) を受け取って、いい感じに値を書き換えた新しい NextConfig を返す関数のことと言えそうです。

この NextPlugin は NextConfig をラップする関数なので、プラグインの数が増えるにつれて、またそのプラグインに渡すオプションが増えるにつれて、ネスト等で辛い見た目になっていきます...。

```js
const finalNextConfig = withHogePlugin(
  withFugaPlugin(
    withChunPlugin(
      withUyuPlugin({
        /* user's next.config.js values */
      })
    )
  )
);
```

### next-compose-plugins

そんな NextPlugin の記述のソリューションとして [next-compose-plugins](https://github.com/cyrilwanner/next-compose-plugins) が Next.js の定番 (私調べ)となっていますが、
Next.js v12.2.0 (?) で warning が発生することが報告されています([next-compose-plugins#59](https://github.com/cyrilwanner/next-compose-plugins/issues/59))。

原因は (多分) NextConfig が JSONSchema と ajv で検証されるようになった結果([config-schema.ts](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/config-schema.ts))、next-compose-plugins の処理の過程で追加されたプロパティがその検証でエラーを発生させているのだと思います。

### 代替案を使う

- next-compose-plugins がメンテナンスされていない
- やって欲しいことは「関数 (NextPlugin) を順番に実行する」だけ

以上のことから、Issue comment ([next-compose-plugins#59#issuecomment-1192523231](https://github.com/cyrilwanner/next-compose-plugins/issues/59#issuecomment-1192523231)) を参考に自分で関数を用意して使うことにしました。

=> `先に結論` へ

`先に結論` から戻る =>

next-compose-plugin にはいろいろな機能がありますが、その一部 (★ のところ) だけを実現する関数ならシンプルですね。

- next-compose-plugins
  - NextPlugin を受け取る (★)
  - NextPlugin に引数を渡す (★)
  - 高度な phase の制御
  - その他色々....!!
