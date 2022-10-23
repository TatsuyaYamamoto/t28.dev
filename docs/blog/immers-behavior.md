---
title: "Immer の immutableっぷりを表面上だけ見る"
date: 2022-04-17
---

[Immer](https://immerjs.github.io/immer/) で変更を加えたオブジェクトがどのような状態になっているかを確認したくなったので、メモ。

Immutable なんだから変更対象のオブジェクトを直接変更せずに新しいオブジェクトを作って変更するんだよ！って話でもあるし、公式ドキュメントから参照されているブログ記事を読めば良い話でもある。

ref: [Introducing Immer: Immutability the easy way](https://medium.com/hackernoon/introducing-immer-immutability-the-easy-way-9d73d8f71cb3)

```
source
↓
[edit with immer]
↓
withNativeSpread/withImmer 👈 こいつがどんな感じか
```

## 何も変えない

```js
const { produce } = require("immer");

const source = {
  primitive: "1",
  obj: { name: "1-1" },
  arr: [{ name: "1-[1]" }, { name: "1-[2]" }],
};

const withNativeSpread = { ...source };
const withImmer = produce(source, (draft) => {});

console.log(source === withNativeSpread); // 💡 false
console.log(source === withImmer); // true

console.log(source.primitive === withNativeSpread.primitive); // true
console.log(source.primitive === withImmer.primitive); // true

console.log(source.obj === withNativeSpread.obj); // true
console.log(source.obj === withImmer.obj); // true

console.log(source.obj.name === withNativeSpread.obj.name); // true
console.log(source.obj.name === withImmer.obj.name); // true

console.log(source.arr === withNativeSpread.arr); // true
console.log(source.arr === withImmer.arr); // true

console.log(source.arr[0] === withNativeSpread.arr[0]); // true
console.log(source.arr[0] === withImmer.arr[0]); // true

console.log(source.arr[0].name === withNativeSpread.arr[0].name); // true
console.log(source.arr[0].name === withImmer.arr[0].name); // true

console.log(source.arr[1] === withNativeSpread.arr[1]); // true
console.log(source.arr[1] === withImmer.arr[1]); // true

console.log(source.arr[1].name === withNativeSpread.arr[1].name); // true
console.log(source.arr[1].name === withImmer.arr[1].name); // true
```

## プリミティブなプロパティを変更する

```js
const { produce } = require("immer");

const source = {
  primitive: "1",
  obj: { name: "1-1" },
  arr: [{ name: "1-[1]" }, { name: "1-[2]" }],
};

const withNativeSpread = { ...source, primitive: "changed" };
const withImmer = produce(source, (draft) => {
  draft.primitive = "changed";
});

console.log(source === withNativeSpread); // 💡 false
console.log(source === withImmer); // 💡 false

console.log(source.primitive === withNativeSpread.primitive); // 💡 false
console.log(source.primitive === withImmer.primitive); // 💡 false

console.log(source.obj === withNativeSpread.obj); // true
console.log(source.obj === withImmer.obj); // true

console.log(source.obj.name === withNativeSpread.obj.name); // true
console.log(source.obj.name === withImmer.obj.name); // true

console.log(source.arr === withNativeSpread.arr); // true
console.log(source.arr === withImmer.arr); // true

console.log(source.arr[0] === withNativeSpread.arr[0]); // true
console.log(source.arr[0] === withImmer.arr[0]); // true

console.log(source.arr[0].name === withNativeSpread.arr[0].name); // true
console.log(source.arr[0].name === withImmer.arr[0].name); // true

console.log(source.arr[1] === withNativeSpread.arr[1]); // true
console.log(source.arr[1] === withImmer.arr[1]); // true

console.log(source.arr[1].name === withNativeSpread.arr[1].name); // true
console.log(source.arr[1].name === withImmer.arr[1].name); // true
```

## ネストされたオブジェクト内のプリミティブなプロパティを変更する

```js
const { produce } = require("immer");

const source = {
  primitive: "1",
  obj: { name: "1-1" },
  arr: [{ name: "1-[1]" }, { name: "1-[2]" }],
};

const withNativeSpread = { ...source, obj: { ...source.obj, name: "changed" } };
const withImmer = produce(source, (draft) => {
  draft.obj.name = "changed";
});

console.log(source === withNativeSpread); // 💡 false
console.log(source === withImmer); // 💡 false

console.log(source.primitive === withNativeSpread.primitive); // true
console.log(source.primitive === withImmer.primitive); // true

console.log(source.obj === withNativeSpread.obj); // 💡 false
console.log(source.obj === withImmer.obj); // 💡 false

console.log(source.obj.name === withNativeSpread.obj.name); // 💡 false
console.log(source.obj.name === withImmer.obj.name); // 💡 false

console.log(source.arr === withNativeSpread.arr); // true
console.log(source.arr === withImmer.arr); // true

console.log(source.arr[0] === withNativeSpread.arr[0]); // true
console.log(source.arr[0] === withImmer.arr[0]); // true

console.log(source.arr[0].name === withNativeSpread.arr[0].name); // true
console.log(source.arr[0].name === withImmer.arr[0].name); // true

console.log(source.arr[1] === withNativeSpread.arr[1]); // true
console.log(source.arr[1] === withImmer.arr[1]); // true

console.log(source.arr[1].name === withNativeSpread.arr[1].name); // true
console.log(source.arr[1].name === withImmer.arr[1].name); // true
```

## ネストされた配列内のオブジェクトのプリミティブなプロパティを変更する

```js
const { produce } = require("immer");

const source = {
  primitive: "1",
  obj: { name: "1-1" },
  arr: [{ name: "1-[1]" }, { name: "1-[2]" }],
};

const withNativeSpread = { ...source, arr: [...source.arr] };
withNativeSpread.arr[0] = {
  ...source.arr[0],
  name: "changed",
};
const withImmer = produce(source, (draft) => {
  draft.arr[0].name = "changed";
});

console.log(source === withNativeSpread); // 💡 false
console.log(source === withImmer); // 💡 false

console.log(source.primitive === withNativeSpread.primitive); // true
console.log(source.primitive === withImmer.primitive); // true

console.log(source.obj === withNativeSpread.obj); // true
console.log(source.obj === withImmer.obj); // true

console.log(source.obj.name === withNativeSpread.obj.name); // true
console.log(source.obj.name === withImmer.obj.name); // true

console.log(source.arr === withNativeSpread.arr); // 💡 false
console.log(source.arr === withImmer.arr); // 💡 false

console.log(source.arr[0] === withNativeSpread.arr[0]); // 💡 false
console.log(source.arr[0] === withImmer.arr[0]); // 💡 false

console.log(source.arr[0].name === withNativeSpread.arr[0].name); // 💡 false
console.log(source.arr[0].name === withImmer.arr[0].name); // 💡 false

console.log(source.arr[1] === withNativeSpread.arr[1]); // true
console.log(source.arr[1] === withImmer.arr[1]); // true

console.log(source.arr[1].name === withNativeSpread.arr[1].name); // true
console.log(source.arr[1].name === withImmer.arr[1].name); // true
```
