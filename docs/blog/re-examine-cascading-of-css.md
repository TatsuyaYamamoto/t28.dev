---
title: "CSS の C (Cascading) を見つめ直す"
date: 2025-11-07
---

カスケードレイヤー (`@layer`) は [Widely available になってから 1年以上経っている](https://github.com/web-platform-dx/web-features/blob/main/features/cascade-layers.yml.dist#L7)。
また、いくつかの [UIコン](https://chakra-ui.com/docs/styling/cascade-layers) [ポーネント](https://mui.com/material-ui/customization/css-layers/)・[CSS ラ](https://tailwindcss.com/blog/tailwindcss-v4) [イブラリ](https://panda-css.com/docs/concepts/cascade-layers)でも使われるようになっている。
そろそろキャッチアップしようと MDN を読んでいたが、カスケード自体はCSSの[基本設計原則の1つ](https://developer.mozilla.org/ja/docs/Web/CSS/Guides/Cascade#:~:text=CSS%20%E3%81%AE-,%E5%9F%BA%E6%9C%AC%E8%A8%AD%E8%A8%88%E5%8E%9F%E5%89%87,-%E3%81%AE%E4%B8%80%E3%81%A4%E3%81%AB)であることを思い出した。

> **カスケード**は、異なるソースから来るプロパティ値を組み合わせる方法を定義するアルゴリズムです。(...)
> これは _カスケーディングスタイルシート_ という名前で強調されているように、 CSS の中心を占めるものです。
>
> ref: [CSS カスケード入門](https://developer.mozilla.org/ja/docs/Web/CSS/Guides/Cascade/Introduction)

新しい機能 (カスケードレイヤー) によってウェブ開発者は CSS でカスケードが使えるようになった...**ではなく**、
[カスケードをより制御できるようになった](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/At-rules/@layer#:~:text=%E3%82%A6%E3%82%A7%E3%83%96%E9%96%8B%E7%99%BA%E8%80%85%E3%81%AF%E3%82%AB%E3%82%B9%E3%82%B1%E3%83%BC%E3%83%89%E3%82%92%E3%82%88%E3%82%8A%E5%88%B6%E5%BE%A1%E3%81%A7%E3%81%8D%E3%82%8B)が正確な理解である。
「じゃあ CSS のカスケードってなに？」と言われると言葉が詰まるので、CSS の C (Cascading) を見つめ直してから、カスケードレイヤーのキャッチアップをすることにした。

→ **2025/11/15 updated: "[仕様と照らし合わせながら CSS カスケードレイヤーのふるまいをメモする](./cascade-layer-behavior)"も書いた**

## CSS カスケードアルゴリズム

カスケードは

> 異なるソースから来るプロパティ値を組み合わせる方法を定義するアルゴリズム
>
> ref: [CSS カスケード入門](https://developer.mozilla.org/ja/docs/Web/CSS/Guides/Cascade/Introduction#:~:text=%E7%95%B0%E3%81%AA%E3%82%8B%E3%82%BD%E3%83%BC%E3%82%B9%E3%81%8B%E3%82%89%E6%9D%A5%E3%82%8B%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3%E5%80%A4%E3%82%92%E7%B5%84%E3%81%BF%E5%90%88%E3%82%8F%E3%81%9B%E3%82%8B%E6%96%B9%E6%B3%95%E3%82%92%E5%AE%9A%E7%BE%A9%E3%81%99%E3%82%8B%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%AA%E3%82%BA%E3%83%A0%E3%81%A7%E3%81%99)

で、CSS カスケードアルゴリズムの役割は、

> CSS プロパティの正しい値を決定するために CSS 宣言を選択すること
>
> ref: [CSS カスケード入門 - オリジンの種類](https://developer.mozilla.org/ja/docs/Web/CSS/Guides/Cascade/Introduction#%E3%82%AA%E3%83%AA%E3%82%B8%E3%83%B3%E3%81%AE%E7%A8%AE%E9%A1%9E:~:text=%E3%82%92%E9%81%B8%E6%8A%9E%E3%81%99%E3%82%8B-,%E3%81%93%E3%81%A8,-%E3%81%A7%E3%81%99%E3%80%82%20CSS%20%E5%AE%A3%E8%A8%80)

である。
例えば👇️のような競合するプロパティ値があるとき、前のルールを上書きすることが [CSS のカスケードとして定義されている](https://www.w3.org/TR/css-cascade-5/#cascade-order) ([playground](https://developer.mozilla.org/en-US/play?id=q1f%2FkSiwDEGR14%2Fcu0MkvRKqYIZkucCqHuxaRr7s9W%2BRjaC1Mha0Lqg1M6%2BTSa%2FgJTGNwysgTurys56I))。

```css
/* <h1>これは青い見出し</h1> */
h1 {
  color: red;
}
h1 {
  color: blue; /* 👈️ ソース上最後が勝つ */
}
```

## カスケードによる並び替え

CSS のカスケードは以下の流れで最終的な値 ([カスケード値](https://www.w3.org/TR/css-cascade-5/#cascaded))を選ぶ。

1. ある要素に対して適用されるすべての宣言を集める
2. 宣言を優先順位に従って並び替える
3. 単一のカスケード値を出力する

> The **cascade** takes an unordered list of declared values for a given property on a given element, sorts them by their declaration’s precedence as determined below, and outputs a single cascaded value.
>
> ref: CSS Cascading and Inheritance Level 5 - [6. Cascading](https://www.w3.org/TR/css-cascade-5/#cascading)

カスケードの優先順位は以下のように決まっている (仕様とMDNの説明で差分がある？)。

| 順序 (低い順) | [仕様](https://www.w3.org/TR/css-cascade-5/#cascade-sort)                             | [MDN の説明](https://developer.mozilla.org/ja/docs/Web/CSS/Guides/Cascade/Introduction#%E3%82%AB%E3%82%B9%E3%82%B1%E3%83%BC%E3%83%89%E9%A0%86) |
| :------------ | :------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| 1             | Filtering（ここだけ [§ 5 Filtering](https://www.w3.org/TR/css-cascade-5/#filtering)） | 関連性                                                                                                                                         |
| 2             | Origin and Importance                                                                 | オリジンと重要度                                                                                                                               |
| 3             | Context                                                                               | (ない?)                                                                                                                                        |
| 4             | Element-Attached Styles                                                               | (ない?)                                                                                                                                        |
| 5             | Layers                                                                                | (ない?)                                                                                                                                        |
| 6             | Specificity                                                                           | 詳細度                                                                                                                                         |
| 7             | (ない?)                                                                               | スコープ近接性                                                                                                                                 |
| 8             | Order of Appearance                                                                   | 出現順                                                                                                                                         |

さらに、それぞれの項目内にも優先順位がある。

`Origin and Importance` 内の優先順位は

- スタイルルールがどの層（出所）から来たかを示す[オリジン](https://www.w3.org/TR/css-cascade-5/#cascading-origins)
- 宣言に付けられた `!important` の有無

で決まる。 オリジンには[3つのコアオリジン](https://www.w3.org/TR/css-cascade-5/#origin:~:text=cascade.%20CSS%20defines-,three%20core%20origins,-%3A)と
[2つの追加オリジン](https://www.w3.org/TR/css-cascade-5/#origin:~:text=define%20the%20following-,additional%20origins,-%3A)があり、
これらと `!important` の組み合わせで次のような優先順位になる：

> | 順序（低い順） | オリジン                           | 重要度       |
> | :------------- | :--------------------------------- | :----------- |
> | 1              | ユーザーエージェント（ブラウザー） | 通常         |
> | 2              | ユーザー                           | 通常         |
> | 3              | 作成者（開発者）                   | 通常         |
> | 4              | CSS @keyframes アニメーション      |
> | 5              | 作成者（開発者）                   | `!important` |
> | 6              | ユーザー                           | `!important` |
> | 7              | ユーザーエージェント（ブラウザー） | `!important` |
> | 8              | CSS トランジション                 |
>
> ref: [MDN - CSS カスケード入門 - カスケード順](https://developer.mozilla.org/ja/docs/Web/CSS/Guides/Cascade/Introduction#%E3%82%AB%E3%82%B9%E3%82%B1%E3%83%BC%E3%83%89%E9%A0%86)

Web アプリの開発で普通に CSS を実装すると、そのスタイルは作成者オリジン[^1]由来になる。
ユーザーのスタイルより作成者のスタイルが優先されるのは少し不思議な気もしたが、`!important` を使えば逆に上書きできるようにすることでバランスを保つことが[仕様になっている](https://www.w3.org/TR/css-cascade-5/#importance)。
「上書きしたいからとりま `!important`」なコードを見ることもあるが、単純な上書きではなく、作成者-ユーザー-ユーザーエージェント間の優先度が逆転していることを知らないとハマりそうな予感。

`Layers` の優先順位は

- `@layer` を使った explicit layer
- `@layer` を使わない implicit final layer

に分かれる。`@layer`で囲わない宣言は自動的に implicit final layer に入る。
implicit **final** layer は他の explicit layer より後に評価されるため、高い優先度で他の宣言を上書きする。

> Declarations within each origin and context can be explicitly assigned to a cascade layer. For the purpose of this step, any declaration not assigned to an explicit layer is added to an implicit final layer.
>
> ref: https://www.w3.org/TR/css-cascade-5/#cascade-layering

## 並べ替えのイメージ

CSS カスケードは前述した優先度で並べ替えをして、そこで差がつかないときは次の基準で並べ替えをする。

> The cascade sorts declarations according to the following criteria, in descending order of priority:
>
> ref: https://www.w3.org/TR/css-cascade-5/#cascade-sort

並べ替えを図示すると、👇️のような感じになる。

```text
h1 / color
└─ [Origin & Importance (Normal)]
    ├─ User-Agent origin                    // ブラウザ既定
    │    └─ h1 { color: black; }
    ├─ User origin                          // ユーザーによるスタイルCSS
    │    └─ h1 { color: green; }
    └─ Author origin                        // 作成者のスタイル
         ├─ [Layers]                        // Author origin の中で Layer の並べ替えをする
         │    ├─ @layer base
         │    │    └─ h1 { color: gray; }
         │    └─ (implicit final layer)    // レイヤーの中では、レイヤー指定なしが一番強い
         │         └─ h1 { color: blue; }
         └─ [Element-Attached Styles]
              └─ <h1 style="color: orange"> 👈️ 勝ち！
```

[^1]:
    オリジンの名前は結構表記ゆれしている。
    仕様では [`authore origin`](https://www.w3.org/TR/css-cascade-5/#cascading-origins)、 [`author declarations`](https://www.w3.org/TR/css-cascade-5/#cascade-origin-author:~:text=Normal-,author%20declarations,-Normal%20user%20declarations)、[`author style sheet`](https://www.w3.org/TR/css-cascade-5/#cascade-origin-author:~:text=origin%2C%20in%20%C2%A7%E2%80%AF6.5-,author%20style%20sheet,-%2C%20in%20%C2%A7%E2%80%AF6.2) の表記がある。
    MDN も同じ感じでばらついている。
