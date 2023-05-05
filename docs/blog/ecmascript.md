---
title: "ECMAScript ってなに"
date: 2023-05-04
---

"ECMAScript" の意味をしっかり理解していなかったので、整理しておく。

## Ecma International

https://www.ecma-international.org/

Ecma International っていう標準化団体がある。

## (Ecma) Standards

https://www.ecma-international.org/publications-and-standards/standards/

Ecma International が標準化しているものは色々あって、 ECMAScript もその一部 ([ECMA-262](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/))。

`language specification` で検索すると、
Dart([ECMA-408](https://www.ecma-international.org/publications-and-standards/standards/ecma-408/))、
C++/CLI([ECMA-372](https://www.ecma-international.org/publications-and-standards/standards/ecma-372/))、
C# ([ECMA-334](https://www.ecma-international.org/publications-and-standards/standards/ecma-334/))
が出てきた。

## (Ecma) Technical Committees

https://www.ecma-international.org/technical-committees/

Ecma の範囲で幅広く標準化をしているだけあって、それぞれの技術的な作業は Technical Committees (TCs) または Task Groups (TGs) が担当している(2 つの違いはよく分からない)。

ECMAScript の担当は [TC39](https://www.ecma-international.org/technical-committees/tc39/) 。

## ECMA-262 (ECMAScript) in ecma-international.org

https://www.ecma-international.org/publications-and-standards/standards/ecma-262/

ECMAScript の言語仕様...の管理番号？　が ECMA-262。

> ECMAScript® 2022 language specification
> 13th edition, June 2022
>
> This Standard defines the ECMAScript 2022 general-purpose programming language.

ECMAScript® 2022 Language Specification として、https://262.ecma-international.org/13.0/ で公開されている。

過去の標準 (Online Archives)が 👇。

- ECMA-262 5.1 edition, June 2011
- ECMA-262, 6th edition, June 2015
- ECMA-262, 7th edition, June 2016
- ECMA-262, 8th edition, June 2017
- ECMA-262, 9th edition, June 2018
- ECMA-262, 10th edition, June 2019
- ECMA-262, 11th edition, June 2020
- ECMA-262, 12th edition, June 2021

## ECMA-262 (ECMAScript) in tc39.es

https://tc39.es/ecma262/

> Draft ECMA-262 / May 3, 2023
> ECMAScript® 2024 Language Specification
>
> The document at https://tc39.es/ecma262/ is the most accurate and up-to-date ECMAScript specification.

ECMAScript の最新のドラフトは https://tc39.github.io/ecma262/ で公開されている。

## How to Read the ECMAScript Specification

https://timothygu.me/es-howto/

https://tc39.es/ からリンクされている `Reading the Spec` を見てみる。

> The ECMAScript language specification is developed by a group of people from diverse backgrounds, known as the Ecma International Technical Committee 39 (or as they are more familiarly known, TC39 [TC39]). TC39 maintains the latest specification for the ECMAScript language at tc39.es [ECMA-262].

この記事前半の内容がまとめられてた。

> every year, TC39 picks a point in time to take a snapshot of the spec to become the ECMAScript Language Standard of that year, along with an edition number.

https://tc39.github.io/ecma262/ で仕様をどんどん更新しつつ、毎年 6 月 (多分) に文書のスナップショットを 例えば ES2019 という名前で保存・公開している。

## Living Standard ?

`How to Read the ECMAScript Specification` に書いてある

> TC39 maintains the latest specification for the ECMAScript language at tc39.es [ECMA-262].

のことを、`Living standard` と[呼んでいる記事がちらほらある](https://www.google.com/search?q=living+standard+ecmascript)んだけれど、 Ecma の記事での説明が見つけられなかった...。
