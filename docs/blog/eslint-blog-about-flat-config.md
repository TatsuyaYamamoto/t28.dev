---
title: "ESLint の FlatConfig についての Blog を読んだ"
date: 2023-04-28
---

## ESLint の設定ファイルの形式が変わった

- ESLint [v8.21.0](https://github.com/eslint/eslint/releases/tag/v8.21.0) ([#16149](https://github.com/eslint/eslint/pull/16149)) で `FlatESLint` が実装された
  - [FlatESLint](https://github.com/eslint/eslint/blob/main/lib/eslint/flat-eslint.js) は新しい `Primary Node.js API` を表現するクラスで、このクラスが設定ファイルを "flat config" として扱う
- ESLint [v8.23.0](https://github.com/eslint/eslint/releases/tag/v8.23.0) ([#16235](https://github.com/eslint/eslint/pull/16235)) で CLI が `eslint.config.js` を探すようになった
  - 2023/04/26 の時点で latest version が v8.39.0 なので、もう、使える 🔥
- 古い書き方は v9 で非推奨になる ([ref](https://github.com/eslint/eslint/blob/v8.39.0/docs/src/use/configure/configuration-files.md))

## Blog を読んでみる

"flat config" 関する ESLint のブログがあったので、メモを残しておく。

- [Part 1: Background](https://eslint.org/blog/2022/08/new-config-system-part-1/)
- [Part 2: Introduction to flat config](https://eslint.org/blog/2022/08/new-config-system-part-2/)
- [Part 3: Developer preview](https://eslint.org/blog/2022/08/new-config-system-part-3/) (... は、開発者向けの情報なので、飛ばしちゃう)

## Part 1: 背景

ref: [Part 1: Background](https://eslint.org/blog/2022/08/new-config-system-part-1/)

- ESLint が初めてリリースされた当初はシンプルだった
  - .eslintrc ファイルでルールの有効/無効を制御する
  - 特定のディレクトリのルールを簡単に上書きする (コンフィグカスケード)
    - リント対象のファイルと同じディレクトリにある.eslintrc ファイルを探す
    - 次にディレクトリ階層を上がってルートに到達するまで、途中で見つかったすべての.eslintrc ファイルから設定をマージする
- 現状の構成システムは複雑
- 簡単にするための新しい構成システムを提案した

> 現状の構成システムは複雑

分かる...。 "extends" とか "overrides" とか "overrides 内の extends" とか "extends 先の overrides" とか...最終的なリントの振る舞いの把握が難しい...。

### Incremental changes leading to maximum complexity

`incremental approach` によって改善を進めた (ため、複雑になってしまった)

1. `extends` key で別の設定をインポート出来るようにした
1. 自動的に個人の設定ファイル(`~/.eslintrc`)を探すようにした
1. `.eslintrc` に加えて、複数のファイル形式(`.eslintrc.json`, `.eslintrc.yml`, `.eslintrc.yaml`, `.eslintrc.js`）もサポートした
1. Shareable configs and dependencies
   - ちゃんと読み取れなかったけれど、ESLint 内部で行っている依存関係の解決 (`plugins: ["react"]` みたいに文字列で入力したもの？) と npm の peerDeps 周りの問題かな...?
1. 把握しきれないコンフィグカスケードによる設定の上書き対策のために、`root` key を追加した
1. glob ベースで設定を上書きするために `overrides` key を追加した
1. `overrides` 内で `extends` key を使えるようにした

> 複数のファイル形式

「どの形式で設定ファイルを書いても、設定値は js object に変換して ESLint のコア実装の引数になるから、設定ファイルの形式とコア実装に依存関係はない」と**勝手に想像**していたけれど、現実は複雑だったみたいだ...。

> glob ベースで設定を上書きするために `overrides` key を追加した

今まであまり深く考えていなかったため、「複数の `.eslintrc` によるカスケード」と「`overrides` によるカスケード」が混在したリポジトリを作っていたことを思い出した。
そして、ちゃんと期待通りルール設定になっているかが自信無くなってきた...。
それぞれに対応する ESLint のモチベーションが同じならば、せめて、どちらかに統一して使用するべきだったな...。

### The need for simplification

- 最終的な設定値の計算方法を把握出来なくなってきた
- 1 年半 の RFC 提案 (eslintrc 捨てる/捨てないを含めた議論) の末に、新しい構成システムに着手した

> 1 年半 の RFC 提案

Flat Config の実装を追跡する GitHub Issues ([eslint/eslint#13481](https://github.com/eslint/eslint/issues/13481)) や、
Flat Config の議論 ([eslint/rfcs#9](https://github.com/eslint/rfcs/pull/9)) を覗くと、巨大な OSS のリアルな苦労を目の当たりにすることが出来て良い。

## Part 2: flat config 入門

ref: [Part 2: Introduction to flat config](https://eslint.org/blog/2022/08/new-config-system-part-2/)

### flat config が実現する目標

1. 理にかなったデフォルト値
1. 単一の設定方法
1. ESLint の rule に変更を加えない
1. JavaScript ネイティブの読み込み機能を活用する
1. トップレベルのプロパティを整理する
1. 既存の plugin を動作させる
1. 互換性を可能な限り確保する

### Setting logical defaults for linting

> 1 理にかなったデフォルト値

- ESLint が作られた当初の前提
  - ECMAScript 5 が JavaScript の最新バージョン
  - ほとんどのファイルは `script` か `commonjs`
  - ecmaVersion で ECMAScript 6 をオプトイン出来るようにした
- 2022 年の状況
  - ECMAScript は常に更新されてる
  - ESM はスタンダードなモジュール形式として使われている
- flat config のデフォルト値
  - ecmaVersion: "latest" (実装: [default-config.js#L42](https://github.com/eslint/eslint/blob/v8.39.0/lib/config/default-config.js#L42))
  - sourceType: "module" (`*.js`, `*.mjs`) (実装: [default-config.js#L41](https://github.com/eslint/eslint/blob/v8.39.0/lib/config/default-config.js#L41)))
  - sourceType: "commonjs" (`*.cjs`) (実装: [default-config.js#L63](https://github.com/eslint/eslint/blob/v8.39.0/lib/config/default-config.js#L63))
  - "flat config" は .js, .mjs, .cjs ファイルを検索する (実装: [default-config.js#L58](https://github.com/eslint/eslint/blob/v8.39.0/lib/config/default-config.js#L58), [default-config.js#L61](https://github.com/eslint/eslint/blob/v8.39.0/lib/config/default-config.js#L61))

### The new config file: `eslint.config.js`

> 2 単一の設定方法
> 4 JavaScript ネイティブの読み込み機能を活用する

- eslintrc の設定方法
  - 複数の場所に複数の設定ファイルを書く
  - 複数のファイル形式 (json, js, yaml) で設定を書く
  - package.json に設定を書く
- flat config の設定方法
  - プロジェクトの全ての設定を eslint.config.js に書く
- ESLint の CLI は 1 つの eslint.config.js のみを検索するので、必要なディスクアクセスが減った
- js ファイルを使用することで、JavaScript の機能で情報を読み込むことが出来るようになった (文字列を入力して追加リソースを読み込む機能を ESLint から消せた)

### Glob-based configs everywhere

> 2 単一の設定方法

- ファイルシステムに寄るカスケードを削除して、glob による設定の上書きを採用した
- 各構成オブジェクト内の `files`, `ignores` key に glob を書いて、適用するファイルを指定する

### Goodbye extends, hello flat cascade

> 2 単一の設定方法

- eslint.config.js ファイル内にカスケードの仕組みがある
- 配列の先頭から末尾に向かって、構成オブジェクトをマージする

### Reimagined language options

> 5 トップレベルのプロパティを整理する

- JavaScript の評価に関連するすべてのキーを、`languageOptions` という top-level key に移動した
  - `ecmaVersion`
    - 構文とグローバル変数を有効にする
    - eslintrc では parserOptions として ecmaVersion を指定していた
  - `sourceType`
    - 構文とスコープ構造の評価方法を切り替える
  - `env` (を削除した)
    - 環境毎に設定していた機能は `sourceType` で実現できるようになった
  - `globals`
    - `env` が持っていた残りの機能 (グローバル変数の設定) を `globals` で持つ
    - ESLint が持っていた環境情報を [globals](https://github.com/sindresorhus/globals) パッケージに抽出した
    - flat config では globals パッケージを直接使用して、グローバル変数を管理する
- `parser`, `parserOptions` はほとんど同じ

> `languageOptions`

設定オブジェクトの構造はかなり分かりやすくなったと思う。

### More powerful and configurable plugins

> 3 ESLint の rule に変更を加えない
> 4 JavaScript ネイティブの読み込み機能を活用する
> 5 トップレベルのプロパティを整理する
> 6 既存の plugin を動作させる

- ESLint の強みは plugin のエコシステム
- flat config で実現すること:
  - 既存の plugin が動作する
  - plugin が過去にできなかったことをできるようにする
- plugin の使い方
  - eslintrc の場合、文字列を使う
    ```
    `plugins: ["react"]`
    ```
  - flat configs の場合、はオブジェクトを使う
    ```js
    import jsdoc from "eslint-plugin-jsdoc";
    export default [{ plugins: { react } }];
    ```
- rule の読み込み方
  - eslintrc の場合、plugin にバンドルして読み込むか、`--rulesdir` (削除予定) でディレクトリを指定する
  - flat config の場合、構成オブジェクト内で直接読み込むこと**も**出来る
    - 設定ファイル内にのみ存在する runtime plugin を簡単に作れるようになった
- plugin が parser を公開できるようにした

> runtime plugin を簡単に作れるようになった

`eslint-plugin-***` 形式以外でも独自のルールを配信しやすくなった...ということだと思うけれど、いまいちユースケースが思いつかない...。

### Organized linter options

(大きい更新がないので、省略)

### Backwards compatibility utility

> 7 互換性を可能な限り確保する

- 後方互換性を確保するために、[eslintrc](https://github.com/eslint/eslintrc) パッケージの FlatCompat クラスで eslintrc スタイルの設定を使えるようにした
