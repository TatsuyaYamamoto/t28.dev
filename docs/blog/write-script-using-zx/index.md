---
title: google/zx を使って辛みの少ないスクリプトを書きたい
date: 2021-08-24
description: "google/zx の紹介と、zxの機能を活用した自分の使い方の紹介"
---

**なにこの記事？**

- [google/zx](https://github.com/google/zx) の紹介
  - zx は Javascript、Node.js の API を活用しながら ShellScript の実装が出来て、便利。
- 私の活用方法の紹介
  - zx は Markdown 内の code block (js, bash)を実行する機能があり、それを活用して辛みの少ないスクリプトを書きたい。

対象: [zx v3.1.0](https://github.com/google/zx/releases/tag/3.1.0)

---

## 🐚 [google/zx](https://github.com/google/zx) でスクリプトを書いている

アプリケーションを開発していると、アプリケーション本体とは別にスクリプトの実装を強いられることがあるのは世の常ですね。こういう場合、ShellScript で書くことが一般的だと思いますが、まぁまぁ辛い。
[ちゃんと ShellScript のお作法に従って書く](https://qiita.com/piroor/items/77233173707a0baa6360) ことが出来れば色々とスムーズなんでしょうが、スクリプトのためだけに脳みそを切り替えるのも~~面倒くさい~~非効率ですよね。

そんな私は [google/zx](https://github.com/google/zx) に出会いました (読み方が分からない)。

zx は Shell(を呼び出す Node.js の`child_process`)のラッパーです。
[こんな感じ](https://github.com/google/zx#command-) (↓)に、変数定義や Shell コマンドの実行を JavaScript で書けるようにしてくれます。

```js
let name = "foo & bar";
await $`mkdir ${name}`;
```

## zx が実行できるファイル形式の種類

zx は

- javascript (commonjs)
- javascript (ESM)
- typescript
- markdown の中の js, bash code block <= **私はこれがお気に入り(後述)**
- 標準入力

の形式で書いた js(ts)を実行することが出来ます。

試しに ↓ のようなスクリプトを各ファイル形式で実行してみると(ts, md には別途実行のためのおまじないあり)、

```js
#!/usr/bin/env zx

console.log(`stdout using console.log`);
await $`echo "stdout using echo"`;
```

それぞれ、↓ のような感じで動きます。

- esm
  ```shell
  % ./src/javascript-esm.mjs
  stdout using console.log
  $ echo "stdout using echo"
  stdout using echo
  ```
- commonjs

  - top-level await をサポートしていないので、エラー

  ```shell
  % ./src/javascript-commonjs.js
                         /try-zx/src/javascript-commonjs.js:4
  await $`echo "stdout using echo"`;
  ^^^^^

  SyntaxError: await is only valid in async function
  ```

- typescript
  - ts の transpile 分、ちょっと時間がかかる
  ```shell
  % ./src/typescript.ts
  stdout using console.log
  $ echo "stdout using echo"
  stdout using echo
  ```
- markdown
  - zx コマンドから呼びだす
  ```shell
  % npx zx src/markdown.md
  stdout using console.log
  $ echo "stdout using echo"
  stdout using echo
  ```
- 標準入力
  ```shell
  % npx zx <<'EOF'
  console.log(`stdout using console.log`);
  await $`echo "stdout using echo"`;
  EOF
  stdout using console.log
  $ echo "stdout using echo"
  stdout using echo
  ```

`javascript-common.js`以外は top-level await が動くので、「commonjs の形式ではあまり書きたくないっすね...。」という感じ。

- 余談
  1. プロジェクト内にも zx の依存関係にも typescript がないのに、なんで ts が実行できるんだろう...と思ったら、[内部で`npx -p typescript`してた](https://github.com/google/zx/blob/main/zx.mjs#L198) 。
  2. markdown ファイルにも shebang の設定が出来なくはない(`% ./hoge.md`で呼べる)けれど、markdown としてキモチワルイ...。
  3. markdown, typescript, 標準出力が top-level await をサポートしているのは、実行時に mjs ファイルを書き出しているから([.md](https://github.com/google/zx/blob/main/zx.mjs#L112), [.ts](https://github.com/google/zx/blob/main/zx.mjs#L118), [stdin](https://github.com/google/zx/blob/main/zx.mjs#L70))

## zx の機能を使ってスクリプトを書いてみる

[README にかかれている機能のうち](https://github.com/google/zx/blob/main/README.md#documentation) ↓ のものを使ってサンプルスクリプトを書いてみた。

- `` $`command` ``
- Functions
  - `question()`
  - `nothrow()`
- Packages
  - `minimist` package
- Configuration
  - `$.verbose`
- Polyfills
  - `__filename` & `__dirname`
  - `require()`

```js
#!/usr/bin/env zx

/**
 * zxが呼び出したShellコマンドの標準出力を表示しないようにする。
 * @see https://github.com/google/zx/blob/main/README.md#verbose
 */
$.verbose = false;

/**
 * スクリプト実行時の引数・オプションは zx内部でminimistのparseされ、argv(global変数)に代入されている。
 * @see https://github.com/google/zx#minimist-package
 */
const inputPath = argv.path; // 👈 --path で渡した値が入る
console.log(`inputPath: ${inputPath}`);

/**
 * 対話型プログラムを作るための nodeのreadlineのwrapper
 * @see https://github.com/google/zx#question
 */
let anyWord = await question("You can input any words.");
let favorite = await question(
  "Which group is your favorite (tab autocompletion is available): ",
  {
    // 👇 choicesでtab補完を効かせることが出来るけれど、入力値検証まではしてくれない
    choices: ["μ’ｓ", "Aqours", "Nijigasaki", "Liella", "ALL"],
  }
);
console.log(`any word: ${anyWord}`);
console.log(`favorite: ${favorite}`);

/**
 * テンプレートリテラルで変数を代入しながら、Shellのコマンドを実行できる。
 * @see https://github.com/google/zx#command-
 */
const key = "name";
const value = await $`cat package.json | jq .${key}`;
// 👇 await $`command` の戻り値の型は ProcessOutput で、実行結果（標準出力・標準エラー出力）はtoStringから取る。
console.log(`${value}`); // 標準(エラー)出力
console.log(value); //      ProcessOutput

/**
 * commonjs環境で使える require() が、esm環境では使えない。(他に、__filename, __dirname も)
 * zx側で polyfill を入れてくれている。
 * @see https://github.com/google/zx#polyfills
 * @see https://github.com/google/zx/blob/main/zx.mjs#L125-L128
 */
const packageJson = require("../package.json");
console.log(`package.json#scripts.test: `, packageJson.scripts.test);

/**
 * デフォルトでは、0以外の終了コードが返ってくるとErrorがthrowされてスクリプトが終了する。
 * nothrow()でラップすると、処理を続けられる。
 */
const nothrowOutput = await nothrow($`exit 1`);
console.log(`exitCode: ${nothrowOutput.exitCode}`);

/**
 * fetch, fs, os は zx によって global scope で参照できる。
 */
const downloadUrl = `https://hogehoge.com/file.zip`;
const zipOutputPath = `${os.tmpdir()}/file.zip`;
const res = await fetch(downloadUrl);
fs.writeFileSync(zipOutputPath, Buffer.from(await res.arrayBuffer()));
```

## その他の気になるポイント

### Quotes (zx のお作法 )

感覚的にスクリプトが書けそうな zx ですが、[Quotes](https://github.com/google/zx/blob/3.1.0/docs/quotes.md) は zx のお作法として抑えておく必要があります。

#### `` $`command` `` 内で double quote, single quote を追加しない

```js
let name = "foo & bar";
await $`mkdir ${name}`; //   👈 いいよ！;
await $`mkdir "${name}"`; // 👈 ダメ！;
```

`` $`command` `` (テンプレートリテラル)で変数を使用する場合、変数は ['escape'と'quote'されます](https://github.com/google/zx/blob/3.1.0/README.md#command-) 。
それぞれの処理は [zx 内の `$.quote()`で実装されています](https://github.com/google/zx/blob/3.1.0/index.mjs#L285) 。
'escape'では変数をエスケープ文字にエンコードし、'quote' では [ANSI-C Quoting](http://www.gnu.org/software/bash/manual/html_node/ANSI_002dC-Quoting.html#ANSI_002dC-Quoting) するために変数を `$''` で囲みます。

```shell
% npx zx <<'EOF'
const newline = `
newline
`;
await $`echo ${newline}`;
EOF
$ echo $'\nnewline\n' # 👈 改行が \n にエスケープされて、$'' で変数が囲まれてる！

newline

```

zx は'quote'した変数を Shell に渡すために、js 上で quote 文字を渡しちゃだめってことですね。

#### `` $`command` `` 内で glob 記号, `~`を使わない

前述の escape 処理によって、 glob 記号, `~` も変数内で使えません。
代わりに zx が global に定義した `os`、`glob` を使います ([ref](https://github.com/google/zx/blob/3.1.0/docs/quotes.md#globbing-and-)) 。

```js
let files = await glob(os.homedir() + "/dev/**/*.md");
await $`ls ${files}`;
```

### 外部の js を import 出来る

名前の通り。

```js
import { oneVariables, oneFunction } from "./another-module.mjs";

console.log("他のmjsファイルの変数: ", oneVariables);
console.log("他のmjsファイルの関数(の結果): ", oneFunction());
```

## 私の活用方法 (markdown の js code block 内にスクリプトを書く)

個人的なスクリプトの辛みポイントとして「プロジェクト内のスクリプト(ShellScript) は読みにくい」があります。
原因はスクリプトを書く人・読む人の ShellScript の練度のばらつきが大きいことによるものだとは思いますが、慣れている言語で書けば解決するの？というと、そこまで劇的な改善は望めないような気がしています(主観)。

結局「スクリプトを説明する文書があるか・ないか」が大きくて、ShellScript でも Javascript でも、README.md に相当する文書がない限り「つら...😭」となる気がしています(主観)。

そこで、「文書が書きやすい(主観)Markdown で説明文を書きながら、文章に対応した code block 内の js を zx に実行させれば、辛みが軽減されるかも...?! (願望)」 という考えから、最近私が書くスクリプトは以下のような zx で実行させる markdown になっています。

````markdown
# DownloadZIP 👈 スクリプトの名前

## About 👈 スクリプトの説明を書く

### What's this script?

- zip ファイルをダウンロードして、hoge フォルダに展開するスクリプトです。
- refs
  - 超役に立つ参考 URL

### Usage 👈 使い方メモ

👇 js, bash 以外の code block は無視されるので、使い方も code block で表現出来る。
👇 v3.0 からの機能(嬉しい）

```
$ npx zx scripts/download-zip.md
```

## Implementation 👈 zx に実行させる js を書く

### Config 👈 設定的な変数

```js
const param = "書き換えたら使いまわせそうな値";
const downloadUrl = `https://hogehoge.com/services/${param}/file.zip`;
```

### Paths 👈 それ以外の処理前に定義できる変数 (あくまで、例）

```js
const projectRootPath = path.resolve(__dirname, "..");
const zipOutputPath = `${os.tmpdir()}/file.zip`;
const outputDirPath = path.resolve(projectRootPath, "hoge");
```

### Run 👈 メインの処理

#### fetch zip file 👈 ちょっと細かすぎるけれど、説明用に code block を分割してる

```js
const res = await fetch(downloadApiUrl);
fs.writeFileSync(zipOutputPath, Buffer.from(await res.arrayBuffer()));
```

#### unzip and put files 👈 ちょっと細かすぎるけれど(2)

```js
👇 インラインでコメント入れると更に優しい世界
// -p Create intermediate directories as required
await $`mkdir -p ${outputDirPath}`;

// -q quiet mode
// -o overwrite files WITHOUT prompting
await $`unzip -q -o ${zipOutputPath} -d ${outputDirPath}`;
```
````

---

これを書き始めたころの僕「なんで 🐚 なんだろう...🤔」

今の僕「は！ Shell か...！」
