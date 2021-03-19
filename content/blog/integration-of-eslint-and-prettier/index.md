---
title: ESLintとPrettierを組み合わせて使う (長いものを整理してから巻かれる 2021春)
date: 2021-03-15
description: "ESLint と Prettier を組み合わせて使う方法とその根拠(公式ドキュメント)を整理して、安心して長いものに巻かれるようになる記事"
---

**何この記事？**

ESLint と Prettier を組み合わせて使う方法とその根拠(公式ドキュメント)を整理して、安心して長いものに巻かれるようになる記事

| package  | 記事作成時の latest version |
| :------: | :-------------------------: |
|  eslint  |           v7.22.0           |
| prettier |           v2.2.1            |

---

[ESLint](https://eslint.org/) でリント、しますよね。
[Prettier](https://prettier.io/) でフォーマットも、しますよね。
ESLint(`eslint --fix .`) と Prettier (`prettier --write .`) は行うことが一部重複しているので、[連携手段に関する記事](https://www.google.com/search?q=prettier+eslint) も色々出ています。

そもそも [なぜ ESLint を使うか](https://www.google.com/search?q=eslint+benefit) 、 [なぜ Prettier を使うか](https://www.google.com/search?q=prettier+benifit) 、なぜ両方を使うか...
は置いておいて、 これら 2 つを活用して開発を進めたい(長いものに巻かれたい)。 出来れば長いもののご意見を伺って安心して巻かれたい。

そのために、公式ドキュメントを確認していきます。

## Prettier はなんて言っているの？

まず Prettier の役割についてですが、Prettier は [Prettier vs. Linters](https://prettier.io/docs/en/comparison.html) で ↓ の通り言及しています(意訳に注意)。

> Linter は 2 種類のルールをもつ
>
> 1. フォーマットに関するルール
> 1. コード品質に関するルール
>
> それぞれの目的は
>
> 1. 一貫性のあるルールでコードをフォーマットする
> 1. コードからバグを発見する
>
> Prettier はフォーマットのために使用して、バグを発見するには(Prettier 以外の)Linter を使用する。

つまり、「Prettier はフォーマットを行う。 Linter が持つ 2 種類のルールのうち、コード品質に関するのルールのみを Linter で行う」という棲み分けが、Prettier が主張する組み合わせの方針です。
この「組み合わせ」について、Prettier は [Integrating with Linters](https://prettier.io/docs/en/integrating-with-linters.html) で ↓ の通り言及しています(意訳に注意)。

> Prettier と ESLint を組み合わせるために、競合するルールを off にする
>
> - Linters は "code quality rules" だけでなく、"stylistic rules"も含んでいる。
> - Prettier を使うときは、Linters の"stylistic rules"が不要だし、競合してしまう。
> - [eslint-**config**-prettier](https://github.com/prettier/eslint-config-prettier) などを使って、不要なルールを off に出来る。
>
> Prettier と Linters の関連(連携?)プロジェクトがいくつか見つかるはずだけど、**一般的には推奨しない**、でも一部の状況では便利かも
>
> [eslint-**plugin**-prettier](https://github.com/prettier/eslint-plugin-prettier) などは Linter 経由で Prettier を実行出来て便利だけど...
>
> - エディターに赤線(Lint エラー)がめっちゃ出る
> - 直接 Prettier を実行するより遅い
> - レイヤーを１つ追加している分、壊れる可能性が高くなる
>
> [prettier-eslint](https://github.com/prettier/prettier-eslint) などは Prettier と Linters が競合して使えない時に便利だけど...
>
> - 直接 Prettier を実行するよりめっちゃ遅い

つまり、「組み合わせ(連携)のために、 eslint-**config**-prettier (競合する Lint ルール を off) のみ使用する 」ことを Prettier は推奨しています。

## ESLint 側はなんて言っているの？

[公式ドキュメント](https://eslint.org/) を検索すると、[Prettier に関する FAQ](https://eslint.org/blog/2018/04/eslint-v5.0.0-alpha.2-released#eslint-v500-alpha2-released) の更新しか記述がありませんでした。
対象の commit ([c0c331e](https://github.com/eslint/eslint/commit/c0c331e)) を見てみると(意訳注意)、

> Q. Prettier は ESLint の代わりになるの？
>
> A. ならない
>
> - ESLint は `traditional linting`と`style checking`を両方持っている。
> - 両方のために ESLint を使えるし、
> - フォーマットのために Prettier、エラーの可能性を見付けるために ESLint を組み合わせることも出来る。

つまり、「両方使うかどうかはお任せ」までの言及にとどまっています。

## 結局、どうするの？

Prettier の言及に従って、↓ の方針で使用します。

- コードフォーマットは Prettier で行う
- コード品質のチェックは ESLint で行う
- ESLint が持っているコードフォーマットのルールは eslint-**config**-prettier で off にする
- その他の連携ツールは使用しない (コードフォーマット(Prettier)とコード品質のチェック(ESLint)はそれぞれ別のものとして実行する)

### .eslintrc

extends の最後に eslint-**config**-prettier を設置して、
Prettier のルールとは競合しない ESLint の設定を行います ([eslint-**config**-line#Installation](https://github.com/prettier/eslint-config-prettier#installation) 参照)。

```json
{
  "extends": [
    "eslint-config-hoge",
    "eslint-config-fuga",
    "eslint-config-prettier"
    // ここ以降に他のconfigをさらに継承すると、Prettierのルールと衝突する危険性がある
  ]
}
```

### npm script

[Prettier の package.json](https://github.com/prettier/prettier/blob/2.2.1/package.json) を参考に check format, check code-quality 用の npm script を定義します。

```json
{
  "lint:eslint": "  eslint .",
  "lint:prettier": "prettier . --check",
  "fix:eslint": "  yarn lint:eslint --fix",
  "fix:prettier": "yarn lint:prettier --write"
}
```

組み合わせの核は [eslint-**config**-prettier](https://github.com/prettier/eslint-config-prettier) のみです。
Prettier の実際のルールと eslint-**config**-prettier が off にするルールがちゃんと 1:1 になっている必要があります。
~~え、それどうやって確認するの...?~~

すっきり！ 💪
