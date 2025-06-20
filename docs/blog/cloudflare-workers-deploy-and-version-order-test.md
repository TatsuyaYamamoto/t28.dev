---
title: "Cloudflare Workers の deployment と version の実行順と反映結果の実験メモ"
date: 2025-06-19
---

Cloudflare Workers ではコードと環境変数の[アップロード方法が 2 つある](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/):

1. version
   - アップロードするけど、現在のトラフィックに影響を与えない
   - `https://hash-worker-name.user-name.workers.dev` でアクセスできる
2. deployment
   - アップロードして、現在のトラフィックに即時反映させる
   - `https://worker-name.user-name.workers.dev` で**も**アクセスできる

コードと環境変数は CLI、Dashboard、[VS Code for Web](https://blog.cloudflare.com/improved-quick-edit/) など複数の方法で独立して操作できるけれど、それぞれの変更がどこで混ざるのか気になったので実験した。

## 結論

コード・環境変数を deploy すると、save version 済みのコード・環境変数も共連れでデプロイされる (そりゃそうだ)

## 実験内容

### 1. Editor で編集したコードを deploy した

`e1e14cbf-c394-478e-8563-96c784047f7c`

環境変数を JSON で返すだけの worker を作った。

```ts
export default {
  async fetch(request, env, ctx) {
    return Response.json({
      version: "just after 633235c1",
      a: env.a,
      b: env.b,
      c: env.c,
      d: env.d,
      e: env.e,
    });
  },
};
```

```json
// https://worker-name.user-name.workers.dev/
{
  "version": "just after 633235c1"
}
```

### 2. Environment Variables を deploy した

`91dbe242-af17-488f-9603-8189f5dd1af4`

```dotenv
a=a-1
```

```json
// https://worker-name.user-name.workers.dev/
{
  "version": "just after 633235c1",
  "a": "a-1"
}
```

deploy したので、環境変数 `a` が JSON で返ってくる。

### 3. Editor で編集したコードを save version した

`0c20725c-69c0-4525-ab97-c8c0953ae03e`

```ts
export default {
  async fetch(request, env, ctx) {
    return Response.json({
      version: "just after 91dbe242", // 👈️ ここを更新した
      a: env.a,
      b: env.b,
      c: env.c,
      d: env.d,
      e: env.e,
    });
  },
};
```

```json
// https://worker-name.user-name.workers.dev/
{
  "version": "just after 633235c1",
  "a": "a-1"
}
```

save version なので、hash なし URL では `"version": "just after 633235c1"` のまま。

```json
// https://0c20725c-worker-name.user-name.workers.dev/
{
  "version": "just after 91dbe242",
  "a": "a-1"
}
```

hash 付き URL では新しく (`"version": "just after 91dbe242"`) なっている。

### 4. Environment Variables を save version した

74dee72c-ed8a-4fed-ae64-41c132a7b04e

```dotenv
a=a-2
b=b-1
```

```json
// https://worker-name.user-name.workers.dev/
{
  "version": "just after 633235c1",
  "a": "a-1"
}
```

save version なので、hash なし URL では環境変数が `91dbe242` のときと同じ。

```json
// https://74dee72c-worker-name.user-name.workers.dev/
{
  "version": "just after 91dbe242",
  "a": "a-2",
  "b": "b-1"
}
```

hash 付き URL では新しい環境変数が見られる。

### 5. Editor で編集したコードを deploy した

`8bcf72c5-a6a9-4340-b997-ac250520fb9a`

```ts
export default {
  async fetch(request, env, ctx) {
    return Response.json({
      version: "just after 74dee72c",
      a: env.a,
      b: env.b,
      c: env.c,
      d: env.d,
      e: env.e,
    });
  },
};
```

```json
// https://worker-name.user-name.workers.dev/
{
  "version": "just after 74dee72c",
  "a": "a-2",
  "b": "b-1"
}
```

deploy したので、

- deploy した `8bcf72c5` 時点のコード
- save version した `74dee72c` 時点の環境変数

が反映されている。

### 6. Editor で編集したコードを save version した

`0c1aa8d4-1260-4154-b38c-eb4acf2a4847`

```ts
export default {
  async fetch(request, env, ctx) {
    return Response.json({
      version: "just after 8bcf72c5",
      a: env.a,
      b: env.b,
      c: env.c,
      d: env.d,
      e: env.e,
    });
  },
};
```

```json
// https://worker-name.user-name.workers.dev/
{
  "version": "just after 74dee72c",
  "a": "a-2",
  "b": "b-1"
}
```

```json
// https://0c1aa8d4-worker-name.user-name.workers.dev/
{
  "version": "just after 8bcf72c5",
  "a": "a-2",
  "b": "b-1"
}
```

### 7. Environment Variables を deploy した

`a52b0a1a-37d3-4d8d-a37f-2189912422e8`

```dotenv
a=a-3
b=b-2
c=c-1
```

```json
// https://worker-name.user-name.workers.dev/
{
  "version": "just after 8bcf72c5",
  "a": "a-3",
  "b": "b-2",
  "c": "c-1"
}
```

deploy したので、

- save version した `0c1aa8d4` 時点のコード
- deploy した `a52b0a1a` 時点の環境変数

が反映されている。
