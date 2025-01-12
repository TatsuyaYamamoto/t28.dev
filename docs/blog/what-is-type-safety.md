---
title: "TypeScript における型安全性 (type safety) とはなにか"
date: 2024-12-31
---

「TypeScript とは (定義)」については以前の拙著 ("[TypeScript/JavaScript ができるってつまり何ができるの？](./meaning-of-have-typescript-or-javascript-skills)") で腹落ちしましたが、
今度は「型安全性 (type safety)」が気になってきました。

TypeScript で開発をしていると必ずと言っていいほど[^1]出てくる「型安全性」について、改めて説明しようとすると案外難しい。
wiki を参考にすると「値の種類に従ってプログラムを正しく実行できる」と「型安全性がある」と言えるようです。

> 「値の種類」が型（データ型）である。
>
> ref: [型システム - 型とは](https://ja.wikipedia.org/wiki/%E5%9E%8B%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0)

> 一般的に型安全性とは、データ（オブジェクト）の**本来の型に従ってプログラムを正しく実行できる**性質のことを指す。
> 前述のように型安全性が具体的にどのようなものであるかは**プログラミング言語や文脈に依存する**。
>
> ref: [型システム - 型の安全性](https://ja.wikipedia.org/wiki/%E5%9E%8B%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0)

一方、TypeScript の文脈ではどうでしょうか？
[TypeScript は 静的型チェッカー](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html#typescript-a-static-type-checker) なので「`tsc` コマンドによる型チェックが通ったら型安全性がある」と言いたくもなりますが、
いくらなんでも乱暴な気がします (少なくとも、[any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any) や [compilerOptions](https://www.typescriptlang.org/tsconfig#compilerOptions) が頭を過ぎる)。

```ts
// tsc は通るかもだが、本当に安全...?
let one: number;
console.log(one * 2);
```

[TypeScript のドキュメントを検索する](https://www.google.com/search?q=site%3Awww.typescriptlang.org+%22type%22+%22safe%22)限りは型安全そのものについて説明するセクションは無いようなので、
ドキュメントを読みながら TypeScript における型安全について少し深ぼってみました。

## (型に限らない) 安全性

いきなり脱線しますが、型安全性の前に JIS ([JIS Z 8115:2019](https://kikakurui.com/z8/Z8115-2019-01.html)) の安全性の定義を調べておきます。

> 安全性 リスク源となるアイテム及びリスクを被る実体からなるシステムが，安全を保持し得る性質又は能力。

> 安全 許容できないリスクから免れている状態。

相変わらず難しい..。分かりやすさ優先で短くすると「リスクを許容できる範囲に収めている状態 (安全) の度合い」という感じでしょうか。

注記が興味深かったです。`考慮する範囲を限定する` ことに言及していて、まさにこの記事のテーマのように型に限定したい場合は型安全性と呼べる (定義外の造語ではない) ことが分かりました。

> 注記2 リスク源となるアイテム又はリスクを被る実体の名を冠して，安全性を考慮する範囲を限定することがある。
> 例）工作機械の安全性，照明器具の安全性，一次電池の安全性，子ども用衣料の安全性，環境安全性など。

JIS を参考にした型安全性は「型（データ型）におけるリスクを許容できる範囲に収めている状態の度合い」と言えそうです。

## Narrowing

[Get Started](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)、[Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) と順番にページを~~検索した~~読み進めた結果、
最初に `safe` の言及があったのは **[Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)** でした。

> ```ts
> function padLeft(padding: number | string, input: string): string {
>   if (typeof padding === "number") {
>     return " ".repeat(padding) + input;
>   }
>   return padding + input;
> }
> ```
>
> The idea is that TypeScript’s type system aims to make it as easy as possible to write typical JavaScript code without bending over backwards to get type safety.

短くすると「TypeScriptは典型的なJavaScriptコードで型安全性を確保する」という感じでしょうか。
`典型的なJavaScriptコード` とは、JavaScript の演算子として定義されている [`typeof`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/typeof)のことです。
また `型安全性を確保する` とは、型に従った処理を行うために `number`/`string` どちらの型もとりうる引数 `padding` に対して `typeof` 演算子で型を絞り込むことです。

逆に型安全性を確保して**いない**コードもページ内にあります。
`padding` の型が曖昧 (`number` または `string`) にも関わらず [`String.prototype.repeat()`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/repeat) を呼び出しているため、
TypeScript が警告を出しています。

> ```ts
> function padLeft(padding: number | string, input: string): string {
>   return " ".repeat(padding) + input;
> }
> ```

JavaScript のやっかいなところは[異なる型であっていい感じに処理をしてくれる](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#%E5%8B%95%E7%9A%84%E3%81%8B%E3%81%A4%E5%BC%B1%E3%81%84%E5%9E%8B%E4%BB%98%E3%81%91)ところです。
以下の例だと、JavaScript は文字列 "3.9"の整数部分を取り出して数字として扱います。

```js
"a".repeat("3.9"); // 'aaa' が出力されるけれど、3.9 回ってなに?
```

JavaScript の構文上は正しい(つまり実行できる)としても、`repeat()` の引数の仕様は[`0 から正の無限大までの間の整数`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/repeat#%E5%BC%95%E6%95%B0)です。
つまり本来期待したふるまい (文字列を繰り返す) のための入力 (繰り返す回数) になっていない場合、アプリケーションとしてはそもそも実行されるべきではありません。
TypeScript はそのようなコードに対して、型安全性がないとして警告を出します。

上記のことから TypeScript における型安全性とは「型が不一致な JavaScript の実行を検出する性質」ということになって...文章が型チェッカーそのものな感じになってしまった。
うーん...(腑に落ちていない)。
安全性の定義に合わせて、リスクや度合いの話をしたい...。

## `unknown` top type

TypeScript のドキュメント内で[検索した結果](https://www.google.com/search?q=site%3Awww.typescriptlang.org+%22type-safe%22) 、
**TypeScript 3.0 - [New `unknown` top type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type)** も参考になりました。

> `unknown` is the type-safe counterpart of `any`. Anything is assignable to `unknown`, but `unknown` isn’t assignable to anything but itself and `any` without a type assertion or a control flow based narrowing. Likewise, no operations are permitted on an `unknown` without first asserting or narrowing to a more specific type.

英文から翻訳・正確な理解が難しいですが、`unknown` と `any` は型安全の観点で対になるものです。
`unknown` は型の絞り込みをしなければ代入も操作も許されません。
一方 `any` は常に許可されます。

```ts
// 実態は、全部 number
let unknownValue: unknown = 0;
let anyValue: any = 0;
let numberValue = 0;

unknownValue = numberValue; // ✅ unknown に代入出来る
anyValue = numberValue; //.    ✅ any に代入出来る

numberValue = unknownValue; // 🔥 unknown を代入出来ない
numberValue = anyValue; //     ✅ any を代入出来る

unknownValue.toFixed(); // 🔥 unknown を操作出来ない
anyValue.toFixed(); // 　　 ✅ any を操作出来る
```

[別のページの `any` の説明](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any) を参考にすると、`any` は「**開発者が**コードに問題がないことを TypeScript に伝える」ための型と言えます。
言い換えると、

- `unknown` を使うと TypeScript が型安全性を確保する
- `any` を使うと人間が型安全を確保する

という感じでしょうか。

`any` によって TypeScript が検査しないコードが生まれることから、TypeScript における型安全性には「(実装によって) TypeScript がどこまで安全を担保するか」の考慮が必要なことが分かりました。
前述の `うーん...` のヒントになりそう。

## 厳密性

TypeScript は設定ファイル([tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html))によってふるまいのカスタマイズが出来るので、「型チェックを行わない `tsc` もありうる」ことを私は知っています。
例えば [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) が false のとき、TypeScript は null や undefined による実行時エラーの可能性に対して警告をしません。

```ts
// 変数の型は "null かも" だが、実態は "null のみ"
const nullableValue = true ? null : "non-null";

// strictNullChecks が false だと、 error にならない🔥
nullableValue.toString();
```

[型チェックの設定項目](https://www.typescriptlang.org/tsconfig#Type_Checking_6248) を TypeScript のドキュメント内では「ダイヤル」と表現しています。
このダイヤルを大きくするほど、より多くのチェックを TypeScript が行うようになります。
つまりTypeScript の型チェッカーは「チェックをするか、しないか」ではなく「どれぐらいチェックするか」を調整できるツールと言えます。

> These strictness settings turn static type-checking from a switch (either your code is checked or not) into something closer to a dial.

設定によって TypeScript が検査しないコードが生まれることから、前述の "[`unknown` top type](#unknown-top-type)" と同様に、TypeScript おける型安全性には「(設定によって) TypeScript でどこまで安全を担保するか」の考慮が必要なことが分かりました。

## 結論1 意味の整理

前述までの情報を整理します。

| 参考元             | 分かったこと                                                                                            |
| :----------------- | :------------------------------------------------------------------------------------------------------ |
| JIS                | 型安全性は「型システムにおけるリスクを許容できる範囲に収めている状態の度合い」と言えそう                |
| Narrowing          | TypeScript における型安全性とは「型が不一致な JavaScript の実行を検出する性質」と言えそう               |
| `unknown` top type | TypeScript における型安全性には「実装によって、 TypeScript がどこまで安全を担保するか」の考慮が必要そう |
| 厳密性             | TypeScript における型安全性には「設定によって、 TypeScript がどこまで安全を担保するか」の考慮が必要そう |

### TypeScript におけるリスクとは

```
型が不一致の JavaScript コードの実行によって、不具合を引き起こす可能性
```

### TypeScript におけるリスクを許容できる範囲とは

```
TypeScript が警告しないコードの範囲。
この範囲は tsconfig.json の設定や`any` 等の型の実装によって決まる。
```

### TypeScript における型安全性とは

```
型不一致による不具合 (型システムにおけるリスク) を
TypeScript が警告しない範囲 (許容できる範囲) に収めている状態の度合い
```

「TypeScript が警告しない範囲に収めている状態」というのは「`tsc` コマンドでエラーを出さない状態」と言える。
つまり度合いの観点で注目するべきポイントは、収まるかどうかよりも、収める範囲の方のはず。
TypeScript が警告する範囲は設定と実装で決まるので、もっと短くすると

```
TypeScript が警告するコードの範囲を決める、設定・実装
```

と表現出来そう。

## 結論2 考え方の整理

元々乱暴だと思っていた「`tsc` が成功したら型安全がある」という表現は間違ってはいない。なぜなら「設定と実装が決めたリスクの許容範囲において安全性が担保出来ていることを tsc が保証している」と言えるから。

また、設定・実装によってリスクを許容する範囲に幅があるため、安全性を度合いで表現できることが分かった:

- 設定・実装が厳しくて型安全性が高い (不具合を引き起こしにくい)
- 設定・実装が緩いから型安全性が低い (不具合を引き起こしやすい)

[^1]: ただし、筆者の主観
