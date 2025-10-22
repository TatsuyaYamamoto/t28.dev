---
title: "CircleCI Config SDK のGA版が出たので config app を書いてみる"
date: "2022-09-24"
description: "GA リリースされた CircleCI Config SDK と TypeScript で CircleCI の設定を書いてみた"
---

CircleCI Config SDK の GA (General Availability) 版がリリースされたことを[Twitter で知った](https://twitter.com/CircleCIJapan/status/1572811293031022596?s=20&t=6jHB063Egyjw3YiLj82hRQ)ので、
**TypeScript/JavaScript で CircleCI の設定を書いてみようかな〜** ってなった。

## CircleCI Config SDK?

[Introducing the CircleCI Config SDK(公式ブログ)](https://circleci.com/blog/config-sdk/) がリンクしている [wiki](https://github.com/CircleCI-Public/circleci-config-sdk-ts/wiki) が一番捗った[^1]。

CircleCI Config SDK は、CircleCI の設定を YAML の代わりに TypeScript/JavaScript で書くためのもの...**ではなく**、「CircleCI の設定を TypeScript/JavaScript で書いて **YAML を出力する**ためのもの」です。
[Quick start の example](https://github.com/CircleCI-Public/circleci-config-sdk-ts/wiki/Quick_Start) を見てみると、最後に `fs.writeFile` で YAML の書き出しを行っていることが分かります。

```js
// Writing the generated config to a file
fs.writeFile("./config.yml", MyYamlConfig, (err) => {
  if (err) {
    console.log(err);
    return;
  }
});
```

CircleCI Config SDK の役割は YAML の作成までなので、CircleCI にこの YAML を実行させる 2 つの方法が [Wiki](https://github.com/CircleCI-Public/circleci-config-sdk-ts/wiki/Usage-in-Config) で紹介されています[^2]。

1. Dynamic config
   - CircleCI の Job 内で YAML を出力して、出力された YAML を実行する
2. Static config
   - Local で YAML を `.circleci/config.yml` に出力して、普通の設定ファイルとして CircleCI で実行する

ちなみに、CircleCI Config SDK で作った CircleCI の設定の実装を "config app" と呼ぶようです[^3]。

## Dynamic config?

[公式ドキュメント(Dynamic Configuration)](https://circleci.com/docs/dynamic-config)

Dynamic config は CircleCI のワークフロー上で動的に設定ファイルを構築するためのもので、config app を動的に実行するためだけの仕組みではないです。
変更されたファイルに基づいてトリガーするワークフローを切り替えたり (`path-filtering`) 、
分割して作った YAML ファイルを結合してからワークフローをトリガーする(`config splitting`)、
らしい。

Dynamic config を使ったことがないからよく分かっていないけれど、config app (をとりあえず動かす人) にとって大事なポイントは `動的に設定ファイル構築する` の部分。
config app とは別に `.circleci/config.yml` を作って [circleci/continuation orb](https://circleci.com/developer/ja/orbs/orb/circleci/continuation) で config app を実行します。

```yaml
jobs:
  generate-config:
    executor: node/default
    steps:
      - checkout
      - node/install-packages: # 👈 sdk 等の npm package をインストールして
          app-dir: .circleci/dynamic
      - run: node .circleci/dynamic/app.js # 👈 YAML を出力して
      - continuation/continue: # 👈 config app(出力した YAML) を実行する
          configuration_path: ./dynamic-config.yml
```

## Dynamic config or Static config

どっちで config app の実装を進めるの? って話ですが

- CircleCI 的には
  - [いろんな利点がある Dynamic config がオススメ](https://github.com/CircleCI-Public/circleci-config-sdk-ts/wiki/Usage-in-Config#dynamic-config-method)
- 私的には
  - Dynamic config で構築すると `circleci local execute` が出来ない[^4]
  - CircleCI 上で動的に設定ファイルを構築する必要が (まだ) ない

ということで、初めての config app 作成は static config として作っていこうと思います。

## Static config app の実装

> [TatsuyaYamamoto/circleci-static-config-app-practice](https://github.com/TatsuyaYamamoto/circleci-static-config-app-practice) の `.circleci` 配下についての説明です。
> Config app におけるお作法的なものはまだ決まっていないようなので、オレオレな構成・記述なことに注意。

### ディレクトリ構成

```
<repo root>/
　├ .circleci/ 👈 (1)
　│　  ├ config.yml
　│　  └ app/
　│  　  　　│ 👇 (2)
　│  　  　　├ executors/
　│  　  　　├ jobs/
　│  　  　　├ orbs/
　│  　  　　│ 👇 (3)
　│  　  　　├ config.ts
　│  　  　　├ workflow.ts
　│  　  　　├ generate-yml.ts
　│  　  　　├ package.json
　│  　  　　└ package-lock.json
```

1. CircleCI の例では Dynamic config の実装だから`app/` の部分が `dynamic/` になっているけれど、今回は static なので... とりあえず `app/`にした
2. 複数個定義する前提のものはディレクトリに入れる
3. 複数個定義しないものは単一のファイルで定義する (workflow は複数個定義できるけれど)

### [config.ts](https://github.com/TatsuyaYamamoto/circleci-static-config-app-practice/blob/main/.circleci/app/config.ts)

これが config app の エントリーポイントになっています。

TypeScript で定義した各種コンポーネント(後述)を渡して、[Config class](https://circleci-public.github.io/circleci-config-sdk-ts/classes/Config.html) のインスタンスを作っています。
`.circleci/config.yml` におけるルートの属性を定義しているイメージ。

```ts
// import { 色々 } from "あれこれ";

const config = new Config(
  false,
  [lint, test, build],
  [workflow],
  [nodeExecutor],
  undefined,
  undefined,
  [orbsCircleciNode],
);
```

```yaml
# これのイメージ
setup: false
jobs: []
workflows: []
executors: []
orbs: []
```

### [executors/node.ts](https://github.com/TatsuyaYamamoto/circleci-static-config-app-practice/blob/main/.circleci/app/executors/node.ts)

`executors/` 配下で Reusable executor を定義していきます。

```ts
export const nodeExecutor = new DockerExecutor("cimg/node:16.15.1")
  // 👇 (1)
  .toReusable("docker-node");
```

1. モジュール化するべきなのは [DockerExecutor](https://circleci-public.github.io/circleci-config-sdk-ts/classes/executors.DockerExecutor.html) ではなく [toReusable()](https://circleci-public.github.io/circleci-config-sdk-ts/classes/executors.DockerExecutor.html#toReusable) で戻ってくる [**Reusable**Executor](https://circleci-public.github.io/circleci-config-sdk-ts/classes/reusable.ReusableExecutor.html) オブジェクト
   - 超・余談
     - ルートの `executors:` で宣言しているのは [**Reusable** executor](https://circleci.com/docs/reusing-config#authoring-reusable-executors) ということを始めて知った。
     - (pure な) executor は [Job で直接宣言するもの](https://circleci.com/docs/ja/configuration-reference#docker-machine-macos-windows-executor) で、今まで executor だと思っていたのは Reusable な executor だった。

### [orbs/circleci-node.ts](https://github.com/TatsuyaYamamoto/circleci-static-config-app-practice/blob/main/.circleci/app/orbs/circleci-node.ts)

`orbs/` 配下で 読み込む orb を定義していきます。 今回は [circleci/node](https://circleci.com/developer/ja/orbs/orb/circleci/node) を使いました。

```ts
const orbsCircleciNodeManifest: OrbImportManifest = {
  commands: {
    "install-packages": new CustomParametersList([
      // 👇 (3)
      /* omit */
    ]),
  },
  jobs: {},
  executors: {},
};

export const orbsCircleciNode = new OrbImport(
  // 👇 (1)
  "node",
  "circleci",
  "node",
  "5.0.2",
  undefined,
  orbsCircleciNodeManifest, // 👈 (2)
);

// 👇 (4)
export const installPackages = () =>
  new ReusedCommand(orbsCircleciNode.commands["install-packages"]);
```

1. エイリアス・参照する orb の情報をコンストラクタに渡す
   - `node: circleci/node@5.0.2` より構造的で分かりやすいと思う
2. Orb が持っている jobs, executors, commands の情報を `OrbImportManifest` 型で渡す
   - これは型解決のため**ではなく**、 YAML 出力時に [ReusedCommand class](https://circleci-public.github.io/circleci-config-sdk-ts/classes/reusable.ReusedCommand.html) のインスタンス作成が「そんなコマンドはない的エラー」でコケるから[^5]
3. Orb 内のコンポーネントのパラメーターの情報は `CustomParametersList` で渡す
   - (2) と同様にこれも型解決のため**ではない**
   - config app 内で使う/使わないに関わらず、定義しなくても YAML 出力時にコケない[^6]のでとりあえず定義をサボる
4. orb のコマンドを [ReusedCommand class](https://circleci-public.github.io/circleci-config-sdk-ts/classes/reusable.ReusedCommand.html) のインスタンスで取得する受け取る関数を作った
   - `commands["install-package"]` は型解決された参照ではない([commands の key は string 型](https://circleci-public.github.io/circleci-config-sdk-ts/classes/orb.OrbImport.html#commands))ので、安全に使うため

### [jobs/build.ts](https://github.com/TatsuyaYamamoto/circleci-static-config-app-practice/blob/main/.circleci/app/jobs/build.ts)

`jobs/` 配下で Job を定義していきます。今回の実装はシンプルすぎるから、 YAML の出力結果を見て「ふ〜ん」ってするだけで十分。

```ts
export const build = new Job("build", nodeExecutor.reuse(), [
  new Checkout(),
  installPackages(),
  new Run({
    command: "npm run build",
  }),
]);
```

```yaml
# 出力結果
build:
  executor:
    name: docker-node
  steps:
    - checkout
    - node/install-packages
    - run:
        command: npm run build
```

### [workflow.ts](https://github.com/TatsuyaYamamoto/circleci-static-config-app-practice/blob/main/.circleci/app/workflow.ts)

```ts
export const workflow = new Workflow("Lint, test, and build", [
  new WorkflowJob(lint),
  new WorkflowJob(test),
  new WorkflowJob(build, {
    requires: [lint.name, test.name], // 👈 (1)
  }),
]);
```

1. Required な Job は依存先の Job の名前を渡して定義する
   - `requires: ["lint", "test"]` って書いても良いんだけれど[^7]、name field を渡すと管理が楽になる
     - TypeScript/JavaScript で書くメリットをこういうところで感じる〜😊✨

### [generate-yml.ts](https://github.com/TatsuyaYamamoto/circleci-static-config-app-practice/blob/main/.circleci/app/generate-yml.ts) & ts-node

少し冗長かもしれませんが、今回の実装では「Config インスタンスから YAML を出力する」役割を `generate-yml.ts` に分けて実装しています。

"config app のビルド"は [config app の package.json](https://github.com/TatsuyaYamamoto/circleci-static-config-app-practice/blob/main/.circleci/app/package.json) 内の build script で定義していて、TypeScript を直接実行するために ts-node を使ってます。

## 実行

### local

```shell
$ npm --prefix .circleci/app run build # ってやって

$ circleci local execute --job build --job build # ってやると

Success! # こうなる ✨
```

### remote

https://app.circleci.com/pipelines/github/TatsuyaYamamoto/circleci-static-config-app-practice

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/TatsuyaYamamoto/circleci-static-config-app-practice/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/TatsuyaYamamoto/circleci-static-config-app-practice/tree/main)

## 結論

### そもそもなんで TypeScript/JavaScript で書きたいんだっけ？

「余計な仕組みを加えるより素直に静的な設定ファイル(`.circleci/config.yml`) だけを書いた方が分かりやすいんじゃないの？」なんて思いつつも...

- 🤔 command とか job とかを分割して管理したいなぁ
  - ~~[Orb](https://circleci.com/docs/ja/orb-intro) とか [circleci config pack](https://circleci.com/docs/ja/how-to-use-the-circleci-local-cli) とかあるじゃんって感じだけど、 TypeScript/JavaScript で書きたいよねっていうやつ~~
- 🤔 型安全欲しいなぁ
  - 必要なパラメーターをエディター上や local 実行時に知りたい
- 🤔 文字列で宣言をしたくないなぁ
  - command や job を使うとき文字列で指定したくない (定数やオブジェクトで指定したい)

### 書いてみてどうだった？

#### いいね！

期待した通りに書ける感じでうれし〜

- 😊 TypeScript/JavaScript で変数・モジュールを定義出来るから、分割の状態が分かりやすい (慣れてる)
- 😊 型定義があるから、コンポーネントに必要な情報が分かりやすい (コードを読むときも助かると思う)
- 😊 オブジェクト指向な書き心地でコンポーネントの宣言や受け渡しが感覚的

#### うーん...

- この記事を書くぐらいには、前提の知識が必要
  - でも、npm package が充実してくれば、`.circleci/` 配下のファイルがものすごくスリムになる予感がする！
- 型安全になりきれないところがある
  - `OrbImportManifest` のところ
    - [@circleci/circleci-config-parser](https://www.npmjs.com/package/@circleci/circleci-config-parser) ってのがあるので、orb の YAML を `ConfigParser.parseOrbManifest` に通して...みたいな感じに今後なりそう
  - `requires: [lint.name, test.name]` のところ
    - 本当は Job オブジェクトをそのまま渡したい

### つまり

使います 👊😊✨

[^1]: GA 版が出たばかりし、まだドキュメントが不足しているのは仕方ない

[^2]: 記事内の Dynamic config と Static config の説明は私が勝手に解釈・表面的に説明したものなので、原文も呼んだ方が良いです。

[^3]: ブログとか wiki で公式が言ってる。

[^4]: [continuation](https://circleci.com/developer/ja/orbs/orb/circleci/continuation) な Job を実行する場合 CircleCI から CIRCLE_CONTINUATION_KEY を受け取る必要があるけれど、local だと受け取れないので実行できない ([CLI のドキュメント](https://circleci.com/docs/ja/how-to-use-the-circleci-local-cli#limitations-of-running-jobs-locally) にも ワークフローは実行できないって書いてた)

[^5]: Dynamic config の場合は分からん

[^6]: Dynamic config の場合は分からん

[^7]: でも文字列を使っちゃうとコードで設定を表現している意味がない...。
