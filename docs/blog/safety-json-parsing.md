---
title: "TypeScript だけで安全に JSON 文字列内の値を読み取る"
date: 2024-03-19
---

TypeScript で JSON 文字列をパースする記事は多々あれど、[Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) で値を読み取る記事がなかったので...。

## JavaScript で JSON 文字列をパースする

この記事における[^1]「JavaScript で JSON 文字列をパースする」とは、[JavaScript Object Notation (JSON)](https://developer.mozilla.org/ja/docs/Glossary/JSON) 形式で書かれた文字列をJavaScript の標準組み込みオブジェクト([`JSON`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON))が持つ静的メソッド([`JSON.parse()`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse))で構文解析して JavaScript オブジェクトを取得することです。

```ts
const jsonText = `
{
  "name": "Minami Kotori"
}
`;

const jsObject = JSON.parse(jsonText);
console.log(jsObject.name); // Minami Kotori
```

## TypeScript における `JSON.parse()`

TypeScript が提供している型宣言ファイル上は、`JSON.parse()` の[戻り値の型は **`any`**](https://github.com/microsoft/TypeScript/blob/v5.3.3/src/lib/es5.d.ts#L1143) です。
つまり、パースされた JavaScript オブジェクトは JSON 文字列に書かれていないデータも含めて任意のデータへアクセス出来ます。
ただし、TypeScript 上での型エラーが出ないだけであり、JavaScript 上での実行時エラーが発生する可能性はあります。危ない。

```ts
const jsonText = `
{
  "name": "Minami Kotori"
}
`;

const jsObject = JSON.parse(jsonText);

// ⚠️ favoriteFood プロパティは存在しないが、any 型なので TypeScript はエラーを出さない
// JavaScript 上もエラーが出ない
console.log(jsObject.favoriteFood); // undefined

// 🔥 school プロパティが存在しないが、any 型なので TypeScript はエラーを出さない
// undefined の name プロパティにアクセスしようとするので、JavaScript 上で実行時エラーが発生する ☠️
console.log(jsObject.school.name); // Uncaught TypeError: Cannot read properties of undefined (reading 'name')
```

安全に値を読み取るためには、`JSON.parse()` の戻り値を`any`型以外にする必要があります。

## `JSON.parse()` が本当に返すもの

`JSON.parse()` の戻り値の型は仕様で定義されています。

> Object, Array, 文字列, 数値, 論理値, null 値のいずれかで、指定された JSON の text に対応する値です。
>
> ref: [MDN - JSON.parse()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#%E8%BF%94%E5%80%A4)

```ts
console.log(JSON.parse("{}")); //     {}
console.log(JSON.parse("[]")); //     []
console.log(JSON.parse('"hoge"')); // "hoge"
console.log(JSON.parse("1")); //      1
console.log(JSON.parse("true")); //   true
console.log(JSON.parse("null")); //   null
```

これに従った変数宣言時に型アノテーションを書くとしたら...👇

```ts
const jsObject:
  | object //    オブジェクトか
  | unknown[] // なにかの配列か (配列はオブジェクトの一種だけれど)
  | string //    文字列か
  | number //    数値か
  | boolean //   論理値か
  | null /* または、null */ = JSON.parse(jsonText);
```

こんなん、実質 👇 じゃん。

```ts
const jsObject: unknown /* 型分からん */ = JSON.parse(jsonText);
```

型が分からない値は `uknown` 型にします。
型が分からないまま特定の型を期待した使用 (プロパティにアクセスしたり、関数の引数に渡したり) をさせない状態が、安全です。

## Narrowing する

`unknown` な値に安全にアクセスするために、より具体的な型に絞り込んだ上で ([Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)) 期待するプロパティにアクセスします。

[Playground](https://www.typescriptlang.org/play/?#code/MYewdgzgLgBAVhcAVApgD1gXhgAwFADeeMMARGAIYC2KpAXGQLICWlVzMA0iFCAE7NSeAL54cAbjx4A9NJiBLBkDJDICsGQNHqgaQZAfgyADBkBgSusCRDMsAiDHlCRYCAPIAjOCmBQGAVzABrMCADuYGNgBSAMpWAHIAdAAOFHwQKAAUCMjoUACUknjMAGYwccQwsvAQtvaOMIAyDDBgzgA21TCAp3KAaJqAdgwwIHYOsIDmDHlQAJ4RKCDZ1h2lmBNk7SVQpDAAZPN5ozMwAISTVbULSyQF6oAmDICADCud5ZU1dU2t02etEMAAFiAgdYDrDIC3DICLDIBjDIDFDIAkhkAgMaAYwZAGYMxjBeVID2erzmrEKxTOi16AyGIyKYygYVhLzqE2wpFujjmqJIp0cuKe+PWm0uOzyBUpOLxr3O0AEYAA5jBVK02CgYJ9foDQRDANEM0MFCN8LOpcLq5Jg-UGwyR2IV+LCgr8kxhUC53KEKRgRD2cjCVsAFgzGQBiDIBlBmtZX04MAuEqAQIYwYBI7UAFoqAawYNTMta8ddQhQDAEPKgHNHQCaDBKnWVAF+KgFNzKUkcyIaooMLVEDchJY4Ns6phmhpERAA)

```ts
const jsonText = `
{
  "name": "Minami Kotori"
}
`;

// どんな型かまだ分からない
const jsObject: unknown = JSON.parse(jsonText);

if (
  // jsObject が null 以外の object で
  typeof jsObject === "object" &&
  jsObject !== null &&
  // かつ、jsObject が null 以外の object の school プロパティを持っていて
  "school" in jsObject &&
  typeof jsObject.school === "object" &&
  jsObject.school !== null &&
  // jsObject.school が string 型の name プロパティを持っている
  "name" in jsObject.school &&
  typeof jsObject.school.name === "string"
) {
  // ...ということが分かって初めて安全に jsObject.school.name を参照することが出来る
  console.log(jsObject.school.name);
}
```

## そもそも JSON 文字列かどうかも怪しい

構文解析に失敗すると、`JSON.parse()` は[`SyntaxError` を throw します](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#%E4%BE%8B%E5%A4%96)。
そのため構文解析が成功する前提の実装 (`const json: unknown = JSON.parse(jsonText);`) だと、まだ安全ではありません。

[Playground](https://www.typescriptlang.org/play/?#code/PTAECkEMDdIZQMYCcCWAHALqQdgyCqGQawyAdDIOUMg9QyATDIBYMg6gyBmDIPYMgxtbWAiDIIoMgMQyCWDIIAM4cAeQByoQOGmgdW1A6Eo0GgWDlGAKAQB7AHYBnLACt1agCoBTAB5YAvKAAGCgN4LQoVZAC2BgFygARAFkUjpylAAaWUMZVQPBQBfBQsAbgUFEFBAXg3AUl3QQGnLUUBjyMAE80BrBkBGTUB1UzpACoZAS4ZAH4ZAGQZQDAALJGUAd1BAVQYOQGiGJTVNUB01dwBXVQBrVVbVUHN+YQA6NEgkdQMACkHVQxMASligA)

```ts
// JavaScript のオブジェクトとしては正しいけれど、JSON 文字列としては不正
const jsonText = `
{
  name: "Minami Kotori"
}
`;

// 🔥 構文解析に失敗してエラーが throw される
const json: unknown = JSON.parse(jsonText);
```

`JSON.parse()` の引数は string 型なので、構文解析が失敗する値が渡される可能性も十分考えられます。そこで、 `JSON.parse()` を try/catch して必ず return する関数を実装してみます[^2]。

パース時点では必ず `unknown` な値を取得出来るので、

- JSON 文字列をパース出来たか
- JSON 文字列内に期待のデータが入っているか

を Narrowing で検証すれば、安全です。

[Playground](https://www.typescriptlang.org/play/?#code/MYewdgzgLgBADgQwE4QKYCkLhgXhgCilQA8oAuGaJASzAHMBKCgVzAGswQB3MXAPhgBvAFAwYUJAE8hosTCSoozJL3QBlAPIA5AHSIUqQiSgMA3LIC+MYAijAAFjLnzFysObEXhF88NCRYACssMAAVY1wYAANhETEwBABbVAoAIgBZWiTqGABpECgQGlTvYSjfAHoK6ODwcNIomEAZBkBVeUBzBkAhBkAYhkBABhhWDm5eQCsGQBIFQCSGQHXlQEUGQDXlQGiGP3BoGFrePH00THB8NfqTUyA)

```ts
const parseJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return;
  }
};

const jsonText = `
{
  name: "Minami Kotori"
}
`;

// `jsonText` が何であれ、 unknown な値を受け取る
const json = parseJson(jsonText);
```

## 結論

「TypeScript だけで安全に JSON 文字列内の値を読み取る」ためには、

- try/catch で構文解析失敗を考慮しつつ
- 戻り値の型を `any` から `unknown` に変更した上で
- Narrowing する

必要があります。

## (余談) その他の方法

### 型アノテーション/アサーションで安全にはならない

期待する型を予め定義して型アノテーション/アサーションで `any` を上書きする方法を紹介する記事が Web 上にはありますが、ちょっと便利になるだけで安全にはならないです。
むしろ嘘の可能性も考慮するとより危険になっているので、不便になっているとも言える[^3]。

下記を見る限り、ちょっと便利になっている気がしなくもない。

```ts
// 👇 の構造の JSON 文字列を期待している
interface SchoolIdol {
  name: string;
  school: {
    name: string;
  };
}
const jsonText = `{}`;

const jsObject: SchoolIdol = JSON.parse(jsonText);
// const jsObject = JSON.parse(jsonText) as SchoolIdol;

// ✨ SchoolIdol 型に favoriteFood プロパティはないので、TypeSciprt 上でエラーが発生する
console.log(jsObject.favoriteFood); // Property 'favoriteFood' does not exist on type 'SchoolIdol'.

// ✨ SchoolIdol 型に従って、school.name にアクセス出来る
console.log(json.school.name);
```

しかし上記 `jsonText` の値は記事の都合で省略されているのではなく、本当に `{}` になっているとしたらどうでしょう？

```ts
const jsonText = `{}`;

const jsObject: SchoolIdol = JSON.parse(jsonText);

// 🔥 school プロパティが存在しないが、any 型なので TypeScript はエラーを出さない
// undefined の name プロパティにアクセスしようとするので、JavaScript 上で実行時エラーが発生する ☠️
console.log(jsObject.school.name); // Uncaught TypeError: Cannot read properties of undefined (reading 'name')
```

### `JSON` 型にキャストする

`JSON.parse()` の戻り値の型は全く分からない訳ではなく、正確には JSON の型ではあります。そこで JSON 型を TypeScript で作って(参考: [type-fest](https://github.com/sindresorhus/type-fest/blob/main/source/basic.d.ts)) 戻り値の型を上書きする方法もあります。

```ts
interface JSON {} // 省略

const parseJson = (text: string): JSON => {
  return JSON.parse(text);
};
```

だだしプロパティにアクセスするために Narrowing することに変わりはないので、`unknown` を使うパターンと違いがない...。

### ライブラリを使う

https://zod.dev とか、https://valibot.dev とかあるけれど、実装規模を考慮した上で依存関係の追加を検討したいですね。

[^1]: `eval('var hoge = {"fuga": "piyo"}')` ってする方法もあるけれど、使って良いという意味ではない。
[^2]: 要件によってはそのまま throw しちゃっても良いと思う。
[^3]: 嘘の可能性がない (JSON 文字列の内容が保証されている) 場合もあるので、一概には言えない...という保身コメント。
