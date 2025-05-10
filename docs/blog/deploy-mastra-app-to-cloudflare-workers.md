---
title: "Mastra アプリを Cloudflare Workers にデプロイする"
date: 2025-05-09
---

[Fairy (AI エージェント) を作るメモまとめ](./ai-agent-fairy-making) > **Mastra アプリを Cloudflare Workers にデプロイする**

---

[`npx create-mastra@latest` で local で動く Mastra アプリは秒で作れた](https://mastra.ai/ja/docs/getting-started/installation) ので、これを Cloudflare Workers にデプロイしてインターネットからアクセス出来るようにする。

```ts
// こんな感じの mastra を Cloudflare Workers にデプロイしたいってわけ
export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { fairy, weatherAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
});
```

具体的な作業内容は https://github.com/TatsuyaYamamoto/sicaco-quarter-third-street/pull/1 で見られる。

## Mastra のバージョン

Mastra のバージョンはまだ `0.x` なので、Breaking change が激しい...かもしれない。

- `npx create-mastra@latest` した時点で `mastra@0.6.0`
- 記事書いている時点で `mastra@0.6.2`

例えば、[2025/3/21 の記事では `mastra deploy` が紹介されている](https://dev.classmethod.jp/articles/mastra-cloudflare/#%25E3%2583%2587%25E3%2583%2597%25E3%2583%25AD%25E3%2582%25A4%25E8%25A8%25AD%25E5%25AE%259A%25E3%2581%25A8%25E5%25AE%259F%25E8%25A1%258C:~:text=%E4%BB%A5%E4%B8%8B%E3%81%AE%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%88%E3%82%99%E3%81%A6%E3%82%99%E3%83%86%E3%82%99%E3%83%95%E3%82%9A%E3%83%AD%E3%82%A4%E3%82%92%E5%AE%9F%E8%A1%8C%E3%81%97%E3%81%BE%E3%81%99%E3%80%82)が、
[v0.4.9 で deprecate されている](https://github.com/mastra-ai/mastra/blob/mastra%400.4.9/packages/cli/src/index.ts#L187)。

## `mastra build`

https://mastra.ai/ja/reference/cli/build

`mastra build` を実行すると、Mastra の機能を Web API のエンドポイント経由で公開するための、HTTP Server の実装が出力される。
この HTTP Server に [Hono が使われている](https://mastra.ai/ja/docs/deployment/server#:~:text=mastra%E3%81%AFhono%20%E3%82%92%E5%9F%BA%E7%9B%A4%E3%81%A8%E3%81%AA%E3%82%8Bhttp%E3%82%B5%E3%83%BC%E3%83%8F%E3%82%99%E3%83%BC%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E3%83%AF%E3%83%BC%E3%82%AF%E3%81%A8%E3%81%97%E3%81%A6%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E3%81%84%E3%81%BE%E3%81%99%E3%80%82)。

```shell
$ tree -L 1 .mastra/output
.mastra/output
├── index.mjs           # 👈️ mastra を呼び出す WebAPI を定義した Hono 製の HTTP Server がある
├── index2.mjs
├── instrumentation.mjs
├── mastra.mjs          # 👈️ この辺に `const mastra = new Mastra({})` がある
├── node_modules
├── package.json
├── pnpm-lock.yaml
├── telemetry-config.mjs
├── tools
└── tools.mjs
```

これを Cloudflare Workers で動かしたい。

## Deployer

https://mastra.ai/ja/docs/deployment/deployment

Mastra には deployer という仕組みがあって、デプロイする環境に合わせて「いい感じのコード」を出力してくれる仕組みがある。
Cloudflare なら `@mastra/deployer-cloudflare` を使う。
使い方は `Mastra` で deployer を指定して `mastra build` を実行するだけ。

```ts
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";

export const mastra = new Mastra({
  // ...
  deployer: new CloudflareDeployer({
    scope: "***",
    projectName: "sicaco-3rd",
    auth: {
      apiToken: "***",
    },
  }),
});
```

`CloudflareDeployer` の引数に従った `wrangler.json` が `.mastra/output/` に出力される。
ただし困ったことに [CloudflareDeployer のオプション](https://mastra.ai/ja/reference/cli/build) は [`wrangler.json` の仕様](https://developers.cloudflare.com/workers/wrangler/configuration/)(お作法？)に従っておらず[^1]、しかも追加の設定をするためにはビルド成果物を改造するスクリプトを自分で書く必要がある...。

```json
// wrangler.json
{
  "compatibility_date": "2025-04-01",
  "compatibility_flags": [
    "nodejs_compat",
    "nodejs_compat_populate_process_env"
  ],
  "name": "sicaco-3rd",
  "main": "./index.mjs",
  "vars": {}
}
```

`.mastra/output/index.mjs` には [`fetch()` ハンドラー](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/) が入る。
これによって Worker へのHTTPリクエストが Hono -> Mastra へと渡される。

```js
// index.mjs
var _virtual__entry = {
  fetch: async (request, env, context) => {
    const app = await createHonoServer(mastra);
    return app.fetch(request, env, context);
  },
};
```

**いい感じと言ったな？それは嘘だ。**

嘘です。`CloudflareDeployer` 使えばすぐに Workers にデプロイ出来るかというと、出来ない。ローカル実行 (`wrangler dev`) も出来ない。
`mastra@0.6.0` の時点では 👇️ のようなスクリプトでビルド成果物を改造 (?!) する必要がある。~~というか `deployer-cloudflare` を作っている人、 Cloudflare 使ってないでしょ。~~

https://github.com/TatsuyaYamamoto/sicaco-quarter-third-street/blob/38b89fa6b0d3f37e50d08ba1f2a0fea280b8402e/scripts/postbuild.js

## `wrangler` でデプロイする

[Mastra のドキュメント](https://mastra.ai/ja/reference/deployer/cloudflare) に従って、以下の流れで Mastra アプリを Workers にデプロイする。~~Mastra の **Deployer** を使っているのに、デプロイは `wrangler` を使うのモヤるな。~~

> - CLIをインストール: `npm install -g wrangler`
> - 出力ディレクトリに移動: `cd .mastra/output`
> - Cloudflareアカウントにログイン: `wrangler login`
> - プレビュー環境にデプロイ: `wrangler deploy`
> - 本番環境へのデプロイ: `wrangler deploy --env production` [^2]

## Middleware

Workers にデプロイ出来た [^3] はいいけどこのままだと Mastra アプリがインターネットに丸出しになってしまので、認証機能を簡単に付けたい。
Cloudflare らしく作るなら [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) を使うのでしょうが、Mastra の middleware を使って簡易的に実装する。

https://mastra.ai/ja/docs/deployment/middleware

[Mastra は内部で Hono を使って HTTP サーバーを実行している](https://mastra.ai/ja/docs/deployment/server#:~:text=mastra%E3%81%AFhono%20%E3%82%92%E5%9F%BA%E7%9B%A4%E3%81%A8%E3%81%AA%E3%82%8Bhttp%E3%82%B5%E3%83%BC%E3%83%8F%E3%82%99%E3%83%BC%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E3%83%AF%E3%83%BC%E3%82%AF%E3%81%A8%E3%81%97%E3%81%A6%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E3%81%84%E3%81%BE%E3%81%99%E3%80%82)ので、
[Hono のドキュメント](https://hono.dev/docs/guides/middleware)に従って middleware を作る。

```ts
/**
 * Check authorization header, when `/api/*` is called
 */
export const authMiddleware: Middleware = {
  path: "/api/*",
  handler: async (c, next): Promise<Response | void> => {
    const authorizationHeader = c.req.header("Authorization");
    const [prefix, token] = authorizationHeader?.split(" ") ?? [];

    // 👇️ トークンがあれば OK
    if (prefix === "Bearer" && token && token === TOKEN) {
      await next();
      return;
    }

    // 👇️ トークンがなければ、401
    return c.json({ message: "Unauthorized" }, { status: 401 });
  },
};
```

```ts
export const mastra = new Mastra({
  // ...
  server: {
    middleware: [authMiddleware],
  },
});
```

## その他

1. deployer `"***"` を指定しているのはブログ用に情報をぼかしているのではなく、その設定で良いから。これらの値が[参照されるのは `CloudflareDeployer#deploy()`](https://github.com/mastra-ai/mastra/blob/mastra%400.6.2/deployers/cloudflare/src/index.ts#L173C9-L173C15) だけれど Workers へデプロイするまでに使わることがない...。
2. この記事時点では `LibSQLStore` をコメントアウトしている。`npx create-mastra@latest` では `":memory:"`を指定しいるが、これは Workers 環境では`URL_SCHEME_NOT_SUPPORTED` エラーになる。 [Cloudflare Workers KV](https://mastra.ai/ja/reference/storage/cloudflare) を使うことになりそうだけれど、あとあと！

[^1]: 例えば `dotenv` で読み込んだ環境変数は [secret としてではなく vars として扱ったり](https://developers.cloudflare.com/workers/configuration/environment-variables/#compare-secrets-and-environment-variables)、[`env`](https://mastra.ai/ja/reference/deployer/cloudflare#%E3%83%91%E3%83%A9%E3%83%A1%E3%83%BC%E3%82%BF) を指定しても、[Environments](https://developers.cloudflare.com/workers/wrangler/environments/) ではなく [`vars`](https://developers.cloudflare.com/workers/wrangler/configuration/#non-inheritable-keys) として扱う。

[^2]: `--env` を使ってプレビュー・本番環境を切り替えるかどうかは Worker をどのように管理するかの問題なので、 Mastra アプリとしては関係がない。

[^3]: `wrangler deploy` だけじゃなくて、Worker の設定 (Worker 自体を作ったり環境変数設定したり) も必要だけれど、省略でいいよね。
