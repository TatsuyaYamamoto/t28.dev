---
title: husky(v4, v6) と simple-git-hooks どちらを使うべきか
date: 2021-04-08
description: "Node.js を使用するプロジェクトにおいて、git-hooks を実現するために husky、simple-git-hooks どちらを使うべきか考える記事"
topics:
  - JavaScript
  - git
  - husky
  - simplegithooks
published: true
type: tech
emoji: 🐶
---

## なにこれ？

pre-commit hook を行うために [husky](https://github.com/typicode/husky) を使うか、 [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) を使うかを判断するためにあれこれ調べたことをまとめた記事。

---

## 背景

1. [husky v5 でライセンスが変わる](https://blog.typicode.com/husky-5/) 。
1. lint-staged をセットアップするための mrm の依存関係 が [husky から simple-git-hooks](https://github.com/sapegin/mrm/commit/8ecd2ce0816fb06c395276250fa85dea6f93686d) に変わる。
1. husky v4 と v5 で設定の仕方が随分変わったのか... mrm に合わせて今後は simple-git-hooks を使ってみようかなぁ...🤔
1. [husky v6 でライセンスが MIT に戻る](https://github.com/typicode/husky/releases/tag/v6.0.0) 。
1. mrm が 再び [husky (v6) を使う](https://github.com/sapegin/mrm/commit/133fe08b0895b0c994c55d39e0f43af0672fe1f9) ようになる。
1. husky v4 (今までの形式)、husky v6 (新しい形式)、simple-git-hooks、どれを使おうかなぁ...😇

## ライブラリ毎の違いを確認する (差分まとめ)

※ 自分調べ

|                      | husky v4                      | husky v6                       | simple-git-hooks                  |
| :------------------- | :---------------------------- | :----------------------------- | :-------------------------------- |
| 初期設定             | `npm i {,husky}` 時に行われる | `npx husky install` を実行する | `npx simple-git-hooks` を実行する |
| git-hooks 定義場所   | package.json                  | .husky 配下の shell script     | package.json                      |
| git-hooks の反映方法 | 不要                          | 不要                           | `npx simple-git-hooks`            |

## ライブラリ毎の違いを確認する (CLI から)

### husky v4

(↓) husky v4 をインストールすると、 .git/hooks 配下に git-hooks 用の shell script が追加される。

```shell
$ git init husky-v4
$ cd husky-v4
$ npm init
$ npm i husky@4
$ ls -1 .git/hooks | grep -v .sample
applypatch-msg
commit-msg
husky.local.sh
husky.sh
post-applypatch
post-checkout
post-commit
post-merge
post-rewrite
post-update
pre-applypatch
pre-auto-gc
pre-commit
pre-merge-commit
pre-push
pre-rebase
prepare-commit-msg
push-to-checkout
sendemail-validate
```

(↓) 各 git-hooks の shell script では、共通の shell script( [husky.sh](https://github.com/typicode/husky/blob/v4/sh/husky.sh) )を介して、[husky-run を実行する](https://github.com/typicode/husky/blob/v4/sh/husky.sh#L13) 。
husky-run で、`package.json` や `.huskyrc` 内に書かれた git-hooks 用のコマンドを実行する。

```shell
$ cat .git/hooks/pre-commit
#!/bin/sh
# husky

. "$(dirname "$0")/husky.sh"
```

### husky v6

(↓) husky v6 のインストールのみでは、特に何も起きない。

```shell
$ git init husky-v6
$ cd husky-v6
$ npm init
$ npm i husky@6
$ ls -1 .git/hooks | grep -v .sample
$ cat .git/config
[core]
  repositoryformatversion = 0
  filemode = true
  bare = false
  logallrefupdates = true
  ignorecase = true
  precomposeunicode = true
```

(↓) [husky v6 usage](https://github.com/typicode/husky/tree/v6.0.0#usage) の通りに、npm prepare を定義して husky install を行うと、`hooksPath = .husky` が設定される。

```shell
$ npm set-script prepare "husky install" && npm run prepare

# .git/config に `hooksPath = .husky` が追加されている。
$ cat .git/config
[core]
  repositoryformatversion = 0
  filemode = true
  bare = false
  logallrefupdates = true
  ignorecase = true
  precomposeunicode = true
  hooksPath = .husky

# hooksPath が指定している .husky ディレクトリ も作成されている。
$ ls -R .husky
_

.husky/_:
husky.sh

# .git/hooks 配下に変化はなし
$ ls -1 .git/hooks | grep -v .sample
```

(↓) [husky v6 usage](https://github.com/typicode/husky/tree/v6.0.0#usage) の通りに hook を追加すると、 .husky 配下に git-hooks 用の shell script が作成される。
この shell script 内に git-hooks 用のコマンドが定義される。

```shell
$ npx husky add .husky/pre-commit "npm test"
husky - created .husky/pre-commit

$ cat .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm test
```

### simple-git-hooks

(↓) simple-git-hooks のインストールのみでは、特に何も起きない。

```shell
$ git init simple-git-hooks
$ cd simple-git-hooks
$ npm init
$ npm i simple-git-hooks
$ ls -1 .git/hooks | grep -v .sample
```

(↓) [simple-git-hooks の usage](https://github.com/toplenboren/simple-git-hooks#add-simple-git-hooks-to-the-project) 通りに、package.json に git-hooks を追加する。

```shell
$ cat ./package.json | jq '.["simple-git-hooks"]'
{
  "pre-commit": "npx lint-staged",
  "pre-push": "cd ../../ && npm run format"
}
```

(↓) [simple-git-hooks の usage](https://github.com/toplenboren/simple-git-hooks#add-simple-git-hooks-to-the-project) 通りに package.json 内の設定を反映させると、.git/hooks 配下に対応した git-hooks 用の shell script が作成される。
この shell script 内に package.json 内のコマンドがコピー(?)される。

```shell
$ npx simple-git-hooks

# .git/hooks 配下に、package.json 内で定義したコマンドを実行する shell script が追加されている。
$ ls -1 .git/hooks | grep -v .sample
pre-commit
pre-push

$ cat .git/hooks/pre-commit
#!/bin/sh
npx lint-staged
```

## husky v6(v5) での変更の理由

### js で git-hooks 用コマンドを設定しなくなった理由

[Why husky has dropped conventional JS config](https://blog.typicode.com/husky-git-hooks-javascript-config/)

- v4 の構成には課題があった。
  1. すべての git-hooks ファイルを .git/hooks 配下に設置するため、必要ない (ユーザー側が定義していない) git-hooks と node が実行される。
  2. git-hooks を実現するための実装が .git/hooks と js 側で 2 つある。
- Git 2.9 で導入された `core.hooksPath` を使うことで、課題を解消した。

[README 上段](https://github.com/typicode/husky#husky) に記載されている `Modern native Git hooks` はこれのことか。
native(.git/hooks) の機能を使いやすくするためのラッパー(husky の js) を(一部)取り除いたのだから、シンプルになるのは当たり前ですね。

v4 の課題(遅い、実装が重複する)はラッパーとしては仕方ないデメリットの気もする...。
現時点の v4 は `すべての git-hooks ファイルを .git/hooks 配下に設置`しているので、実装が重複しているデメリット(js の更新に .git/hooks 側を追従させるコスト)を感じにくいなぁ...。

### 設定を自動で行わないようにした理由

[Why husky doesn't autoinstall anymore](https://blog.typicode.com/husky-git-hooks-autoinstall/)

- husky を install したときに git-hooks を自動でインストールしなくなった。
- 代わりに、npm prepare を用いて`husky install`を実行する。
- package manager のお作法が変わった。
  - package manager の best practice として、postinstall はコンパイルのみに使用することになっている。
  - package manager の cache 機能により、husky が期待する postinstall が実行されないケースが出てきた。
  - package manager は postinstall 時にログを出力しなくなった。
- husky はお作法に従った。

## で、どうするの？

- husky v4 は使わない
  - (自分は遭遇したことがないけれど) install 時に不具合が発生する可能性があることが報告されている以上、husky v4 を積極的に使用する理由はありません。
- husky v6 を使う
  - simple-git-hooks が駄目なわけではないけれど...。
  - 両方とも実装がシンプル過ぎて正直決め手に欠ける...。
  - "[Husky provides some safe guards](https://blog.typicode.com/husky-git-hooks-javascript-config/#but)" に期待して、husky を使うことにします。

`hooksPath` を使って独自で git-hooks を実装するパターンも無くはないでしょうが、「husky を使ってる(ドキュメントがある)」という状態の方が他の人や未来の自分にとっても分かりやすいかなぁ...。

---

この記事は [t28.dev/should-i-use-husky-or-simple-git-hook/](https://t28.dev/should-i-use-husky-or-simple-git-hook/) で公開しているものをコピペしたりごにょったりしたものです。
