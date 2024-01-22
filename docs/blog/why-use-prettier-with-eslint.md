---
title: 人は何故、ESLintと共にPrettierを使うのか?
date: 2021-04-03
description: "Prettier と ESLint を併用する根拠を公式ドキュメントを読みながら(自分が)納得する記事"
---

## なにこの記事？

Prettier と ESLint を併用する根拠を公式ドキュメントを読みながら(自分が)納得する記事です。

---

[Prettier と ESLint を組み合わせて使う人](https://t28.dev/integration-of-eslint-and-prettier/) もいれば、どちらか一方のみを使用するケースなどなど、
Formatter、Linter の活用方法にも色々あると思います。

👨🏻‍💻 < Prettier は設定が(少)なくて楽 <br/>
👨🏻‍💻 < ESLint で ルール・警告レベルも制御しようよ <br/>
👨🏻‍💻 < Prettier・ESLint は [ルールで使い分けたいなぁ](https://prettier.io/docs/en/comparison.html)

なんとなく、Prettier と ESLint の併用が昨今の Frontend 開発の鉄板(本当かな?🤔)な空気を私は感じでいますが、それは何故でしょうね？

1 つの目的(コードスタイルの統一)に 2 つのツールを併用することは複雑です。
「ESLint にも`--fix` な機能があるし、ESLint だけでいいじゃん」...となることは自然なことだと思います。

ですが、今一度問おう..._**私**は何故、ESLint と共に Prettier を使うのか?_ ~~(チキってタイトルとちょっと違う)~~

## Prettier の公式ドキュメントを眺める

### [Why?](https://prettier.io/)

> - 保存するとコードはフォーマットされている
> - コードレビューにおいてスタイルの議論が必要なくなる
> - 時間と体力をとっておける
>   <br/> (意訳)

ESLint だって、
[lint on save](https://pleiades.io/help/idea/eslint.html#ws_eslint_configure_run_eslint_on_save) 出来るし、
ESLint のルールに従うことでスタイルに関する議論を発生させないし、
`--fix`で自動修正も出来るよなぁ。

### [What is Prettier?](https://prettier.io/docs/en/index.html)

> 最大行長を考慮した独自のルールで、解析した AST を再出力する(意訳)

[ESLint も AST で解析する](https://eslint.org/docs/user-guide/configuring/plugins#specifying-parser)けれど、ESLint の`--fix` は [最大長の考慮はしない(自動修正できない)](https://eslint.org/docs/rules/max-len) から、ここがポイントかな 🤔

### [Why Prettier?](https://prettier.io/docs/en/why-prettier.html)

#### Building and enforcing a style guide

> Prettier を採用する最大の理由は、スタイルに関するすべての議論を終わらせること (意訳)

これは ESLint で特定のルールに従って `--fix` する(議論しない、自動修正する)こと...ではなく、**特定のルールを決める議論もさせない**、という意味のようです。
Prettier は細かい設定が"出来ない"のではなく、"させない"(Prettier のルールに従わせる)、ということですね。

> Prettier は唯一の完全に自動化された"スタイルガイド" (意訳)

ESLint は Prettier が謳うような 完全に自動化されたスタイルガイドではない(`--fix`出来ないフォーマットルールがある)ので、異なる(独自のスタイルが発生したり、リントエラーと格闘したりする)…と。

> Prettier が 100%希望通りにフォーマットをしないとしても、Prettier 独自の利点には価値がある。 (超・意訳)
>
> - スタイルの議論は大体無駄。
> - 三項演算子について長いこと議論したけれど、一貫性がなかった。議論するより Prettier に従ったほうが遥かに簡単。

コードスタイルについてどんなに議論を尽くしても収束することはないから、多少の不満は飲み込んでも Prettier に従っちゃいなよ...と。
Prettier が言う`An opinionated code formatter`というのはこの部分のこと(独善的)を言っているのかな 🤔

ESLint を導入するときは、「さて、どの eslint-config を extends するかな 😇」ってなりますもんね。

#### Helping Newcomers

Prettier がここで言っている`Newcomers` とは初心者という意味ではないです。
経験豊富なエンジニアだとしても、過去に別のスタイルガイドに従っていた場合、Prettier(完全に自動化されたスタイルガイド)は有益ですね。
もちろん初心者にとっては Prettier は構文の先生になるので、`disproportionally benefit` を得られることは間違いないです。

#### Easy to adopt

> 最も議論の余地がないコーディングスタイルを使うために頑張った...<br/>
> 新しくフォーマットされたコードベースは、大きな論争を作ってはならず、同僚に苦痛なく受け入れられるべき。(意訳)

沢山議論した結果が Prettier のスタイルガイドだから、黙って受け入れましょう...と...。
ちょっと`opinionated` が過ぎる気もするけれど、スタイルガイド自体が宗教だし、Prettier も１つの宗教として黙って入信する(か、否か)ってことですかね。

宗教に入信する術は ESLint にもありますね(超人気 eslint-config-hoge を入れればいい)。

> すべてのエッジケースを修正する多くのラウンドを経て...

既存のコードベースに対して(ほとんど)エラーなしでフォーマットが行えることは、ESLint との違いですね。
ESLint の場合、Code-quality rules はほぼ間違いなく修正(or rule 変更)作業が必要だし、Formatting rules もすべてが`--fix`で対応できない。

### つまり

Prettier は ESLint と異なる ↓ が大事なポイントっぽいですね。

1. ルール設定を含めたスタイルガイドの議論を発生させない (Prettier 自身が巻かれるべき長いものを用意している)
1. 最大行長を考慮した修正を完全に自動で行える (フォーマットの修正を開発者にさせない)

上記 1. については、[設定のドキュメント](https://prettier.io/docs/en/options.html) からも一目瞭然でしょう(ルールをほとんど弄れない)。 上記 2. について、もう少し調べてみます。

## 最大行長を考慮した修正

### Prettier の"最大行長を考慮した修正"

[What is Prettier?](https://prettier.io/docs/en/index.html) でリンクしている Prettier 初期リリース時の作者の記事 ([JAMES LONG | A Prettier JavaScript Formatter](https://archive.jlongster.com/A-Prettier-Formatter))を見てみます。

> Prettier は [recast](https://github.com/benjamn/recast)'s printer のフォークで、Wadler のアルゴリズム "[A prettier printer](http://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf)" で内部を書き直した。
> このアルゴリズムが考慮する最大行長が、フォーマッターがコードをレイアウトおよびラップするために必要。
> (意訳)

["A prettier printer" (PDF)](https://homepages.inf.ed.ac.uk/wadler/papers/prettier/prettier.pdf) を私は全然理解出来ませんでした(😭)が、
この論文の"2 A pretty printer with alternative layouts"に注目すると、
Prettier にはあるコードの塊を 1 行に収めるレイアウトと収めないレイアウトが出力結果の候補としてあって、最大行長を元によりきれい(と Prettier が定義している)レイアウトを選択・出力しているようです。

Prettier は修正前のソースコードを parse して得られる AST を解析して[中間表現(Doc)](https://github.com/prettier/prettier/blob/main/commands.md#prettiers-intermediate-representation-doc) を作成し、
Prettier のフォーマットルールで再出力しています。
そのため中間表現を作成した時点で、修正前のソースコードが持つスタイルの情報は削除されており、最大行長を考慮した Prettier のスタイル**のみ**に基づいたソースコードを再出力しています。
([What is Prettier?](https://prettier.io/docs/en/index.html) から勝手に読み取ったことなので、実装はちょっと違うかも...)

### ESLint の "[max-len](https://eslint.org/docs/rules/max-len)"

一方、ESLint は 各ルールが対象とする AST ノードに対して、検証を行います(max-len の場合は[Program](https://github.com/eslint/eslint/blob/master/lib/rules/max-len.js#L429) )。
"最大行長を考慮した修正"を行うには、どこに改行を入れるか、ユーザーが変更可能な様々なルール・オプションと競合しないか、エッジケースの対応方法、などを解消する必要があり、
ESLint の設計・方針上([completely pluggable](https://eslint.org/docs/user-guide/getting-started#getting-started-with-eslint)) Prettier と同等の自動修正を実現することは厳しいように思えます。

[議論の跡地の 1 つ (eslint #11325)](https://github.com/eslint/eslint/issues/11325)

## Playground で挙動を比較する

現状、Prettier、ESLint それぞれでフォーマットを行った場合、どのようになるかを Playground でシンプルに比較してみます。
[JAMES LONG | A Prettier JavaScript Formatter](https://archive.jlongster.com/A-Prettier-Formatter) に書かれているサンプルコード(↓)を Prettier と ESLint の Playground で修正させてみます。
(コードブロック内の`// prettier-ignore` は執筆の都合上のものです)

Prettier が用意したサンプルコードで Prettier を実行する...というのはあまりフェアな感じがしませんが...。

```js
foo(arg1, arg2, arg3);
// prettier-ignore
bar(reallyLongArg(), omgSoManyParameters(), IShouldRefactorThis(), isThereSeriouslyAnotherOne());
```

### Prettier

[playground](https://prettier.io/playground/#N4Igxg9gdgLgprEAuEAzCEAUBDATgcwEYAaAAj3wCYyKBmASgG4AdKVgIz01zmwBs+ATwAy0fAEECmemQgBbfAGUIAWWxRBABTzY5ceLgDO0sgElFACwgBXPgBMASnFTYwMCLgAqFgJbGZpH7ecDyKIT42hkLiUBAwFiEA8lBw0kysrCDEIBAADjARUIbIoHi4EADu2jxFyCD8FdiCxdnsuK4A1vqKua4+UPjIMLjWcNlwcuxwdnbTwur41tj4cABiHnLYMAUDddjW7lkgFjByfADqvvCGvWBwYUU+BQBuT4J1YIYtIP2GITCadr4TbIFx8P7ZABWhgAHgAhdpgLowRS6ODCfpwUH8CEgaEwxT9fB8OAARWscSxSDBuN6RhCdU4Uz4R1yuH6MHOPjs8WQAA4AAzZNkQP7ndq5OpsuB-XDPLHZACOFPggLyxRQ2EMAFoUtNpkceMqfDxAcsQdScWMQH85D4hiNrYYiSTyZTseDrTBsOwuTyLMhqCBhtgfHwiQBheQWkAygCsR2sf08Po1NOtz1Gpigs1gijA7PyMTsihgghJHr+AF8q0A)

```js
foo(arg1, arg2, arg3);

bar(
  reallyLongArg(),
  omgSoManyParameters(),
  IShouldRefactorThis(),
  isThereSeriouslyAnotherOne(),
);
```

Prettier のデフォルト値を使用しているため、設定はなし。

最大行長(`--print-width=80(defautl)`)に収まる`foo()`は 1 行に収まるように re-print されました(というか差分なし)。
最大行長に収まらない`bar()`は引数をそれぞれ改行・インデントしています。

### ESLint

[playground](https://eslint.org/demo#eyJ0ZXh0IjoiZm9vKGFyZzEsIGFyZzIsIGFyZzMpO1xuXG5iYXIocmVhbGx5TG9uZ0FyZygpLCBvbWdTb01hbnlQYXJhbWV0ZXJzKCksIElTaG91bGRSZWZhY3RvclRoaXMoKSwgaXNUaGVyZVNlcmlvdXNseUFub3RoZXJPbmUoKSk7XG5cbiIsIm9wdGlvbnMiOnsicGFyc2VyT3B0aW9ucyI6eyJlY21hVmVyc2lvbiI6MTIsInNvdXJjZVR5cGUiOiJzY3JpcHQiLCJlY21hRmVhdHVyZXMiOnsianN4Ijp0cnVlfX0sInJ1bGVzIjp7ImluZGVudCI6MiwiZnVuY3Rpb24tY2FsbC1hcmd1bWVudC1uZXdsaW5lIjoyLCJmdW5jdGlvbi1wYXJlbi1uZXdsaW5lIjoyfSwiZW52Ijp7ImJyb3dzZXIiOnRydWUsIm5vZGUiOnRydWUsImNvbW1vbmpzIjp0cnVlLCJzaGFyZWQtbm9kZS1icm93c2VyIjp0cnVlLCJ3b3JrZXIiOnRydWUsImFtZCI6dHJ1ZSwibW9jaGEiOnRydWUsImphc21pbmUiOnRydWUsImplc3QiOnRydWUsInBoYW50b21qcyI6dHJ1ZSwianF1ZXJ5Ijp0cnVlLCJxdW5pdCI6dHJ1ZSwicHJvdG90eXBlanMiOnRydWUsInNoZWxsanMiOnRydWUsIm1ldGVvciI6dHJ1ZSwibW9uZ28iOnRydWUsInByb3RyYWN0b3IiOnRydWUsImFwcGxlc2NyaXB0Ijp0cnVlLCJuYXNob3JuIjp0cnVlLCJzZXJ2aWNld29ya2VyIjp0cnVlLCJhdG9tdGVzdCI6dHJ1ZSwiZW1iZXJ0ZXN0Ijp0cnVlLCJ3ZWJleHRlbnNpb25zIjp0cnVlLCJlczYiOnRydWUsImVzMjAxNyI6dHJ1ZSwiZXMyMDIwIjp0cnVlLCJlczIwMjEiOnRydWUsImdyZWFzZW1vbmtleSI6dHJ1ZX19fQ==)
(確認するときは Fixed Code タブを見て下さい)

```js
// prettier-ignore
foo(
    arg1,
    arg2,
    arg3
);
// prettier-ignore
bar(
    reallyLongArg(),
    omgSoManyParameters(),
    IShouldRefactorThis(),
    isThereSeriouslyAnotherOne()
);
```

ESLint はもちろん適用する[rule](https://eslint.org/docs/rules/) の設定が必要です。今回は横に長過ぎる`foo()`を fix させることが期待ですので、以下の rule を on にします。
(playground 上は on/off の切り替えしか出来ない)

- [function-call-argument-newline](https://eslint.org/docs/rules/function-call-argument-newline) (default: "always")
  - 関数の引数それぞれを改行する。
- [function-paren-newline](https://eslint.org/docs/rules/function-paren-newline) (default: "multiline")
  - 関数の引数に改行がある場合、カッコ内を改行する (`(` の直後と`)`の直前)。
- [indent](https://eslint.org/docs/rules/indent) (default: 4 spaces)
  - 引数のブロックにインデントを追加する。

[ESLint は行の長さに応じた改行等の自動修正が行えない](https://eslint.org/docs/rules/max-len) ので、改行する・しないは、ほぼ固定的に判断するしかありません。

個人的に大事なポイントは、`function-call-argument-newline`、`function-paren-newline`、`indent`は [**`eslint:recommended` に 含まれていない**](https://eslint.org/docs/rules/) ということ...(indent も含まれていないことに特に驚いた)。

[airbnb](https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js#L130) や
[standard](https://github.com/standard/eslint-config-standard/blob/master/eslintrc.json#L63) 等
大御所 eslint-config に巻かれる前提であれば、あまり問題にはなりませんが、 ESLint のみで Lint 環境を構築する場合、 `eslint:all` を導入するか、宗教戦争を始めるか...うーん、どちらも恐ろしい...。

## 結論

### なんで Prettier と ESLint の併用という選択肢があるの？

- ESLint には自動修正できないルールがあり、各開発者の独自のルールでスタイルを修正させないように、Prettier を使用する。
- [Formatting rules](https://prettier.io/docs/en/comparison.html) に関しては、Rule の議論をせずに Prettier が定義する prettiest なレイアウトを採用するために、Prettier を使用する。

### で、結局自分はどうするの？

Prettier の「ルールの議論はやめて長いものに巻かれましょう」従って、
私は「脳みそ止めて Prettier を使う(ESLint と併用する)」ということを、脳みそを少しだけ使って判断しました。
