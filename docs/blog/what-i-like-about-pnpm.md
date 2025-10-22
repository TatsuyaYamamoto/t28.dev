---
title: "pnpm の好きポイントを書いておこ"
date: "2023-06-27"
---

パッケージマネージャーに関しては

- パッケージマネージャーを管理するために依存関係を増やしたくない 🥺
- nvm でバージョン指定した Node.js に内蔵されている npm を使えばいいじゃん 😘

という考えだったのですが、 pnpm を試しに使ってみると「いいなこれ〜」ってなったので、個人的好き ❤️ ポイントを書いておきます。

## フラットではない node_modules ディレクトリによる厳格さ

「pnpm って xxx のやつだよね」で出てくる pnpm の特徴は、シンボリックリンクを活用したフラット**ではない** node_modules ディレクトリ構造ですね。

これは公式ドキュメント内の [Motivation](https://pnpm.io/ja/motivation) でも紹介されています。

- ディスク容量の節約
- インストール速度の向上
- フラットではない node_modules ディレクトリの作成 🥰[^1]

「フラットではない node_modules」の詳細は pnpm のブログ ([フラットな node_modules が唯一の方法ではありません](https://pnpm.io/ja/blog/2020/05/27/flat-node-modules-is-not-the-only-way)) に譲るとして、好き ❤️ ポイントを紹介するために簡単に書くと

npm で express をインストールすると、node_modules 直下に express と express の依存関係がフラットに配置されます。

```shell
$ tree node_modules -L 1
node_modules
├── accepts
(略)
├── express
├── finalhandler
(略)
└── vary

57 directories, 0 files
```

一方、pnpm で express をインストールすると、node_modules 直下には express (のシンボリックリンク) のみが配置されます。

```shell
$ tree node_modules -L 1
node_modules
└── express -> .pnpm/express@4.18.2/node_modules/express

1 directory, 0 files
```

そして、express 自体、および express の依存関係は node_modules/.pnpm 配下に配置されます。

```shell
$ tree node_modules/.pnpm -L 1
node_modules/.pnpm
├── accepts@1.3.8
(略)
├── express@4.18.2
(略)
└── vary@1.1.2

59 directories, 1 file
```

これの何が良いかっていうと「インストールしていないパッケージをインポート出来ない (= 厳格)」点です。

例えば、npm の場合は express の依存関係である accepts も node_modules 配下にあるので、 `require("accepts")` って出来ちゃう。
一方、pnpm の場合は node_modules 配下に accepts は配置されないので、自分でインストールしない限り `require("accepts")` って出来ない。

「明示的にインストールしていないパッケージを使う」だけでも気になりますが、
「package.json でバージョンを指定していない(= パッケージマネージャーが決めた任意のバージョンの)パッケージを使う」のは素朴に危ないので、pnpm 好き ❤️ ってなります。

## `workspace:` でワークスペースパッケージを参照する

monorepo 内のパッケージ間で依存関係がある場合、その依存関係も package.json に記載されているべき[^2]です。

しかし npm ([workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces))を使用している場合、`npm install` によってパッケージが `node_modules` フォルダにシンボリックリンクされます。
つまり、依存パッケージを `dependencies` に定義しなくても参照出来てしまう。

```json
// package.json & npm
{
  "name": "parent",
  "dependencies": {
    // "shared": "*" ← がなくても、parent は shared を参照出来る 🥺
  }
}
```

一方、pnpm は[ワークスペースプロトコル (workspace:)](https://pnpm.io/ja/workspaces) をサポートしているので、
明示的に、「ローカルにあるワークスペースパッケージに依存している」ことを package.json 内で宣言することが出来ます！

仮に、実際はワークスペースに無いパッケージを package.json で宣言していて `pnpm i` を実行した場合、代わりに npm registry からインストール... といは**ならない** ので、安全！好き ❤️

```json
// package.json
{
  "name": "parent",
  "dependencies": {
    "shared": "workspace:*" // ← がないと、parent は workspace 内の shared を参照できない 🥰
  }
}
```

## 余談的だけれど、便利な機能

### `pnpm import`

ref: https://pnpm.io/cli/import

`package-lock.json` を見て `pnpm-lock.yaml` を作ってくれるから、お気軽移行！

### `pnpm patch <pkg>`

ref: https://pnpm.io/cli/patch

使わないに越したことはないんだけれどね...まぁ...便利なの...。

## 今のところの個人的な方針

- monorepo の場合、pnpm を使う
  - たくさんある package.json で宣言したたくさんのパッケージの管理を厳格にしたいよね
  - workspace パッケージ同士の依存関係も厳格にしたいよね
- monorepo **ではない**場合、npm を使う
  - package.json １個なら... npm でも良いかな...っていう面倒くさがり屋な自分がいる...。

corepack? な人は、「[corepack を使って npm/Yarn をお仕事的に安心して使う方法を考える](./manage-npm-and-yarn-using-corepack-safely)」 でも見て頂戴。

[^1]: 他 2 つは開発体験上は重要ですが、成果物の(品)質を上げる点で直接的には関係がないので、個人的に関心が薄め。

[^2]: ...と、私は思っている。
