---
title: "GitHub Actions で jq を使って json の input を検証する"
date: 2024-02-20
---

## GitHub Actions の input の制限

GitHub Actions の [Custom actions](https://docs.github.com/ja/actions/creating-actions/about-custom-actions)、[Reusable workflows](https://docs.github.com/ja/actions/using-workflows/reusing-workflows) において、input の型には制限があります。
Custom actions では string のみ [^1] 、Reusable workflow では [`string`、`number`、`boolean` から選びます](https://docs.github.com/ja/actions/using-workflows/workflow-syntax-for-github-actions#onworkflow_callinputsinput_idtype)。

JSON のような複雑な構造を定義出来ないため、input で扱う場合は JSON 文字列として渡すしかないです。
JSON 文字列を [jq](https://jqlang.github.io/jq/) でパースして必要な値を取り出して Action の処理を開始すれば良いだけの話ではありますが、処理の前に入力値検証をしたくなるのは当然ですね？

jq のフィルター結果に従って [`--exit-status`](https://jqlang.github.io/jq/manual/#invoking-jq) でコマンドを失敗させることが出来るので、jq の入力値検証でコケさせる方法を確認しようと思います。

## `string` 型のフィールド

「`string` 型の `name` フィールドを持つ JSON」の配列かどうかを確認します。

```ts
// TypeScript で書くとこんな感じ
type JsonArray = {
  name: string;
}[];
```

[`all(generator; condition)`](https://jqlang.github.io/jq/manual/#all) で配列内の全ての要素が true かどうかを検証します。

要素の期待値は「`name` フィールドが`string` 型」なので、`.[]."name"` でフィールドを取り出して、`type == "string"` かどうかを確認しました。

```bash
JSON_ARRAY1='[
  { "name": "kotori" },
  { "name": "honoka" }
]'

echo $JSON_ARRAY1 | jq --exit-status 'all(.[]."name"; type == "string")'
true # valid
```

```bash
JSON_ARRAY2='[
  { "name": "kotori" },
  { "name": true }
]'

echo $JSON_ARRAY2 | jq --exit-status 'all(.[]."name"; type == "string")'
false # invalid
```

## Optional なフィールド

「optional な `string` 型の `school` フィールドを持つ JSON」の配列かどうかを確認します。

```ts
// TypeScript で書くとこんな感じ
type JsonArray = {
  name: string;
  school?: string;
}[];
```

[`or`](https://jqlang.github.io/jq/manual/#and-or-not) operator で 条件を増やします。
[`has(key)`](https://jqlang.github.io/jq/manual/#has) で `school` フィールドがあるかを確認しつつ、[`not`](https://jqlang.github.io/jq/manual/#and-or-not) operator で結果を反転させます。
つまり「`school` フィールドがない」を確認をする。

```bash
JSON_ARRAY1='[
  { "name": "kotori", "school": "otonoki-zaka" },
  { "name": "alpaca" }
]'

echo $JSON_ARRAY1 | jq --exit-status 'all(.[]; (."school" | type == "string") or (has("school") | not))'
true # valid
```

```bash
JSON_ARRAY2='[
  { "name": "kotori", "school": 1 },
  { "name": "alpaca" }
]'

echo $JSON_ARRAY2 | jq --exit-status 'all(.[]; (."school" | type == "string") or (has("school") | not))'
false # invalid
```

## フィールドの値が重複しない

`.[]."name"` で `name` フィールドの値を取り出してから、再度 `[ ]` で囲って配列にします。

配列に対して、[`length`](https://jqlang.github.io/jq/manual/#length) で取得した要素数と
[`unique`](https://jqlang.github.io/jq/manual/#unique-unique_by) で重複排除した配列の要素数
を比較して、同じ数字なら重複がないことが分かります。

pipe した値が `(length)` と `(unique | length)` 両方に渡るのが、ちょっと不思議な感覚...(pipe に慣れていないだけ?)

```bash
JSON_ARRAY1='[
  { "name": "kotori" },
  { "name": "honoka" }
]'

echo $JSON_ARRAY1 | jq --exit-status '[.[]."name"] | (length) == (unique | length)'
true # valid
```

```bash
JSON_ARRAY2='[
  { "name": "kotori" },
  { "name": "kotori" }
]'

echo $JSON_ARRAY2 | jq --exit-status '[.[]."name"] | (length) == (unique | length)'
false # valid
```

[^1]:
    正確には custom actions では input の型を設定することが出来ないです。
    [環境変数で値の受け渡しを実現している](https://github.com/actions/toolkit/blob/%40actions/core%401.1.0/packages/core/src/core.ts#L74)ので必ず string になっています。
