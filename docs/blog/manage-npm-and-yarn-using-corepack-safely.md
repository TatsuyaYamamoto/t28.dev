---
title: "corepack を使って npm/Yarn をお仕事的に安心して使う方法を考える"
date: 2022-04-22
---

## npm/Yarn どっちでも良いけれど、ちゃんと管理されていて欲しい

プライベートでは npm 一択ですが、お仕事環境では「〇〇プロジェクトでは npm、△△ プロジェクトでは Yarn を使ってる。バージョン？分からん。」となることは、まぁあると思います。
パッケージマネージャーのバージョン違いによってどれほどの差分が発生するかは正直分からないのですが(lockfile のバージョン違いは除く)、
バージョンを揃えて再現性を持たせるのは基本ですよね！

でも「バージョンを patch まで指定してるから気をつけてね！」とお願いするだけだと [お仕事的には意味がない](https://kotobank.jp/word/%E5%BD%A2%E9%AA%B8%E5%8C%96-254448) し、辛みが深い。
作業するプロジェクトごとに npm/Yarn とそのバージョンのスムーズに切り替えたいし、間違えていたらエラーにもなって欲しい。

つまり「〇〇プロジェクトでは npm vx.y.x、△△ プロジェクトでは yarn vx.y.x を使ってるよ！」って胸を張って言いたい。

## corepack

[corepack](https://github.com/nodejs/corepack) は Node.js が標準(!)で提供する **パッケージマネージャーの管理ツール**です。
[README を元に](https://github.com/nodejs/corepack#readme) 正確に表現すると `プロジェクトとパッケージマネージャーのブリッジをするNode.jsスクリプト` ですが、
最初は `pmm (package manager manager)`という名前だったので間違いではない。

ref: [commit (c12bf5)](https://github.com/nodejs/corepack/commit/c12bf5e1ceeca85f84855a96dfa81530ba806296)

例えば `yarn` と実行すると、Yarn ではなく先に corepack が実行されます(ブリッジ)。 corepack は設定に従ったバージョンの Yarn を必要に応じてインストール(管理ツール)した上で実行してくれます。
[README の USAGE](https://github.com/nodejs/corepack#usage) の通り、普通に `yarn` するだけでプロジェクトが期待するバージョンの Yarn になっているのは嬉しいですね。
corepack 以前は [yarn upgrade](https://classic.yarnpkg.com/lang/en/docs/cli/upgrade/) や [yvm](https://github.com/tophat/yvm) で手動更新していた(はず(多分))。

さらに嬉しいことに corepack は [^14.19.0](https://nodejs.org/en/blog/release/v14.19.0/) 、 [^16.9.0](https://nodejs.org/en/blog/release/v16.9.0/) 、 [^18.0.0](https://nodejs.org/dist/latest-v18.x/docs/api/) の Node.js にバンドルされているので、すでに**LTS 環境で使えます**。
[Node.js 側ではまだ corepack を Experimental](https://nodejs.org/dist/latest-v18.x/docs/api/corepack.html) としていますが、[Yarn 側は corepack を the preferred way](https://yarnpkg.com/getting-started/install) として紹介しているので、使っていいんじゃないかな 🔥🔥

## Yarn を corepack で制御する

### Yarn を有効にする

corepack をバンドルしている Node.js v14.19.0 をインストールすると、npm と同じ用に corepack が `bin` にあることを確認できます。

```shell
( '8')   < % nvm use v14.19.0
Now using node v14.19.0 (npm v6.14.16)

( '8')   < % ls -1 $NVM_BIN
corepack
node
npm
npx
```

[`corepack enable yarn`](https://github.com/nodejs/corepack#corepack-enable--name) を実行して、`bin` に Yarn の実行ファイルを貼ります(`bin` 配下に設置されるファイルはシンボリックリンク)。

```shell
( '8')   < % corepack enable

( '8')   < % ls -1 $NVM_BIN
corepack
node
npm
npx
yarn
yarnpkg
```

yarn ファイルを見ると、ブリッジと説明される所以が分かります。ここでは Yarn の実行を corepack に指示しているだけです。

```shell
( '8')   < % cat $NVM_BIN/yarn
#!/usr/bin/env node
require('./corepack').runMain(['yarn', ...process.argv.slice(2)]);
```

Yarn の実行も出来ました。何も標準出力されませんが、裏で corepack が 実際の(今回は v1.22.15 ) Yarn をインストールしてくれています。

```shell
( '8')   < % yarn -v
1.22.15
```

`$HOME/.node/corepack` がインストールフォルダなので、ここで今さっきインストールされた Yarn の実装も確認できます。

ref: [source (folderUtils.ts#L6)](https://github.com/nodejs/corepack/blob/corepack/0.10.0/sources/folderUtils.ts#L6)

```shell
( '8')   < % ls -1  ~/.node/corepack/yarn/
1.22.15
```

消しても、corepack が必要に応じて再インストールしてくれる。

```shell
( '8')   < % rm -r ~/.node/corepack/yarn
( '8')   < % yarn -v
1.22.15
```

### Yarn のバージョンを切り替える

[Node.js ランタイムが使用する package.json のフィールド](https://nodejs.org/dist/latest-v18.x/docs/api/packages.html#nodejs-packagejson-field-definitions) として、[packageManager](https://nodejs.org/dist/latest-v18.x/docs/api/packages.html#packagemanager) が corepack と合わせて追加されています。
`packageManager` で Yarn のバージョンを指定したあとは、Yarn を実行するだけで設定通りのものが使えます。

```shell
( '8')   < % cat package.json
{
  "packageManager": "yarn@3.2.0"
}
( '8')   < % yarn -v
3.2.0

# Yarnの実装が追加されている
( '8')   < % ls -1  ~/.node/corepack/yarn/
1.22.15
3.2.0
```

ちなみに Yarn 2+ にはバージョンをプロジェクト用に固定するための [`yarn set version`](https://yarnpkg.com/cli/set/version) コマンドがありますが、
[Yarn v4 の Major changes](https://github.com/yarnpkg/berry/blob/%40yarnpkg/shell/4.0.0-rc.1/CHANGELOG.md#major-changes) で corepack の設定を優先するようになるので、今から使うならば `packageManager` の方が良さそう。

## npm を corepack で制御する

npm は Node.js に同梱されているので、Node.js のインストール直後から `bin` で実装を確認できます。

```shell
( '8')   < % cat $NVM_BIN/npm | head -3
#!/usr/bin/env node
;(function () { // wrapper in case we're in module_context mode
  // windows: running "npm blah" in this folder will invoke WSH, not node.
```

~~特別な理由がない限り Node.js に同梱された npm をそのまま使う方が良いない？~~ この npm のバージョンを corepack で切り替えていきます。

corepack で npm を有効にすると、corepack を呼び出すブリッジの実装に置き換わります。(ちなみに `corepack disable npm` しても、同梱された npm 実装は消えたまま...)

```shell
( '8')   < % corepack enable npm

( '8')   < % cat $NVM_BIN/npm
#!/usr/bin/env node
require('./corepack').runMain(['npm', ...process.argv.slice(2)]);
```

設定に合わせて npm のバージョンを自動で変更してくれる点は Yarn と同じですね。

```shell
( '8')   < % cat package.json
{}

( '8')   < % npm -v
7.20.1

( '8')   < % cat package.json
{
  "packageManager": "npm@8.0.0"
}

( '8')   < % npm -v
8.0.0
```

## 特定のパッケージマネージャー・バージョンの使用を強制する

### npm を強制する

`packageManager` で npm を指定した上で yarn を実行すると、エラーが出る 😊

```shell
( '8')   < % cat package.json
{
  "packageManager": "npm@8.0.0"
}

( '8')   < % yarn -v
Usage Error: This project is configured to use npm

$ yarn ...
```

でも、homebrew でインストールした Yarn だと corepack のブリッジを通さないのでエラーが出ない 😭

```shell
( '8')?! < % yarn -v
3.0.0
```

Node.js 同梱版の npm も同様に、corepack のブリッジを通さないのでエラーが出ない 😭

```shell
( '8')   < % npm -v
6.14.16

( '8')   < % cat $NVM_BIN/npm | head -3
#!/usr/bin/env node
;(function () { // wrapper in case we're in module_context mode
  // windows: running "npm blah" in this folder will invoke WSH, not node.

( '8')   < % npm i
npm WARN corepack-test No description
npm WARN corepack-test No repository field.
npm WARN corepack-test No license field.

up to date in 0.318s
found 0 vulnerabilities
```

### Yarn を強制する

`packageManager` で Yarn を指定した状態で Node.js 同梱版の npm を使用しても、corepack のブリッジを通さないのでエラーが出ない 😭

```shell
( '8')   < % cat package.json
{
  "packageManager": "yarn@3.2.0"
}

( '8')   < % npm i
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN corepack-test No description
npm WARN corepack-test No repository field.
npm WARN corepack-test No license field.

up to date in 0.594s
found 0 vulnerabilities
```

corepack で npm を有効にしている状態、かつ `packageManager` で Yarn を指定した状態だと、エラーが出る 😊

```shell
( '8')   < % npm -v
Usage Error: This project is configured to use yarn

$ npm ...
```

## corepack の使用を強制させたい

corepack を使えば簡単にパッケージマネージャとそのバージョンを制御できて幸せですが、それは corepack の世界の範囲のお話...。
前述の通り、corepack を通さずに npm や Yarn を使用してしまえば想定外の環境でコマンドを実行できてしまいます。

corepack (を通して npm/Yarn) の使用を強制させたい...けど、任意の npm/Yarn コマンドの実行時に corepack を通しているかを確認できる仕組み...🤔

## 結論 (暫定)

- `package.json#packageManager` で npm/Yarn のバージョンを指定する
- corepack を通して、指定バージョンの npm/Yarn を実行する
- corepack の使用は、ルール(強い気持ち)で指定...............😭

~~nvm でインストールした Node.js に同梱された npm をそのまま使いつつ、nvmrc と package.json の engine フィールドで制限をかける方がシンプルで良さそう~~
