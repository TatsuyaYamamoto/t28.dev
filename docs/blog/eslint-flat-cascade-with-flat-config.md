---
title: "Flat config を書いて、ESLint の flat cascade のふるまいを実験してみる"
date: "2023-05-01"
---

[ESLint の設定ファイルの形式が変わった](./eslint-blog-about-flat-config) ので、 flat config で書いた flat cascade が実際どのようにふるまうか実験してみる。

## ドキュメントをさら〜っと読む

### Configuration File

ref: https://eslint.org/docs/latest/use/configure/configuration-files-new#configuration-file

- `eslint.config.js` という設定ファイルをプロジェクトの root に置く
- 構成オブジェクトの配列を export する

```js
export default [
  {
    rules: { semi: "error" },
  },
];
```

### Configuration Objects

ref: [Configuration Objects](https://eslint.org/docs/latest/use/configure/configuration-files-new#configuration-objects)

- 構成オブジェクトはいくつかのプロパティで構成されている (雑に省略)
- `files` と `ignores`　の組み合わせで構成オブジェクトを適用する/しないを制御する ([ref](https://eslint.org/docs/latest/use/configure/configuration-files-new#configuration-file))
  - `files`
    - 構成オブジェクトを適用するファイルを指定する glob 配列
    - 指定していない場合、他の構成オブジェクトで一致した全てのファイルに対して構成オブジェクトを適用する
  - `ignores`
    - 構成オブジェクトを適用しないファイルを指定する glob の配列
    - 指定していない場合、 `files` で一致した全てのファイルに構成オブジェクトを適用する
- `plugin` でルールを追加するには自分で import した object を渡す ([ref](https://eslint.org/docs/latest/use/configure/configuration-files-new#using-plugins-in-your-configuration))
- `rules` の書き方は変わっていない(多分) ([ref](https://eslint.org/docs/latest/use/configure/configuration-files-new#configuring-rules))

ドキュメントに明示的に書かれていない大きな変更点としては... (ref: [拙著](./eslint-blog-about-flat-config))

- `extends`, `override` が無くなって、構成オブジェクトの組み合わせで表現するようになった
- `plugins` に "react" (文字列) を渡しても ESLint 側で `eslint-plugin-react` を解決してくれなくなった

## `files`, `ignores` によるカスケードの振る舞いを実験する

参考: [Specifying files and ignores](https://eslint.org/docs/latest/use/configure/configuration-files-new#specifying-files-and-ignores)

### 準備

いくつかのファイルを用意して、`eslint.config.js` によるファイル毎のリントエラーの様子を確認する。

```bash
$ tree src
src
├── cjs.cjs
├── js.js
├── jsx.jsx
├── mjs.mjs
├── ts-with-type.ts
├── ts.ts
└── txt.txt

$ cat src/js.js
let hoge = "hoge";

$ cat src/jsx.jsx
let hoge = <div>{"hoge"}</div>;
```

(設定次第で)期待するエラーは:

- [prefer-const](https://eslint.org/docs/latest/rules/prefer-const)
- [semi](https://eslint.org/docs/latest/rules/semi)
- [quotes](https://eslint.org/docs/latest/rules/quotes)

### なにも設定しない (デフォルトのみ)

空の設定で、`eslint` を実行してみる。

```js
// eslint.config.js
export default [];
```

```bash
$ npx eslint src
# 標準出力なし
```

ルールを何も ON にしていないので、`eslint` を実行しても正常終了するだけ。

[`--print-config`](https://eslint.org/docs/latest/use/command-line-interface#--print-config) で実際に使われる設定を確認してみる。

```bash
$ npx eslint --print-config src/js.js
{
  "languageOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "parser": "espree@9.5.1",
    "parserOptions": {},
    "globals": {}
  },
  "plugins": [
    "@"
  ],
  "rules": {}
}
```

js ファイルに対しては デフォルトの languageOptions, plugins, rules (空) が設定されている。plugins の `@` は ESLint が提供しているルールを読み込んでいる (ref: [v8.39.0 - default-config.js#L21](https://github.com/eslint/eslint/blob/v8.39.0/lib/config/default-config.js#L21))

```bash
$ npx eslint --print-config src/cjs.cjs
{
  "languageOptions": {
    "ecmaVersion": "latest",
    "sourceType": "commonjs",
    "parser": "espree@9.5.1",
    "parserOptions": {},
    "globals": {}
  },
  "plugins": [
    "@"
  ],
  "rules": {}
}
```

cjs ファイルに対しては、cjs 向けの デフォルトで上書きされている。 ([v8.39.0 - default-config.js#L60-L66](https://github.com/eslint/eslint/blob/v8.39.0/lib/config/default-config.js#L60-L66))

```bash
$ npx eslint src/jsx.jsx

*****/src/jsx.jsx
  0:0  warning  File ignored because of a matching ignore pattern. Use "--no-ignore" to override

```

jsx ファイルに対しては、`matching ignore pattern` というよりは デフォルトのどの `files` パターンにも一致しないので、ES Lint を実行出来ない。

### `files` なしでルールを追加する

```js
// eslint.config.js
export default [{ rules: { quotes: ["error", "single"] } }];
```

```bash
$ npx eslint src

*****/src/cjs.cjs
  1:1  error  Strings must use singlequote  quotes

*****/src/js.js
  1:1  error  Strings must use singlequote  quotes

*****/src/mjs.mjs
  1:1  error  Strings must use singlequote  quotes
```

js, cjs, mjs ファイルでリントエラーが発生した。
デフォルトで `**/*.js`, `**/*.mjs` ([default-config.js#L58](https://github.com/eslint/eslint/blob/v8.39.0/lib/config/default-config.js#L58)) `**/*.cjs` ([default-config.js#L58](https://github.com/eslint/eslint/blob/v8.39.0/lib/config/default-config.js#L58)) を指定しているので、
`files` なしの `quotes` がこれらの範囲で適用されている。

### 一部のファイルに対してルールを追加する

```js
// eslint.config.js
export default [
  // 👇
  { files: ["**/*.mjs"], rules: { "prefer-const": ["error"] } },
  { rules: { quotes: ["error", "single"] } },
];
```

```bash
$ npx eslint src

*****/src/cjs.cjs
  1:12  error  Strings must use singlequote  quotes

*****/src/js.js
  1:12  error  Strings must use singlequote  quotes

*****/src/mjs.mjs
  1:5   error  'hoge' is never reassigned. Use 'const' instead  prefer-const
  👇
  1:12  error  Strings must use singlequote                     quotes
```

mjs ファイルに対してのみリントエラーが増えている。

### デフォルトで指定していないファイルを files でリント対象にする

デフォルトでは指定されていない `**/*.jsx` を構成オブジェクトで指定する。

```js
export default [
  {
    // 👇 jsx も lint する
    files: ["**/*.jsx"],
    // jsx 構文を ESLint が理解できるようにする
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
  },
  { rules: { quotes: ["error", "single"] } },
];
```

```bash
$ npx eslint src

*****/src/cjs.cjs
  1:12  error  Strings must use singlequote  quotes

*****/src/js.js
  1:12  error  Strings must use singlequote  quotes

👇
*****/src/jsx.jsx
  1:18  error  Strings must use singlequote  quotes

*****/src/mjs.mjs
  1:12  error  Strings must use singlequote  quotes
```

jsx ファイルにも js ファイルと同じリントエラーが発生した。
`files: ["**/*.jsx"]` によって、js, cjs, mjs ファイルに加えて jsx ファイルにも `files` なしの `quotes` が適用されている。

`**/*.jsx` に対して `semi` を適用する。

```js
export default [
  {
    files: ["**/*.jsx"],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    // 👇 jsx にのみ semi ルールを追加する
    rules: { semi: ["error", "never"] },
  },
  { rules: { quotes: ["error", "single"] } },
];
```

```bash
$ npx eslint src

*****/src/cjs.cjs
  1:12  error  Strings must use singlequote  quotes

*****/src/js.js
  1:12  error  Strings must use singlequote  quotes

*****/src/jsx.jsx
  1:18  error  Strings must use singlequote  quotes
  👇
  1:31  error  Extra semicolon               semi
```

jsx ファイルのみに `semi` リントエラーが追加された。

ちなみに、構成オブジェクトの順番を変えても、適用範囲の振る舞いは変わらない。
「範囲を広げる (今回だと `**/*.jsx`) 構成オブジェクトは配列の先頭寄りに置かないと、後続の設定が適用されない」みたいなことはないようだ。

```js
export default [
  // 👇 `files: ["**/*.jsx"]` より先に宣言しても、 quotes のリントは jsx にも走る
  { rules: { quotes: ["error", "single"] } },
  {
    files: ["**/*.jsx"],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    rules: { semi: ["error", "never"] },
  },
];
```

### `ignores` のみの構成オブジェクトを追加する

ref: [Globally ignoring files with ignores](https://eslint.org/docs/latest/use/configure/configuration-files-new#globally-ignoring-files-with-ignores)

`{ ignores: ["**/*.cjs"] }` (`ignore` のみの構成オブジェクト) を追加する。

```js
export default [
  { rules: { quotes: ["error", "single"] } },
  // 👇
  { ignores: ["**/*.cjs"] },
];
```

```bash
$ npx eslint src

*****/src/js.js
  1:12  error  Strings must use singlequote  quotes

*****/src/mjs.mjs
  1:12  error  Strings must use singlequote  quotes
```

cjs ファイルでリントエラーが出なくなる。

自分で `files: ["**/*.cjs"]` を指定した構成オブジェクトを追加したとしても、`{ ignores: ["**/*.cjs"] }` によってリントエラーは出ない。

```js
export default [
  { rules: { quotes: ["error", "single"] } },
  // 👇 cjs に対して有効なルールがあっても
  { files: ["**/*.cjs"], rules: { semi: ["error", "never"] } },
  // 👇 この設定で無視される
  { ignores: ["**/*.cjs"] },
];
```

```bash
$ npx eslint src

*****/src/js.js
  1:12  error  Strings must use singlequote  quotes

*****/src/mjs.mjs
  1:12  error  Strings must use singlequote  quotes
```

### 一部のルールのみを無視させる

cjs ファイル以外に semi ルールを適用したい...という意図で以下のような設定を書いても期待通りに動かない。

```js
export default [
  { rules: { quotes: ["error", "single"] } },
  // 👇 cjs 以外に semi ルールを付ける...とは、ならない！
  { ignores: ["**/*.cjs"], rules: { semi: ["error", "never"] } },
];
```

```bash
$ npx eslint src

*****/src/cjs.cjs
  1:12  error  Strings must use singlequote  quotes
  1:18  error  Extra semicolon               semi

*****/src/js.js
  1:12  error  Strings must use singlequote  quotes
  1:18  error  Extra semicolon               semi

*****/src/mjs.mjs
  1:12  error  Strings must use singlequote  quotes
  1:18  error  Extra semicolon               semi
```

明示的に 「全てのファイル(`**/*`) semi を適用するが、cjs は無視する」構成オブジェクトを書く必要があるようだ。

```js
export default [
  { rules: { quotes: ["error", "single"] } },
  // 👇
  {
    files: ["**/*"],
    ignores: ["**/cjs.cjs"],
    rules: { semi: ["error", "never"] },
  },
];
```

```bash
$ npx eslint src

*****/src/cjs.cjs
  1:12  error  Strings must use singlequote  quotes

*****/src/js.js
  1:12  error  Strings must use singlequote  quotes
  1:18  error  Extra semicolon               semi

*****/src/mjs.mjs
  1:12  error  Strings must use singlequote  quotes
  1:18  error  Extra semicolon               semi
```

> This configuration object applies to all files except those ending with .config.js. Effectively, this is like having files set to \*_/_. In general, it’s a good idea to always include files if you are specifying ignores.
> ref: https://eslint.org/docs/latest/use/configure/configuration-files-new#excluding-files-with-ignores

ドキュメントを読んだ感じだと、このふるまいはバグな気もする...。

### 設定を競合させる

ref: [Cascading configuration objects](https://eslint.org/docs/latest/use/configure/configuration-files-new#cascading-configuration-objects)

設定値が競合している複数の構成オブジェクトを作る。

```js
export default [
  { rules: { quotes: 0, semi: 0, "prefer-const": 0 } },
  { rules: { semi: 1 } },
  { rules: { quotes: 2 } },
];
```

```bash
 $ npx eslint --print-config src/js.js | jq ".rules"
{
  "quotes": [
    2
  ],
  "semi": [
    1
  ],
  "prefer-const": [
    0
  ]
}
```

後に宣言した構成オブジェクトの値を優先されている (`quotes: 0` が `quotes: 2` に、`semi: 0` が `semi: 1` に上書きされている)。

競合させるルールを一部のファイルのみにする。

```js
export default [
  { rules: { quotes: 0, semi: 0, "prefer-const": 0 } },
  // 👇
  { files: ["**/*.cjs"], rules: { semi: 1 } },
  { rules: { quotes: 2 } },
];
```

```bash
$ npx eslint --print-config src/js.js | jq ".rules"
{
  "quotes": [
    2
  ],
  "semi": [
    0 👈
  ],
  "prefer-const": [
    0
  ]
}

$ npx eslint --print-config src/cjs.cjs | jq ".rules"
{
  "quotes": [
    2
  ],
  "semi": [
    1 👈
  ],
  "prefer-const": [
    0
  ]
}
```

js ファイルは上書きされず (`semi: 0` のまま)、 cjs ファイルのみが上書き(`{ semi: 1 }`) されている。
