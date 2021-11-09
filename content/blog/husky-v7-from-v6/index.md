---
title: husky が v7 になったので v6 との差分を確認する
date: 2021-11-01
description: "husky v6-v7 の違いを確認して安心 major update! そして闇の世界へ"
---

> https://github.com/typicode/husky/releases/tag/v7.0.0

もう major update してる 〜〜〜 😇 ~~もう 4 ヶ月も前の話だけど~~

## どこが違うの？

[v7.0.0 のリリースタグ](https://github.com/typicode/husky/releases/tag/v7.0.0) を見る限り、**大幅な機能変更やライセンスの変更はない**ようですね。
(Node.js v10 がサポート外になったのは、大きいといえば大きいけれど)

> Improve .husky/ directory structure. .husky/.gitignore is now unnecessary and can be removed.

`.gitignore` の扱いに破壊的変更が入ったって感じ。

### gitignore の扱い

husky v6 では `.husky/_` に husky 用のちょっとしたシェルスクリプトが設置されていました。
このスクリプトは `husky install` で設置出来るものなので、`.husky/.gitignore` で `_` を gitignore するようにしていました。

https://github.com/typicode/husky/blob/v6.0.0/.husky/.gitignore

```gitignore
# こんなのがあった
_
```

husky v7 でも引き続き `.husky/_` があるわけですが、 .gitignore が `.husky/_/.gitignore` に設置されるようになり、 範囲の指定方法も ↓ のように変更されました。

```gitignore
# 設置フォルダごと (今回は .husky/_) gitignore する
*
```

**これだけ** なんですが、破壊的変更ってことで...。

### husky プロジェクトのフォルダ構造

husky 使用側にとっては全然関係ないことですが、プロジェクトのフォルダ構造が大きく変わっています。

v6 で導入した monorepo を止めて、[v6 の init package](https://github.com/typicode/husky/blob/v6.0.0/packages/init/README.md) が
[別 repository(typicode/husky-init)](https://github.com/typicode/husky-init) に切り出されました。

そんなに頻繁に repo の構造ってイジるものかな...。

## 導入する

とはいえ、引き続き husky を使う 😇

### 新規プロジェクトで

2021/11/01 時点の `mrm` だと husky v6 の構造に従って `.husky/.gitignore` を作っちゃう。

```shell
$ npx mrm@2 lint-staged
...

$ ls -a .husky
.		..		.gitignore	_		pre-commit
$ ls -a .husky/_
.		..		husky.sh
```

`huksy install` すると、huksy 側が .gitignore を作ってくれるので、これを使う。

```shell
$ npm i

$ ls -a .husky/_
.               ..              .gitignore      husky.sh
```

### 既存プロジェクトで

```shell
$ ls -a .husky
.		..		.gitignore	_		pre-commit
$ ls -a .husky/_
.		..		husky.sh
```

husky をアップデートして husky install すると、新しい gitignore が作成されるので、古いやつは削除する。

```shell
$ npm i --save-dev husky@7

# npm prepare を走らせるため
$ npm i

$ ls -a .husky/_
.		..		.gitignore	husky.sh
$ rm .husky/.gitignore
```

---

gitignore の使い方やフォルダ構造等、正直、使用者側にとって~~どっちでもいい~~大きなメリットがない破壊的変更をこうも頻繁に行うのは...
OSS という名の他人の褌で相撲を取っている立場とはいえ、うーん...。
