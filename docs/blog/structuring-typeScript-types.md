---
title: "TypeScript の primitive/non-primitive type を構造的に整理する"
date: 2025-07-07
---

「TypeScript の型の種類と関係・構造が分からん...」ってなったので、ドキュメントとプレイグラウンドを使いながら整理していく。
例えば「`object` と `{}` の違いが分かるか？」って話。

## JavaScript のプリミティブ型・オブジェクト型

[TypeScript は JavaScript の Typed Superset](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html#:~:text=Try-,A%20Typed%20Superset%20of%20JavaScript,-How%20does%20TypeScript) なので、まずは JavaScript の型に注目する。

> 7 種類のプリミティブデータ型があります。
>
> ref: [MDN - Primitive (プリミティブ)](https://developer.mozilla.org/ja/docs/Glossary/Primitive#:~:text=%E3%81%AE%E3%81%93%E3%81%A8%E3%81%A7%E3%81%99%E3%80%82-,7%20%E7%A8%AE%E9%A1%9E%E3%81%AE%E3%83%97%E3%83%AA%E3%83%9F%E3%83%86%E3%82%A3%E3%83%96%E3%83%87%E3%83%BC%E3%82%BF%E5%9E%8B,-%E3%81%8C%E3%81%82%E3%82%8A%E3%81%BE%E3%81%99)

> **他のすべてのもの**はオブジェクト型と呼ばれます。
>
> ref: [MDN - JavaScript のデータ型とデータ構造 - オブジェクト](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Language_overview#:~:text=%E3%82%92%E7%A4%BA%E3%81%97%E3%81%BE%E3%81%99%E3%80%82-,%E4%BB%96%E3%81%AE%E3%81%99%E3%81%B9%E3%81%A6%E3%81%AE%E3%82%82%E3%81%AE,-%E3%81%AF%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E5%9E%8B)

MDN の情報から JavaScript のデータ型は以下のように分類できる。

- JavaScript のデータ型
  - プリミティブ型
    - Null 型
    - Undefined 型
    - 論理型 ([`Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean))
    - 数値型 ([`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number))
    - 長整数型 ([`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt))
    - 文字列型 ([`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))
    - シンボル型 ([`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol))
  - オブジェクト型 [^1]

## JavaScript のラッパーオブジェクト

JavaScript において[^2]　のプリミティブ型とは、プロパティを持たないデータのことを指す。

> a primitive (primitive value, primitive data type) is data that is not an object and **has no methods or properties**.
>
> ref: [MDN - Primitive (プリミティブ)](https://developer.mozilla.org/ja/docs/Glossary/Primitive)

「プロパティを持たないデータ」とあるが、JavaScript は文字列に対して `"hoge".split("og")` のようにメソッドを呼び出すことができる。
これは**ラッパーオブジェクトのプロパティ**にアクセスすることで実現している。
プリミティブ値のプロパティにアクセスすると JavaScript はプリミティブの型に対応したラッパーオブジェクト (文字列の場合は [`String`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String)) でラップ ([`auto-box`](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#:~:text=on%20primitives%2C%20JavaScript-,auto%2Dboxes,-the%20value%20into)) して、
そのオブジェクトのメソッド (値として関数を持つプロパティ) を呼び出している。
各プリミティブ型に対応したラッパーオブジェクトが存在するが、 [**`null` と `undefined` にはない**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures#primitive_values)。

## TypeScript のプリミティブ型・非プリミティブ型

TypeScript においてもっとも広い型 (もっとも値を受け入れられる型) は
[任意の値を割り当てられる](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type:~:text=of%20any.-,Anything%20is%20assignable%20to%20unknown,-%2C%20but%20unknown%20isn%E2%80%99t)
`any` または `unknown` と言える。
`unknwon` を `typeof value === "object"` で narrowing すると、以下に分類される([playground](https://www.typescriptlang.org/play/?#code/MYewdgzgLgBAbgQwDYFcCmAuGKwGswgDuYMAvDAN4C+A3AFB0CWAZjABRQCeADmiK4lRoypcgCIQAIwBWaYFDEBKSnRjxk6emoD02mAD0A-HSow0SCMIqr1QrTF0HjVOkA))。

- `object` | `null`
- `{}` | `undefined`

```typescript
const value: unknown = {};

if (typeof value === "object") {
  value;
  // ^? const value: object | null
} else {
  value;
  // ^? const value: {} | undefined
}
```

`object` は [non-primitive を表現する型](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#:~:text=that%20represents%20the-,non%2Dprimitive,-type%2C%20i.e)。
そのため、さらに `typeof value === "string"` で narrowing すると `never` 型になる ([playground](https://www.typescriptlang.org/play/?#code/MYewdgzgLgBAbgQwDYFcCmAuGKwGswgDuYMAvDAN4C+A3AFB0CWAZjABRQCeADmiK4lRoypcgCIQAIwBWaYFDEBKSnRgwWHHnwHJ0I0mOgAnRmADmSlWrWD09NQHoHMAHoB+VTCp1vQA))。

```typescript
const value: unknown = {};

if (typeof value === "object") {
  if (typeof value === "string") {
    value;
    // ^? const value: never
  }
}
```

`null` は `typeof` では `"object"` になる [^3] が、[TypeScript としても](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined)、[JavaScript としても](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/null) プリミティブ型。
これらを考慮すると以下のように書ける。

- プリミティブ？ (`{}` | `null` | `undefined`)
- 非プリミティブ (`object`)

...`{}` ってオブジェクトじゃん...？

## `{}` 型

`{}` は `null` と `undefined` 以外の任意の型を表す [^4]。
では `null` と `undefined` は何？という話だが、前述の通り、 「ラッパーオブジェクトがないプリミティブ型」であり、プロパティにアクセス出来ない型と言い換えることもできる。
つまり、`{}` 型は「任意のプロパティを持ちうる型」とも言える。

`{}` は明示的なプロパティを持たないので、任意のプロパティを持ちうるオブジェクトを受け入れられる。

([playground](https://www.typescriptlang.org/play/?#code/DYUwLgBCC2AOYE8BcEDeBfA3AKBvBEAvGlhAPRkRXU2Cg5LnIkWhABYD2A5iCgIwSkKEenibFemcpRozhDfMwDKCaACN2wABQBKSUOojGBYgDsArsGB7pswDLk8sRDMmAJiABmASxMgX16vbYQoBwZoBcnoAhboDWDIDrDIC3DICLDIBjDIDFDIBJDICAxoAmDIDR6oD2DICADICa8oAQUYBWDHFJaemAZgylgCIM2KCQJuwmAKJGKKgQ7macAIZ8Ajgt7UbMGP6yAdijHQrE3RzcQ4KU9nPj4lPTVBut847Kaho6OxD7YwsQ5pbnNJeHxk6uHt6+O-ZAA))

```typescript
// 任意のプロパティを持ちうる形なので、オブジェクトを受け入れられる。
let empty: {};
empty = {}; //          ✅
empty = { hoge: 1 }; // ✅
empty = 1; //           ✅
empty = Symbol(); //    ✅
empty = null; //        ❌
empty = undefined;

// 明示的にプロパティを持つ型は、余計なプロパティを持てない
let nonEmpty: { fuga: 1 };
nonEmpty = {}; //          ❌
nonEmpty = { hoge: 1 }; // ❌
nonEmpty = 1; //           ❌
nonEmpty = Symbol(); //    ❌
nonEmpty = null; //        ❌
nonEmpty = undefined; //   ❌
```

任意の型なので、`{}` に対してプリミティブ型で narrowing しても else block で never 型を作ることが出来ない。

```typescript
const value = {} as unknown;

if (typeof value !== "object") {
  value;
  // ^? const value: {} | undefined

  if (
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "bigint" ||
    typeof value === "boolean" ||
    typeof value === "symbol"
  ) {
    value;
    // ^? const value: string | number | bigint | boolean | symbol | undefined
  } else {
    value;
    // ^? const value: {} 👈️🤔
  }
}
```

[^1]: オブジェクト型に属する型の一覧をここに書くことはやめる。[標準組み込みオブジェクト](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects) など、種類が多すぎる。

[^2]: 他の言語も同じようなものかもしれないが、この記事を書くにあたって調べていない。

[^3]: `typeof null === "object";` になるのは、JavaScript の初期の実装に基づいている ([参考](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null))

[^4]: `{}` 型の定義・説明を TypeScript のドキュメントから見つけられないので、[contributor の issueComment](https://github.com/microsoft/TypeScript/issues/48988#issuecomment-1119513519) と [typescript-eslint](https://typescript-eslint.io/rules/no-empty-object-type/#:~:text=any%20value%20that%20is%20defined) を参考にする。
