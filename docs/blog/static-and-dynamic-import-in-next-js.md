---
title: "Next.js 13 (webpack) の static import, dynamic import のふるまいを実験する"
date: 2023-04-04
---

## なにこれ

👊😁「Dynamic import したモジュール (または、その中の値) はいい感じに code-splitting されるだろ」<br/>
✌️😁「ESM で dynamic/static import してるんだからいい感じに tree-shaking もされるだろ」

ぐらいの雑の認識でしたが、実際どうなの？と気になったので、実験とそのメモを残しておく。

## 準備

[Next.js の雛形](https://nextjs.org/docs/getting-started#automatic-setup) から不要なファイルを色々消したり、実験の用の実装を追加する

```bash
$ tree
.
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── src
│   ├── modules
│   │   ├── depth1.ts
│   │   └── depth2.ts
│   └── pages
│       └── index.tsx
└── tsconfig.json
```

Next.js はページがエントリーポイントなので、ここでモジュール (`modules/depth1`) を static import したり、 dynamic import したりする。

```tsx
// pages/index.tsx
export const dummy = import("../modules/depth1").then(({ addOneDepth1 }) =>
  addOneDepth1(1),
);

export default () => {
  return <div>{`INDEX PAGE`}</div>;
};
```

実験対象のモジュールは、足し算する関数 (named export なら何でも良い)。ここからさらにモジュール (`modules/depth2.ts`) を static import したり、 dynamic import したりする。

```ts
// modules/depth1.ts
import { addOneDepth2, addTwoDepth2 } from "./depth2";

export const addOneDepth1 = async (value: number) => {
  console.log("depth1 - addOne");
  const result = value + 1;
  return addOneDepth2(result);
};

export const addTwoDepth1 = async (value: number) => {
  console.log("depth1 - addTwo");
  const result = value + 2;
  return addTwoDepth2(result);
};

export const addThreeDepth1 = async (value: number) => {
  console.log("depth1 - addThree");
  return value + 3;
};
```

## 実験

- このセクションの表内のセルの意味
  - 🌳: 対応する関数が tree-shaking された
  - `index-[hash].js`: `pages/index.tsx` 用の JavaScript ファイルと一緒に bundle された
  - `{数字}-[hash].js`: code-splitting された

### Case1: Static import で関数を読み込む

```
|   index.tsx   |       depth1.ts       |       depth2.ts       |
|          -(static)-> add1Depth1() -(static)-> add1Depth2()    |
|          ...(なし)... add2Depth1() -(static)-> add2Depth2()    |
|          ...(なし)... add3Depth1() ...(なし)... add3Depth2()    |
|               |                       |                       |
```

|                |    `depth1.ts`    |    `depth2.ts`    |
| :------------: | :---------------: | :---------------: |
| `add1Depth*()` | `index-[hash].js` | `index-[hash].js` |
| `add2Depth*()` |        🌳         |        🌳         |
| `add3Depth*()` |        🌳         |        🌳         |

- `pages/index.tsx` から static import されている `add1Depth1()` と `add1Depth2()` は `index-[hash].js` に bundle されている
- それ以外の関数は tree-shaking されている

### Case2: ページから読み込まれている関数が dynamic import で別の関数を読み込む

```
|   index.tsx   |       depth1.ts       |       depth2.ts       |
|          -(static)-> add1Depth1() -(dynamic)-> add1Depth2()   |
|          ...(なし)... add2Depth1() -(static)-> add2Depth2()    |
|          ...(なし)... add3Depth1() ...(なし)... add3Depth2()    |
|               |                       |                       |
```

|                |    `depth1.ts`    |   `depth2.ts`   |
| :------------: | :---------------: | :-------------: |
| `add1Depth*()` | `index-[hash].js` | `705.[hash].js` |
| `add2Depth*()` |        🌳         | `705.[hash].js` |
| `add3Depth*()` |        🌳         | `705.[hash].js` |

- `pages/index.tsx` から static import されている `add1Depth1()` は `index-[hash].js` に bundle されている
- Dynamic import されている `add1Depth2()` は、code-splitting されている (`705.[hash].js`)
- `add2Depth2()`, `add3Depth2()` は **読み込まれていない** が、`add1Depth2()` と一緒に bundle されている (`705.[hash].js`)

💡 モジュール内の任意の値が dynamic import されると、その他の値も共連れで bundle されるっぽい (dynamic import だとモジュール内を静的解析してくれないのかな...)

### Case3: ページから読み込まれていない関数が dynamic import で別の関数を読み込む

```
|   index.tsx   |       depth1.ts       |       depth2.ts       |
|          -(static)-> add1Depth1() -(static)-> add1Depth2()    |
|          ...(なし)... add2Depth1() -(dynamic)-> add2Depth2()   |
|          ...(なし)... add3Depth1() ...(なし)... add3Depth2()    |
|               |                       |                       |
```

|                |    `depth1.ts`    |    `depth2.ts`    |
| :------------: | :---------------: | :---------------: |
| `add1Depth*()` | `index-[hash].js` | `index-[hash].js` |
| `add2Depth*()` |        🌳         | `index-[hash].js` |
| `add3Depth*()` |        🌳         | `index-[hash].js` |

- `pages/index.tsx` から static import されている `add1Depth1()` と `add1Depth2()` は `index-[hash].js` に bundle されている
- `add2Depth2()` を dynamic import している `add2Depth1()` は **import されていない** が、`depth2.ts` 全体が `index-[hash].js` に bundle されている

💡 dynamic import 元が tree-shaking 対象でも、dynamic import されたモジュールは全体が bundle 対象になっている

### Case4: Dynamic import で関数を読み込む

```
|   index.tsx   |       depth1.ts       |       depth2.ts       |
|          -(dynamic)-> add1Depth1() -(dynamic)-> add1Depth2()   |
|          ...(なし)... add2Depth1() -(dynamic)-> add2Depth2()    |
|          ...(なし)... add3Depth1() ...(なし)... add3Depth2()    |
|               |                       |                       |
```

|                |   `depth1.ts`   |   `depth2.ts`   |
| :------------: | :-------------: | :-------------: |
| `add1Depth*()` | `422.[hash].js` | `705.[hash].js` |
| `add2Depth*()` | `422.[hash].js` | `705.[hash].js` |
| `add3Depth*()` | `422.[hash].js` | `705.[hash].js` |

- Dynamic import されている `add1Depth1()` は code-splinting されている (`422.[hash].js`)
- **Import されていない** `add2Depth1()`, `add3Depth1()` も一緒に bundle されている (`422.[hash].js`)
- Dynamic import されている `add1Depth2()` は code-splinting されている (`705.[hash].js`)
- **Import されていない** `add2Depth2()`, `add3Depth2()` も一緒に bundle されている (`705.[hash].js`)

💡 **Import されている範囲の値全てが** dynamic import されている場合に code-splitting されている

### Case5: Dynamic import されるモジュールが static import で別の関数を読み込む

```
|   index.tsx   |       depth1.ts       |       depth2.ts       |
|          -(dynamic)-> add1Depth1() -(static)-> add1Depth2()   |
|          ...(なし)... add2Depth1() -(static)-> add2Depth2()    |
|          ...(なし)... add3Depth1() ...(なし)... add3Depth2()    |
|               |                       |                       |
```

|                |   `depth1.ts`   |   `depth2.ts`   |
| :------------: | :-------------: | :-------------: |
| `add1Depth*()` | `171.[hash].js` | `171.[hash].js` |
| `add2Depth*()` | `171.[hash].js` | `171.[hash].js` |
| `add3Depth*()` | `171.[hash].js` |       🌳        |

- Dynamic import されている `add1Depth1()` は code-splinting されている (`171.[hash].js`)
- **Import されていない** `add2Depth1()`, `add3Depth1()` も一緒に bundle されている (`171.[hash].js`)
- ページから **import されていない** `add2Depth1()` から static import されている `add2Depth2()` は bundle されている (`171.[hash].js`)
- **Import されていない** `add3Depth2()` は code-splitting されている

💡 Static import 元の値が import されていない場合でも、モジュールが dynamic import されている場合、tree-shaking されない (dynamic import されたモジュールは、エントリーポイント的なふるまいをしている)

### Case6: ページから読み込まれていない関数が static import で別の関数を読み込む

```
|   index.tsx   |       depth1.ts       |       depth2.ts       |
|          -(dynamic)-> add1Depth1() -(dynamic)-> add1Depth2()   |
|          ...(なし)... add2Depth1() -(static)-> add2Depth2()    |
|          ...(なし)... add3Depth1() ...(なし)... add3Depth2()    |
|               |                       |                       |
```

|                |   `depth1.ts`   |   `depth2.ts`   |
| :------------: | :-------------: | :-------------: |
| `add1Depth*()` | `422.[hash].js` | `422.[hash].js` |
| `add2Depth*()` | `422.[hash].js` | `422.[hash].js` |
| `add3Depth*()` | `422.[hash].js` | `422.[hash].js` |

- Dynamic import されている `add1Depth1()` code-splinting されている (`422.[hash].js`)
- **Import されていない** `add2Depth1()`, `add3Depth1()` も一緒に bundle されている (`422.[hash].js`)
- `add2Depth2()` を static import している `add2Depth1()` は **import されていない** が、`depth2.ts` 全体が `422-[hash].js` に bundle されている

💡 Dynamic import と static import が混ざっている場合、tree-shaking 出来ない static import 的なふるまいになっている

## まとめ

- Next.js 13 (webpack) において...
  - Dynamic import されたモジュール内の値は全て bundle 対象になる
  - モジュール内の値が全て static import で読み込まれているときのみ、読み込まれていない値が tree-shaking 対象になる (↑ の言い換え)
  - モジュール内の値が全て dynamic import で読み込まれているときのみ、モジュールが code-splitting 対象になる
