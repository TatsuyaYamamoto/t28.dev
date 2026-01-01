---
title: "@eslint/eslintrc の FlatCompat がどれくらい compat なのか確認する"
date: 2023-05-02
---

[ESLint の設定ファイルの形式が変わった](./eslint-blog-about-flat-config)ことに際して、
ESLint は eslintrc や既存のエコシステムとの互換性を確保するために [@eslint/eslintrc](https://www.npmjs.com/package/@eslint/eslintrc) パッケージを公開しています。
このパッケージ内の `FlatCompat` クラスで eslintrc 形式の設定を flat config 内でも使えるように変換することが出来ます。

```js
// eslint.config.js
const compat = new FlatCompat({});

export default [
  ...compat.extends("standard", "example"),
  ...compat.plugins("airbnb", "react"),
];
```

🤔「`FlatCompat` を通せば、flat config 対応が完了するの？」 と気になったので、

- npm で公開されている shareable config を extend しただけの eslintrc 形式の設定 (★)
- ★ を `FlatCompat` で変換しただけの flat config 形式の設定

それぞれを読み込んだ ESLint の実行結果を比較してみた。

- 実験対象
  - ESLint v8.39.0
  - @eslint/eslintrc v2.0.2

## 比較用準備

eslintrc 形式の設定を書く `.eslintrc.js` を用意して..

```js
// .eslintrc.js
module.exports = {
  /* 何か書く*/
};
```

`.eslintrc.js` の値を `FlatCompat` で変換して flat config 形式で読み込む `eslint.config.js` を用意して...

```js
// eslint.config.js
const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [...compat.extends(require.resolve("./.eslintrc.js"))];
```

リントエラーを発生させるための実装をいくつか用意して...

```bash
$ cat src/js.js
let hoge = "hoge";

$ cat src/tsx.tsx
let hoge = <div>{"hoge"}</div>;
```

シェルスクリプトを用意しました。
[--print-config](https://eslint.org/docs/latest/use/command-line-interface#--print-config) オプションで ESLint が最終的に構築した設定値を出力させて、差分を見ます。

```bash
OUTDIR=dist/eslint-recommended
mkdir -p $OUTDIR
TYPE=js

ESLINT_USE_FLAT_CONFIG=false npx eslint --print-config src/$TYPE.$TYPE | sed -e 's/"error"/2/g' | sed -e 's/"warn"/1/g' | sed -e 's/"off"/0/g' | jq -S > $OUTDIR/$TYPE-rc.config.json
ESLINT_USE_FLAT_CONFIG=true  npx eslint --print-config src/$TYPE.$TYPE                                                                         | jq -S > $OUTDIR/$TYPE-flat.config.json

# 他のファイルタイプも実行する
```

## ESLint only (empty)

```js
// .eslintrc.js
module.exports = {};
```

### js ファイルの比較

```bash
% sdiff -s dist/empty/js-rc.config.json dist/empty/js-flat.config.json
  "env": {},             |   "languageOptions": {
  "globals": {},         |     "ecmaVersion": "latest",
  "ignorePatterns": [],  |     "globals": {},
  "parser": null,        |     "parser": "espree@9.5.1",
  "parserOptions": {},   |     "parserOptions": {},
  "plugins": [],         |     "sourceType": "module"
  "rules": {},           |   },
  "settings": {}         |   "plugins": [
                         >     "@"
                         >   ],
                         >   "rules": {}
```

flat config のみにある `@` plugin は、ESLint が標準で提供しているルールの plugin (ref: [default-config.js#L21](https://github.com/eslint/eslint/blob/v8.39.0/lib/config/default-config.js#L21))。
ESLint 内蔵の rule も 外部 plugin と同じ構造で管理されていて、default valut として設定されている部分に、新しい API として洗練されたことを感じる。

(rule を何も on にしていないので、互換性の比較は出来ない)

## ESLint only (eslint:recommended)

https://eslint.org/docs/latest/use/configure/configuration-files#using-eslintrecommended

```js
// .eslintrc.js
module.exports = { extends: ["eslint:recommended"] };
```

### js ファイルの比較

```bash
% sdiff -ls dist/eslint-recommended/js-rc.config.json dist/eslint-recommended/js-flat.config.json
  "env": {},             |   "languageOptions": {
  "globals": {},         |     "ecmaVersion": "latest",
  "ignorePatterns": [],  |     "globals": {},
  "parser": null,        |     "parser": "espree@9.5.1",
  "parserOptions": {},   |     "parserOptions": {},
  "plugins": [],         |     "sourceType": "module"
                         >   },
                         >   "plugins": [
                         >     "@"
                         >   ],
  },                     |   }
  "settings": {}         <
```

rules プロパティ に diff がない => `eslint:recommended` のルールが同じ用に適用されている => **FlatCompat で変換出来ている**

## TypeScript (@typescript-eslint/eslint-plugin)

https://typescript-eslint.io/linting/configs#recommended

```js
// .eslintrc.js
module.exports = {
  extends: ["plugin:@typescript-eslint/recommended"],
};
```

### js ファイルの比較

```bash
$ sdiff -s dist/typescript-eslint-recommended/js-rc.config.json dist/typescript-eslint-recommended/js-flat.config.json
  "env": {},                                                  |   "languageOptions": {
  "globals": {},                                              |     "ecmaVersion": "latest",
  "ignorePatterns": [],                                       |     "globals": {},
  "parser": "*****/node_modules/@typescript-eslint/parser/dis |     "parser": "typescript-eslint/parser@5.59.1",
  "parserOptions": {                                          |     "parserOptions": {},
                                                              >     "@",
  },                                                          |   }
  "settings": {}                                              <
```

- `@typescript-eslint` plugin が設定されている
- 適用された rule が同じ

=> **FlatCompat で変換出来ている**

### ts ファイルの比較

```bash
$ sdiff -s dist/typescript-eslint-recommended/ts-rc.config.json dist/typescript-eslint-recommended/ts-flat.config.json
  "env": {},                                                  |   "languageOptions": {
  "globals": {},                                              |     "ecmaVersion": "latest",
  "ignorePatterns": [],                                       |     "globals": {},
  "parser": "*****/node_modules/@typescript-eslint/parser/dis |     "parser": "typescript-eslint/parser@5.59.1",
  "parserOptions": {                                          |     "parserOptions": {},
                                                              >     "@",
  },                                                          |   }
  "settings": {}                                              <
```

- `@typescript-eslint` plugin が設定されている
- 適用された rule が同じ

=> **FlatCompat で変換出来ている**

### flat config 同士の js ファイル と ts ファイル の比較

```bash
$ sdiff -s dist/typescript-eslint-recommended/js-flat.config.json dist/typescript-eslint-recommended/ts-flat.config.json
                         >     "constructor-super": [
                         >       0
                         >     ],
(省略)
```

- いくつかのルールを off にする差分が ts ファイル側にある
- [eslint-recommended.ts](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended.ts) 内の overrides による差分

=> **overrides の値も FlatCompat で変換出来ている**

## React (eslint-plugin-react)

```js
// .eslintrc.js
module.exports = { extends: ["plugin:react/recommended"] };
```

### jsx ファイルの比較

```bash
$ sdiff -s dist/eslint-plugin-react-recommended/js-flat.config.json dist/eslint-plugin-react-recommended/js-flat.config.json
# 差分なし (jsファイル・jsx ファイルに適用する設定は同じ)

$ sdiff -s dist/eslint-plugin-react-recommended/jsx-rc.config.json dist/eslint-plugin-react-recommended/jsx-flat.config.json
  "env": {},             |   "languageOptions": {
  "globals": {},         |     "ecmaVersion": "latest",
  "ignorePatterns": [],  |     "globals": {},
  "parser": null,        |     "parser": "espree@9.5.1",
  "parserOptions": {     |     "parserOptions": {
    "ecmaFeatures": {    |       "ecmaFeatures": {
      "jsx": true        |         "jsx": true
    }                    |       }
                         >     },
                         >     "sourceType": "module"
                         >     "@",
  },                     |   }
  "settings": {}         <
```

- `"jsx": true` が設定されている
- 適用された rule が同じ

=> **FlatCompat で変換出来ている**

## Vue (eslint-plugin-vue)

```js
// .eslintrc.js
module.exports = { extends: ["plugin:vue/vue3-recommended"] };
```

`eslint-plugin-vue@9.11.0` の時点では FlatConfig 環境に対応していない？

```bash
$ ESLINT_USE_FLAT_CONFIG=true npx eslint --print-config src/vue.vue

Oops! Something went wrong! :(

ESLint: 8.39.0

Error: Could not serialize parser object (missing 'meta' object).
```

## 結論

- plugin の shareable configs を使う分には FlatCompat で変換出来そう
- 複雑に overrides, extends が組み合わさっているものは...?
