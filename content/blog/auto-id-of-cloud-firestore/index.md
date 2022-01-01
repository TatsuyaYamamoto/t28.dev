---
title: "Cloud Firestore の AutoId について、実装・組合せ・衝突確率をちょっと掘る"
date: 2021-12-11
---

Cloud Firestore に新しいドキュメントを追加するときに SDK が自動で作成してくれる ID について調べたメモ。

```js
const colRef = collection(db, "school-idols");
const docRef = await addDoc(colRef, { name: "Minami Kotori" });

// 👇 作成されたドキュメントのID
console.log("Doc ID: ", docRef.id);
```

```js
const newIdolDocRef = doc(collection(db, "school-idols"));

// 👇 ドキュメントの参照のID
console.log("Doc ID: ", newIdolDocRef.id);
```

## 実装を見る

ID 生成は、[firebase-js-sdk#doc() で呼び出している `AutoId.newId()`](https://github.com/firebase/firebase-js-sdk/blob/firebase%409.6.1/packages/firestore/src/lite-api/reference.ts#L501) で行っている。

### AutoId.newId()

ref: [firebase@9.6.1 - misc.ts](https://github.com/firebase/firebase-js-sdk/blob/firebase%409.6.1/packages/firestore/src/util/misc.ts)

```ts
class AutoId {
  static newId(): string {
    // 👇 ID に使う文字は英数字 (62 種類)
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // 👇 256未満の範囲の、chars.lengthの最大倍数を取得する
    // このあと取得する乱数は0以上256未満の整数で、剰余演算を使ってchars中から文字を決定する
    // chars.lengthの倍数ではない数字で計算を行うと、余りの数だけ文字に偏りが生じてしまう
    const maxMultiple = Math.floor(256 / chars.length) * chars.length;

    debugAssert(
      0 < maxMultiple && maxMultiple < 256,
      `Expect maxMultiple to be (0, 256), but got ${maxMultiple}`
    );

    let autoId = "";
    const targetLength = 20;

    // 👇 targetLength (20文字) 分、乱数で文字を取得する
    while (autoId.length < targetLength) {
      // 👇 40bytes 分の乱数(0以上256未満の整数が40個入った配列)を取得する
      // 乱数の詳細は後述
      const bytes = randomBytes(40);
      // 👇 取得した乱数(1つずつ)を使って
      for (let i = 0; i < bytes.length; ++i) {
        // 👇 maxMultiple 未満の乱数のみを使う
        if (autoId.length < targetLength && bytes[i] < maxMultiple) {
          // 👇 剰余演算で、乱数とcharsから使う文字を決定する
          autoId += chars.charAt(bytes[i] % chars.length);
        }
      }
    }

    // 👇 targetLength (20文字) を満たしているかチェック
    // どういうケースで例外的にwhile loopを抜けちゃうんだろう...? 🤔
    debugAssert(autoId.length === targetLength, "Invalid auto ID: " + autoId);

    return autoId;
  }
}
```

### randomBytes()

乱数を取得するための`randomBytes()`は SDK が対象にしている[プラットフォーム毎に実装が切り替わる](https://github.com/firebase/firebase-js-sdk/blob/firebase%409.6.1/packages/firestore/src/platform/random_bytes.ts#L29-L31) 。

ブラウザー向けは [platform/browser/random_bytes.ts](https://github.com/firebase/firebase-js-sdk/blob/firebase%409.6.1/packages/firestore/src/platform/browser/random_bytes.ts) 。

```ts
export function randomBytes(nBytes: number): Uint8Array {
  debugAssert(nBytes >= 0, `Expecting non-negative nBytes, got: ${nBytes}`);

  const crypto =
    typeof self !== "undefined" && (self.crypto || (self as any)["msCrypto"]);
  const bytes = new Uint8Array(nBytes);

  if (crypto && typeof crypto.getRandomValues === "function") {
    // 👇 Crypto が実行できる環境ならば、crypto.getRandomValuesで 8 ビット符号なし整数値
    // crypto.getRandomValuesで 8 ビット符号なし整数値 (0~255) を 取得する
    crypto.getRandomValues(bytes);
  } else {
    // 👇 出来ない場合、Math.random()で作成する
    for (let i = 0; i < nBytes; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytes;
}
```

## 値の組合せ

`AutoId.newId` で取得できる文字列にどれぐらいの組合せがあるか、(とりあえず)UUID で比較してみる。

### UUID v4

[UUID v4 は 122bit でランダムな値を作っている](https://ja.wikipedia.org/wiki/UUID) ので、0 が 36 個通り。

```
uuid v4
> 2**122
< 5.316911983139664e+36
```

### AutoId.newId

一方、`AutoId.newId` は 62 種類の文字を 20 個並べるため、0 が 35 個通り。

```
AutoId.newId
> 62**20
< 7.044234255469981e+35
```

0 が 1 個違う(UUID の方が組合せが多い)けれど、35 と 36 の違い...。

## 衝突確率の比較

[誕生日攻撃(wiki)](https://ja.wikipedia.org/wiki/%E8%AA%95%E7%94%9F%E6%97%A5%E6%94%BB%E6%92%83) を参考に

> 最初の衝突が発生するまでに行わなければならない試行回数

を比較してみる。

```
uuid v4
> Math.sqrt((Math.PI/2) * 2**122)
< 2889945641877637600 => 約 2.8e+18

AutoId.newId
> Math.sqrt((Math.PI/2) * 62**20)
< 1051905760682725200 => 約 1.0e+18
```

衝突確率(超ざっくり)は **倍以上違う**とも言えるし、**桁は同じ** とも言える。

## つまり

Firestore が作成する ID は

- 乱数で作成した英数字 20 文字の文字列
- 乱数は ブラウザーの場合、`crypto.getRandomValues()` か `Math.random()` で生成される
  - ID のばらつきはこれらの API に依存する
- 組合せは UUID より少ない
  - ただし、0 が 36 個か 35 個かの違い
- 衝突確率は UUID の方が低い
  - ただし、上一桁が 2 か 1 の違いで、桁(e+18)は同じ

## 余談

`AutoId.newId`による ID が何故 20 文字なのかは、Issues/PR を漁ったけれど分からなかった。仮に 21 文字にした場合の組合せは

```
> 62**21
< 4.367425238391388e+37
```

なので、組合せの数の関係は`AutoId.newId 20 文字 < UUID v4 < AutoId.newId 21 文字` という感じになる。

「UUID v4 と同じくらいの組合せを稼げて、計算コストも考慮して、20 文字」ってなったのかなぁ...🤔
