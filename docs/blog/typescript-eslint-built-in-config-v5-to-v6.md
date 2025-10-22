---
title: "typescript-eslint v6 で built-in configurations の構造が変わったので、ルールの対応表を作って眺める"
date: 2024-01-03
---

## typescript-eslint v6

### QOL を上げる v6

TypeScript に対して ESLint を実行出来るようにする typescript-eslint の [v6 がリリースされました](https://typescript-eslint.io/blog/announcing-typescript-eslint-v6/) [^1]。
v6 には生活の質を上げる機能が備わっている([本当に書いてある](https://typescript-eslint.io/blog/announcing-typescript-eslint-v6/#using-v6))ようなので、 私の QOL も爆上げしようと思います。

Major update ということで [Breaking change がある](https://typescript-eslint.io/blog/announcing-typescript-eslint-v6/#user-facing-breaking-changes)のですが、注目ポイントは `@typescript-eslint/eslint-plugin` の built-in configurations [^2] の構造が変わった点です。
built-in configurations とは typescript-eslint がおすすめするルール(やパーサーの設定)を持った [ESLint shareable configurations](https://eslint.org/docs/latest/developer-guide/shareable-configs) のことです。

### v5 の built-in configurations の構造と課題

v5 では `recommended` (おすすめルール) をベースに、`recommended-requiring-type-checking` (型情報が必要なルール) 、`strict` (もっと厳しいルール)を必要に応じて追加で extends することで、ESLint の設定がいい感じに出来るというものでした。

```js
module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
  ],
};
```

v5 の構造に対して、typescript-eslint は以下のような課題を認識しています。

1. `strict` 内に 型チェックが必要/不要なルールが混在している
2. 文体のベストプラクティスのルールとバグを見つけるルールが混在している

### v6 の built-in configurations の構造

そのため、v6 では `1.` を解決するために以下のような built-in configurations を提供するようになりました。

- [`recommended`](https://typescript-eslint.io/linting/configs/#recommended): バッドプラクティスやバグの可能性を報告するための、おすすめルールを含む設定
- [`strict`](https://typescript-eslint.io/linting/configs/#strict): `recommended` に加えて、さらに厳しいルールを含む設定
- [`stylistic`](https://typescript-eslint.io/linting/configs/#stylistic): ロジックに影響を与えない (つまり文体の指摘のみ) 、モダンな TypeScript のコードにするルールを含む設定

さらに、`2.` を解決するために型情報が必要なルールを含む設定は　`*-type-checked` という suffix の built-in configurations で提供するようになりました。

- [`recommended-type-checked`](https://typescript-eslint.io/linting/configs/#recommended-type-checked)
- [`strict-type-checked`](https://typescript-eslint.io/linting/configs/#strict-type-checked)
- [`stylistic-type-checked`](https://typescript-eslint.io/linting/configs/#stylistic-type-checked)

この新しい built-in configurations の構造によって、typescript-eslint ユーザーは以下のような設定を行うことになります。

```js
// 🥰型安全なルールをコミュニティのおすすめで設定したいな〜
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
};
```

```js
// 🥳型情報を使わない範囲で、厳しくリントする！
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/strict"],
};
```

## [本題] v5-v6 の built-in configurations のルールの差分が知りたい

「コミュニティのおすすめに乗っかるぜ！」勢としては、v5-v6 間で built-in configurations が設定するルールに変更があったということで、

**具体的にどのルールがどの built-in configurations で定義されるようになったの？**

という気持ちになります[^3] 。例えば、以下の 2 つは同等の設定なの？多分違うよね？...って感じの探究心。

```js
// v5
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  // 略
};
```

```js
// v6
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  // 略
};
```

## v5 基準で比較する

v5 の built-in configurations 内のルールが、v6 の built-in configurations のどこで定義されているかを調べてみる。

<details>
<summary>表の見方</summary>

- ✅:◯ のとき、ルールは v6 の `recommended` に含まれている
- ✅💭:◯ のとき、ルールは v6 の `recommended-type-checked` に含まれている
- 🔒:◯ のとき、ルールは v6 の `strict` に含まれている
- 🔒💭:◯ のとき、ルールは v6 の `strict-type-checked` に含まれている
- 🎨:◯ のとき、ルールは v6 の `stylistic` に含まれている
- 🎨💭:◯ のとき、ルールは v6 の `stylistic-type-checked` に含まれている

</details>

### `recommended`

v5 の `recommended` のルールを持つ "v6 の built-in configurations" を確認する表

| v5 rule                                                  | ✅  | ✅💭 | 🔒  | 🔒💭 | 🎨  | 🎨💭 |
| -------------------------------------------------------- | --- | ---- | --- | ---- | --- | ---- |
| `@typescript-eslint/adjacent-overload-signatures`        | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/ban-ts-comment`                      | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/ban-types`                           | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `no-array-constructor`                                   | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-array-constructor`                | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `no-empty-function`                                      | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/no-empty-function`                   | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/no-empty-interface`                  | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/no-explicit-any`                     | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-extra-non-null-assertion`         | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `no-extra-semi`                                          | -   | -    | -   | -    | -   | -    |
| `@typescript-eslint/no-extra-semi`                       | -   | -    | -   | -    | -   | -    |
| `@typescript-eslint/no-inferrable-types`                 | -   | -    | -   | -    | ◯   | ◯    |
| `no-loss-of-precision`                                   | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-loss-of-precision`                | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-misused-new`                      | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-namespace`                        | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-non-null-asserted-optional-chain` | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-non-null-assertion`               | -   | -    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-this-alias`                       | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-unnecessary-type-constraint`      | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `no-unused-vars`                                         | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-unused-vars`                      | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-var-requires`                     | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/prefer-as-const`                     | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/prefer-namespace-keyword`            | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/triple-slash-reference`              | ◯   | ◯    | ◯   | ◯    | -   | -    |

- 基本的には...
  - v5 の `recommended` なルールを 「v6 の `recommended`、または `stylistic` どちらかに振り分けた」って感じ
- それ以外
  - [@typescript-eslint/no-non-null-assertion](https://typescript-eslint.io/rules/no-non-null-assertion/) は strict 扱いに変わっている
  - [@typescript-eslint/no-extra-semi](https://eslint.org/docs/latest/rules/no-extra-semi) は、[v8.53.0 で deprecated](https://eslint.org/docs/latest/rules/no-extra-semi) になったので、built-in config でも扱われなくなっている
- ちなみに
  - `strict` の列も ◯ になっているのは v6 の strict(-type-checked) は v6 の recommended(-type-checked) が扱うルールを含む方針だから
    - 参考:
      - https://typescript-eslint.io/linting/configs/#strict
      - https://github.com/typescript-eslint/typescript-eslint/discussions/6019

### `recommended-requiring-type-checking`

v5 の `recommended-requiring-type-checking` のルールを持つ "v6 の built-in configurations" を確認する表

| v5 rule                                            | ✅  | ✅💭 | 🔒  | 🔒💭 | 🎨  | 🎨💭 |
| -------------------------------------------------- | --- | ---- | --- | ---- | --- | ---- |
| `@typescript-eslint/await-thenable`                | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-floating-promises`          | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-for-in-array`               | -   | ◯    | -   | ◯    | -   | -    |
| `no-implied-eval`                                  | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-implied-eval`               | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-misused-promises`           | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-unnecessary-type-assertion` | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-unsafe-argument`            | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-unsafe-assignment`          | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-unsafe-call`                | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-unsafe-member-access`       | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-unsafe-return`              | -   | ◯    | -   | ◯    | -   | -    |
| `require-await`                                    | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/require-await`                 | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/restrict-plus-operands`        | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/restrict-template-expressions` | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/unbound-method`                | -   | ◯    | -   | ◯    | -   | -    |

- 全てのルールが v6 の`recommended-type-checked`、`strict-type-checked` で扱われている

### `strict`

v5 の `strict` のルールを持つ "v6 の built-in configurations" を確認する表

| v5 rule                                                      | ✅  | ✅💭 | 🔒  | 🔒💭 | 🎨  | 🎨💭 |
| ------------------------------------------------------------ | --- | ---- | --- | ---- | --- | ---- |
| `@typescript-eslint/array-type`                              | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/ban-tslint-comment`                      | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/class-literal-property-style`            | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/consistent-generic-constructors`         | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/consistent-indexed-object-style`         | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/consistent-type-assertions`              | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/consistent-type-definitions`             | -   | -    | -   | -    | ◯   | ◯    |
| `dot-notation`                                               | -   | -    | -   | -    | -   | ◯    |
| `@typescript-eslint/dot-notation`                            | -   | -    | -   | -    | -   | ◯    |
| `@typescript-eslint/no-base-to-string`                       | -   | ◯    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-confusing-non-null-assertion`         | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/no-duplicate-enum-values`                | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-dynamic-delete`                       | -   | -    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-extraneous-class`                     | -   | -    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-invalid-void-type`                    | -   | -    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-meaningless-void-operator`            | -   | -    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-mixed-enums`                          | -   | -    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-non-null-asserted-nullish-coalescing` | -   | -    | ◯   | ◯    | -   | -    |
| `no-throw-literal`                                           | -   | -    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-throw-literal`                        | -   | -    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-unnecessary-boolean-literal-compare`  | -   | -    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-unnecessary-condition`                | -   | -    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-unnecessary-type-arguments`           | -   | -    | -   | ◯    | -   | -    |
| `@typescript-eslint/no-unsafe-declaration-merging`           | ◯   | ◯    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-unsafe-enum-comparison`               | -   | ◯    | -   | ◯    | -   | -    |
| `no-useless-constructor`                                     | -   | -    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/no-useless-constructor`                  | -   | -    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/non-nullable-type-assertion-style`       | -   | -    | -   | -    | -   | ◯    |
| `@typescript-eslint/prefer-for-of`                           | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/prefer-function-type`                    | -   | -    | -   | -    | ◯   | ◯    |
| `@typescript-eslint/prefer-includes`                         | -   | -    | -   | ◯    | -   | -    |
| `@typescript-eslint/prefer-literal-enum-member`              | -   | -    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/prefer-nullish-coalescing`               | -   | -    | -   | -    | -   | ◯    |
| `@typescript-eslint/prefer-optional-chain`                   | -   | -    | -   | -    | -   | ◯    |
| `@typescript-eslint/prefer-reduce-type-parameter`            | -   | -    | -   | ◯    | -   | -    |
| `@typescript-eslint/prefer-return-this-type`                 | -   | -    | -   | ◯    | -   | -    |
| `@typescript-eslint/prefer-string-starts-ends-with`          | -   | -    | -   | -    | -   | ◯    |
| `@typescript-eslint/prefer-ts-expect-error`                  | -   | -    | ◯   | ◯    | -   | -    |
| `@typescript-eslint/unified-signatures`                      | -   | -    | ◯   | ◯    | -   | -    |

- 基本的には...
  - v5 の `strict` なルールを 「v6 の `strict`、または `stylistic` どちらかに振り分けた」って感じ
  - v5 の `strict` は型情報が要る/要らないルールがごちゃまぜだったけれど、v6 では `strict`、`stirct-type-checked` に整理されている
- それ以外
  - v6 で `recommended` 扱いに変わったルール
    - [@typescript-eslint/no-base-to-string](https://typescript-eslint.io/rules/no-base-to-string/)
    - [@typescript-eslint/no-duplicate-enum-values](https://typescript-eslint.io/rules/no-duplicate-enum-values/)
    - [@typescript-eslint/no-unsafe-declaration-merging](https://typescript-eslint.io/rules/no-unsafe-declaration-merging/)
    - [@typescript-eslint/no-unsafe-enum-comparison](https://typescript-eslint.io/rules/no-unsafe-enum-comparison/)

## v6 基準で比較する

<details>
<summary>表の見方</summary>

- in type-checked: 💭 のとき、ルールは \*-type-checked にも含まれている
- ✅ 　: ◯ のとき、ルールは v5 の `recommended` に含まれている
- ✅💭: ◯ のとき、ルールは v5 の `recommended-requiring-type-checking` に含まれている
- 🔒 　: ◯ のとき、ルールは v5 の `strict` に含まれている

</details>

### `recommended` / `recommended-type-checked`

v6 の `recommended` のルールを持つ "v5 の built-in configurations" を確認する表

| v6 rule                                                  | in type-checked | ✅  | ✅💭 | 🔒  |
| -------------------------------------------------------- | --------------- | --- | ---- | --- |
| `@typescript-eslint/await-thenable`                      | 💭              | -   | ◯    | -   |
| `@typescript-eslint/ban-ts-comment`                      |                 | ◯   | -    | -   |
| `@typescript-eslint/ban-types`                           |                 | ◯   | -    | -   |
| `no-array-constructor`                                   |                 | ◯   | -    | -   |
| `@typescript-eslint/no-array-constructor`                |                 | ◯   | -    | -   |
| `@typescript-eslint/no-base-to-string`                   | 💭              | -   | -    | ◯   |
| `@typescript-eslint/no-duplicate-enum-values`            |                 | -   | -    | ◯   |
| `@typescript-eslint/no-duplicate-type-constituents`      | 💭              | -   | -    | -   |
| `@typescript-eslint/no-explicit-any`                     |                 | ◯   | -    | -   |
| `@typescript-eslint/no-extra-non-null-assertion`         |                 | ◯   | -    | -   |
| `@typescript-eslint/no-floating-promises`                | 💭              | -   | ◯    | -   |
| `@typescript-eslint/no-for-in-array`                     | 💭              | -   | ◯    | -   |
| `no-implied-eval`                                        | 💭              | -   | ◯    | -   |
| `@typescript-eslint/no-implied-eval`                     | 💭              | -   | ◯    | -   |
| `no-loss-of-precision`                                   |                 | ◯   | -    | -   |
| `@typescript-eslint/no-loss-of-precision`                |                 | ◯   | -    | -   |
| `@typescript-eslint/no-misused-new`                      |                 | ◯   | -    | -   |
| `@typescript-eslint/no-misused-promises`                 | 💭              | -   | ◯    | -   |
| `@typescript-eslint/no-namespace`                        |                 | ◯   | -    | -   |
| `@typescript-eslint/no-non-null-asserted-optional-chain` |                 | ◯   | -    | -   |
| `@typescript-eslint/no-redundant-type-constituents`      | 💭              | -   | -    | -   |
| `@typescript-eslint/no-this-alias`                       |                 | ◯   | -    | -   |
| `@typescript-eslint/no-unnecessary-type-assertion`       | 💭              | -   | ◯    | -   |
| `@typescript-eslint/no-unnecessary-type-constraint`      |                 | ◯   | -    | -   |
| `@typescript-eslint/no-unsafe-argument`                  | 💭              | -   | ◯    | -   |
| `@typescript-eslint/no-unsafe-assignment`                | 💭              | -   | ◯    | -   |
| `@typescript-eslint/no-unsafe-call`                      | 💭              | -   | ◯    | -   |
| `@typescript-eslint/no-unsafe-declaration-merging`       |                 | -   | -    | ◯   |
| `@typescript-eslint/no-unsafe-enum-comparison`           | 💭              | -   | -    | ◯   |
| `@typescript-eslint/no-unsafe-member-access`             | 💭              | -   | ◯    | -   |
| `@typescript-eslint/no-unsafe-return`                    | 💭              | -   | ◯    | -   |
| `no-unused-vars`                                         |                 | ◯   | -    | -   |
| `@typescript-eslint/no-unused-vars`                      |                 | ◯   | -    | -   |
| `@typescript-eslint/no-var-requires`                     |                 | ◯   | -    | -   |
| `@typescript-eslint/prefer-as-const`                     |                 | ◯   | -    | -   |
| `require-await`                                          | 💭              | -   | ◯    | -   |
| `@typescript-eslint/require-await`                       | 💭              | -   | ◯    | -   |
| `@typescript-eslint/restrict-plus-operands`              | 💭              | -   | ◯    | -   |
| `@typescript-eslint/restrict-template-expressions`       | 💭              | -   | ◯    | -   |
| `@typescript-eslint/triple-slash-reference`              |                 | ◯   | -    | -   |
| `@typescript-eslint/unbound-method`                      | 💭              | -   | ◯    | -   |

- 基本的には...
  - v5 の `recommended` なルールは v6 では `recommended` で扱っている
  - v5 の `recommended-requiring-type-checking` なルールは v6 では `recommended-type-checked` で扱っている
- それ以外
  - v5 では `strict` 扱いだったけれど、v6 では `recommended(-type-chcecked)` に変わったルール
    - [@typescript-eslint/no-base-to-string](https://typescript-eslint.io/rules/no-base-to-string/)
    - [@typescript-eslint/no-duplicate-enum-values](https://typescript-eslint.io/rules/no-duplicate-enum-values/)
    - [@typescript-eslint/no-unsafe-declaration-merging](https://typescript-eslint.io/rules/no-unsafe-declaration-merging/)
    - [@typescript-eslint/no-unsafe-enum-comparison](https://typescript-eslint.io/rules/no-unsafe-enum-comparison/)

### `strict` / `strict-type-ckecked`

v6 の `strict` または `strict-type-ckecked` のルールを持つ "v5 の built-in configurations" を確認する表

| v6 rule                                                      | type-checked only | ✅  | ✅💭 | 🔒  |
| ------------------------------------------------------------ | ----------------- | --- | ---- | --- |
| `@typescript-eslint/no-confusing-void-expression`            | 💭                | -   | -    | -   |
| `@typescript-eslint/no-dynamic-delete`                       |                   | -   | -    | ◯   |
| `@typescript-eslint/no-extraneous-class`                     |                   | -   | -    | ◯   |
| `@typescript-eslint/no-invalid-void-type`                    |                   | -   | -    | ◯   |
| `@typescript-eslint/no-meaningless-void-operator`            | 💭                | -   | -    | ◯   |
| `@typescript-eslint/no-mixed-enums`                          | 💭                | -   | -    | ◯   |
| `@typescript-eslint/no-non-null-asserted-nullish-coalescing` |                   | -   | -    | ◯   |
| `@typescript-eslint/no-non-null-assertion`                   |                   | ◯   | -    | -   |
| `no-throw-literal`                                           | 💭                | -   | -    | ◯   |
| `@typescript-eslint/no-throw-literal`                        | 💭                | -   | -    | ◯   |
| `@typescript-eslint/no-unnecessary-boolean-literal-compare`  | 💭                | -   | -    | ◯   |
| `@typescript-eslint/no-unnecessary-condition`                | 💭                | -   | -    | ◯   |
| `@typescript-eslint/no-unnecessary-type-arguments`           | 💭                | -   | -    | ◯   |
| `no-useless-constructor`                                     |                   | -   | -    | ◯   |
| `@typescript-eslint/no-useless-constructor`                  |                   | -   | -    | ◯   |
| `@typescript-eslint/prefer-includes`                         | 💭                | -   | -    | ◯   |
| `@typescript-eslint/prefer-literal-enum-member`              |                   | -   | -    | ◯   |
| `@typescript-eslint/prefer-reduce-type-parameter`            | 💭                | -   | -    | ◯   |
| `@typescript-eslint/prefer-return-this-type`                 | 💭                | -   | -    | ◯   |
| `@typescript-eslint/prefer-ts-expect-error`                  |                   | -   | -    | ◯   |
| `@typescript-eslint/unified-signatures`                      |                   | -   | -    | ◯   |

NOTE: [strict(-type-checked) は recommended(-type-checked) が扱うルールも含む](https://typescript-eslint.io/linting/configs/#strict) ので、重複するルールは省略している

- 基本的には...
  - v5 の `strict` なルールは v6 では `strict`/`strict-type-checked` いずれかで扱っている
- それ以外
  - v6 で 新しく `strict` で扱い始めたルール
    - [@typescript-eslint/no-confusing-void-expression](https://typescript-eslint.io/rules/no-confusing-void-expression/)
  - v5 で `strict` 扱いだったけれど、v6 では `recommened` 扱いになったルール
    - [@typescript-eslint/no-non-null-assertion](https://typescript-eslint.io/rules/no-non-null-assertion/)

### `stylistic`/`stylistic-type-checked`

v6 の `stylistic` または `stylistic-type-checked` のルールを持つ "v5 の built-in configurations" を確認する表

| v6 rule                                                | in type-checked | ✅  | ✅💭 | 🔒  |
| ------------------------------------------------------ | --------------- | --- | ---- | --- |
| `@typescript-eslint/adjacent-overload-signatures`      |                 | ◯   | -    | -   |
| `@typescript-eslint/array-type`                        |                 | -   | -    | ◯   |
| `@typescript-eslint/ban-tslint-comment`                |                 | -   | -    | ◯   |
| `@typescript-eslint/class-literal-property-style`      |                 | -   | -    | ◯   |
| `@typescript-eslint/consistent-generic-constructors`   |                 | -   | -    | ◯   |
| `@typescript-eslint/consistent-indexed-object-style`   |                 | -   | -    | ◯   |
| `@typescript-eslint/consistent-type-assertions`        |                 | -   | -    | ◯   |
| `@typescript-eslint/consistent-type-definitions`       |                 | -   | -    | ◯   |
| `dot-notation`                                         | 💭              | -   | -    | ◯   |
| `@typescript-eslint/dot-notation`                      | 💭              | -   | -    | ◯   |
| `@typescript-eslint/no-confusing-non-null-assertion`   |                 | -   | -    | ◯   |
| `no-empty-function`                                    |                 | ◯   | -    | -   |
| `@typescript-eslint/no-empty-function`                 |                 | ◯   | -    | -   |
| `@typescript-eslint/no-empty-interface`                |                 | ◯   | -    | -   |
| `@typescript-eslint/no-inferrable-types`               |                 | ◯   | -    | -   |
| `@typescript-eslint/non-nullable-type-assertion-style` | 💭              | -   | -    | ◯   |
| `@typescript-eslint/prefer-for-of`                     |                 | -   | -    | ◯   |
| `@typescript-eslint/prefer-function-type`              |                 | -   | -    | ◯   |
| `@typescript-eslint/prefer-namespace-keyword`          |                 | ◯   | -    | -   |
| `@typescript-eslint/prefer-nullish-coalescing`         | 💭              | -   | -    | ◯   |
| `@typescript-eslint/prefer-optional-chain`             | 💭              | -   | -    | ◯   |
| `@typescript-eslint/prefer-string-starts-ends-with`    | 💭              | -   | -    | ◯   |

- v5 では `strict` 扱いだったルールが v6 では `stylistic` になっているものがある

## recommended 同士の比較

typescript-eslint の recommended な設定を以下と**勝手に決めた上で**、どんな違いがあるか見てみる。

- v5
  - `plugin:@typescript-eslint/recommended`
  - `plugin:@typescript-eslint/recommended-requiring-type-checking`
- v6
  - `plugin:@typescript-eslint/recommended-type-checked`
  - `plugin:@typescript-eslint/stylistic-type-checked`

<details>
<summary>表の見方</summary>

- v5: ◯ のとき、ルールは v5 の `recommended` または `recommended-requiring-type-checking` に含まれている
- v6: ◯ のとき、ルールは v6 の `recommended-type-checked` または `stylistic-type-checked` に含まれている

</details>

| rule                                                   | v5  | v6  |
| ------------------------------------------------------ | --- | --- |
| `no-extra-semi`                                        | ◯   | -   |
| `@typescript-eslint/no-extra-semi`                     | ◯   | -   |
| `@typescript-eslint/no-non-null-assertion`             | ◯   | -   |
| `@typescript-eslint/no-base-to-string`                 | -   | ◯   |
| `@typescript-eslint/no-duplicate-enum-values`          | -   | ◯   |
| `@typescript-eslint/no-duplicate-type-constituents`    | -   | ◯   |
| `@typescript-eslint/no-redundant-type-constituents`    | -   | ◯   |
| `@typescript-eslint/no-unsafe-declaration-merging`     | -   | ◯   |
| `@typescript-eslint/no-unsafe-enum-comparison`         | -   | ◯   |
| `@typescript-eslint/array-type`                        | -   | ◯   |
| `@typescript-eslint/ban-tslint-comment`                | -   | ◯   |
| `@typescript-eslint/class-literal-property-style`      | -   | ◯   |
| `@typescript-eslint/consistent-generic-constructors`   | -   | ◯   |
| `@typescript-eslint/consistent-indexed-object-style`   | -   | ◯   |
| `@typescript-eslint/consistent-type-assertions`        | -   | ◯   |
| `@typescript-eslint/consistent-type-definitions`       | -   | ◯   |
| `dot-notation`                                         | -   | ◯   |
| `@typescript-eslint/dot-notation`                      | -   | ◯   |
| `@typescript-eslint/no-confusing-non-null-assertion`   | -   | ◯   |
| `@typescript-eslint/non-nullable-type-assertion-style` | -   | ◯   |
| `@typescript-eslint/prefer-for-of`                     | -   | ◯   |
| `@typescript-eslint/prefer-function-type`              | -   | ◯   |
| `@typescript-eslint/prefer-nullish-coalescing`         | -   | ◯   |
| `@typescript-eslint/prefer-optional-chain`             | -   | ◯   |
| `@typescript-eslint/prefer-string-starts-ends-with`    | -   | ◯   |

NOTE: v5, v6 両方に含まれているルールは除外している

- v5 で `strict` だったルールが stylistic に移っている分、v6 の方がルールが多くなっている

## まとめ・所感

- typed linting の観点では、`-type-checked` suffix の有無で整理されただけなので、v5-v6 間で気にすることはあまりなさそう
- ルールのジャンル分け (`recommneded`/`strict`/`stylistic`) の観点では、v5 の`strict` が `stylistic` に移行されている分、`stylistic` を `recommended` のノリで設定すると厳しすぎ...ってなりそう (がんばろう)

## 表を作るためのスクリプト

https://gist.github.com/TatsuyaYamamoto/ff128ca667348ead4295e548ffe586cb

[^1]: さも最近出た感じの文体だけれど、[Announcing typescript-eslint v6](https://typescript-eslint.io/blog/announcing-typescript-eslint-v6/) は 2023/07/09 (半年くらい前) のポスト...。

[^2]: "typescript-eslint が提供している設定ファイル" の表記ゆれが激しい...。`configurations`, `built-in configurations`, `provided user configuration files`...。 個人的には `configurations` だと意味が広すぎる気がする。

[^3]: 本当の意味で「コミュニティのおすすめに乗っかるぜ！」勢は、四の五の言わずにアップデートして新しいリントエラーを直すのだろうけれど...。
