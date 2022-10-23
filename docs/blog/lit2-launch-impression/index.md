---
title: "Lit2の背景・新機能・ポイントを整理した"
date: 2021-04-24
description: "Launch Eventが行われたLit2の背景・新機能・個人的に思う大事なポイントをまとめた記事"
---

## なにこれ？

- [Launch Event](https://www.youtube.com/watch?v=f1j7b696L-E) が行われた [Lit2](https://lit.dev/) の背景・新機能・個人的に思う大事なポイントをまとめた記事。
- 元々は UIT INSIDE の収録に向けて準備したものだけれど、配信では 2 割ぐらいしか話せなかったので...ここに書いておく 😇

[ep.84 『Web Components 最前線！Lit 2 で広がる新たな可能性』 | UIT INSIDE](https://uit-inside.linecorp.com/episode/84)

~~まとめたと言う割には、長かったり、所々略したり~~

---

## 今 (2021-04-22)

- HTML テンプレートライブラリの[lit-html](https://lit-html.polymer-jp.org/) と、[Web Components](https://developer.mozilla.org/ja/docs/Web/Web_Components) を開発するためのライブラリ[LitElement](https://lit-element.polymer-jp.org/) のメジャーアップデートに併せて、関連パッケージを全て内包した [Lit2](https://github.com/lit/lit) ([2.0.0-rc.1](https://www.npmjs.com/package/lit/v/2.0.0-rc.1)) が公開され、
- [新しいロゴ](https://twitter.com/buildWithLit/status/1384572664002478093?s=20) が発表され、
- Lit2 の[Launch Event](https://www.youtube.com/watch?v=f1j7b696L-E) が生配信され、
- [リニューアルした公式ページ](https://lit.dev/) が公開されました。

乗るしかない、このビッグウェーブに。

## ビッグウェーブに乗るために見たもの

- [Launch Event](https://www.youtube.com/watch?v=f1j7b696L-E)
- [About Lit 2.0](https://github.com/lit/lit/wiki/About-Lit-2.0)
- [各種 issues](https://github.com/lit/lit/issues?q=is%3Aissue)
- [実装](https://github.com/lit/lit)

## Lit1? Lit2? (おさらい)

### Lit1 はあるの？

ない

- [github.com/lit/lit](https://github.com/lit/lit) の repo における v1 は lit-html v1.x に相当するけど、これは [github.com/Polymer/lit-html](https://github.com/Polymer/lit-html) を rename して作られた repo のため。

### Lit2 is なに

Web Components を実装するための [各種ライブラリ・モジュール(lit-\*, @lit/\*)](https://github.com/lit/lit/tree/main/packages) の総称

- または
  - monorepo の[リポジトリ名](https://github.com/lit/lit)
  - [npm package 名](https://www.npmjs.com/package/lit) (各種ライブラリ・モジュールのエントリーポイント)

### Lit2 は repo, npm module をまとめただけ？

既存パッケージのメジャーアップデート、新しいパッケージの提供が行われている。

- major update
  - lit-html 2.0 (現行は v1.3.0)
  - lit-element 3.0 (現行は v2.4.0)
- new package
  - @lit/reactive-element
  - @lit/localize
  - @lit/localize-tools
  - @lit/virtualizer
  - @lit-labs/\* (実験的な機能のパッケージ)
    - ssr
    - ssr-client
    - react
    - task
    - scoped-registry-mixin

### なんで Lit2 は開発されているの?

SSR の実現とパフォーマンスの改善

[About Lit 2.0#Motivation](https://github.com/lit/lit/wiki/About-Lit-2.0#motivation)

## (個人的に思う)大事なポイント

- 再利用
- Breaking Change が少ない
- パフォーマンス
- SSR

### 再利用

#### 機能の集約がしやすくなってる

- [Reactive Controllers](https://github.com/lit/lit/wiki/About-Lit-2.0#reactive-controllers)
- [reactive-element](https://github.com/lit/lit/blob/main/packages/reactive-element/README.md) に定義されている [ReactiveController interface](https://github.com/lit/lit/blob/main/packages/reactive-element/src/reactive-controller.ts#L53) と [ReactiveControllerHost interface](https://github.com/lit/lit/blob/main/packages/reactive-element/src/reactive-controller.ts#L11) のこと
- ReactiveController
  - ライフサイクルメソッドが定義されていて、override する。
- ReactiveControllerHost
  - [addController()](https://github.com/lit/lit/blob/main/packages/reactive-element/src/reactive-controller.ts#L16) で登録した ReactiveController のライフサイクルメソッドを呼ぶ。
  - [ReactiveElement も実装している](https://github.com/lit/lit/blob/main/packages/reactive-element/src/reactive-element.ts#L283)
- **LitElement の外でライフサイクルに依存する処理を実装できる** => 再利用出来て嬉しい 😊
- 今までロジックを書くときは、 class 内に書いたり、extends, mixin したりと、再利用の面で辛かった...。

#### ライブラリを組み合わせられるようになっている

- Lit2 では、いままで LitElement(v2.x)が持っていた properties や style 等の Web Components 用の実装( [UpdatingElement](https://github.com/lit/lit-element/blob/master/src/lib/updating-element.ts#L219) )を [reactive-element](https://github.com/lit/lit/blob/main/packages/reactive-element/README.md) に移している。
- Lit2 の LitElement は、lit-html (テンプレートライブラリ) と reactive-element (Web Components 実装の core) を繋ぐ役割を持つ。
- package が lit-html, lit-element, reactive-element に分かれた疎結合なライブラリが提供されたことで、**「テンプレートは preact にする」とかが出来る** ようになっている 💪

### Breaking Change が少ない

- 内部実装が結構変わっているのに、**API 上の変更が少なくてすごい** 👏
- 新旧の API のケアが実装から分かる。親切〜 😊
  - lit-element v2 => v3 で [@internalProperty](https://github.com/lit/lit-element/blob/master/src/lib/decorators.ts#L189) から [@state](https://github.com/lit/lit/blob/main/packages/reactive-element/src/decorators/state.ts#L35) に rename したけど、 v2 側の実装でも [state が export されている](https://github.com/lit/lit-element/blob/master/src/lib/decorators.ts#L202) 。
  - lit-element v2 => v3 で LitElement class の継承元が [UpdatingElement](https://github.com/lit/lit-element/blob/master/src/lit-element.ts#L101) から [ReactiveElement](https://github.com/lit/lit/blob/main/packages/lit-element/src/lit-element.ts#L80) に変わったけれど、v2 側で [ReactiveElement を export している](https://github.com/lit/lit-element/blob/master/src/lit-element.ts#L62) 。

### パフォーマンス

- コードベースの簡素化・ブラウザーサポートの方針変更によって、**バンドルサイズが下がっている**。
  - SSR を実現するために、カスタマイズ用の API を閉じた。
  - core の実装と、browser 向け実装を分けた。
    - IE 用の実装を core から外す ([Move IE11 support out of the core library](https://github.com/lit/lit/issues/1182))
    - Safari の template literal バグ用のコードを削除 ([Remove the workaround for broken template literals in Safari](https://github.com/lit/lit/issues/1182))
  - [ES2019 でビルド](https://lit.dev/docs/tools/requirements/) した。
- ↑ の結果、バンドルサイズが下がった分、**パフォーマンスが上がっている** 🔥
- Reduced size ([配信から](https://www.youtube.com/watch?v=f1j7b696L-E))
  - minified 15kb (-30%)
  - gzip 5.8kb (-19%)
  - brotli 5.2kb (-20%)

### SSR

- `<template>` でコンポーネントを表現した html を返す。
- template tag では [宣言的 Shadow DOM](https://web.dev/declarative-shadow-dom/) で Shadow DOM が表現されている。
- 宣言的 Shadow DOM ? 🤔
  - `<template shadowroot="open" />` で shadow root をテンプレート上で宣言できる => SSR 出来る！
  - 今までは js で `elementRef.attachShadow({mode: 'open'});` ってやってたやつ
- [labs/ssr 配下の demo](https://github.com/lit/lit/blob/main/packages/labs/ssr/src/demo/server.ts) を動かすのが早い。
  - クライアント側で `hydrate(template(initialData), window.document.body)` してから再度 `render(template(data))` すると描画済みの html(node 側で render したやつ)に対して必要な部分だけを変更できる。

## Lit2 の新機能

[About Lit 2.0 - New Features](https://github.com/lit/lit/wiki/About-Lit-2.0#new-features)

### lit (全体)

- 開発用ビルドの提供

### lit-html

#### [Element expressions](https://github.com/lit/lit/wiki/About-Lit-2.0#element-expressions)

[lit.dev/docs](https://lit.dev/docs/templates/expressions/#element-expressions)

- 要素のインスタンスを取得するためにディレクティブを使って ↓ って書ける。

  ```
  html`<div ${myDirective()}></div>`
  ```

- `ref`(後述) ぐらいしか用途が思いつかない...😭

#### [Class-based directive API](https://github.com/lit/lit/wiki/About-Lit-2.0#class-based-directive-api)

- いままで(lit-html v1.x)は [directive()](https://github.com/lit/lit/blob/v1.3.0/src/lib/directive.ts#L64-L69) で関数を wrap する形式だった。
- SSR 関連話
  - ディレクティブは DOM と話す ([WeakMap に保存してディレクティブを登録する](https://github.com/lit/lit/blob/v1.3.0/src/lib/directive.ts#L17)) ので、SSR のツラみが深い 😭
  - 関数だとライフサイクルが持てないから、SSR のツラみが深い 😭
- 関数から [class に変わった](https://github.com/lit/lit/blob/main/packages/lit-html/src/directive.ts#L93) ので、ディレクティブ内で状態を持てるようになった。
- ライフサイクルメソッドが定義されたので、SSR の制御ができる。
  - render(): 初期レンダリングと SSR
  - update(): クライアントのみで実行されるので、dom とかイジれる

#### [Async Directives](https://github.com/lit/lit/wiki/About-Lit-2.0#async-directives)

- [Directive class を継承した AsyncDirective class](https://github.com/lit/lit/blob/main/packages/lit-html/src/async-directive.ts#L289) で定義されている `disconnected()`と`reconnected()`のこと
- これらは、directive 内で保持した状態や subscription を開放するための callback method。
- template 内の directive で promise を返せるようになった…**ではない(すでに出来る)**。

#### [Refs](https://github.com/lit/lit/wiki/About-Lit-2.0#refs)

[lit.dev/docs](https://lit.dev/docs/templates/directives/#ref)

- `const divRef = createRef()`, `<div ${ref(this.divRef)}></div>` で 要素を参照できる。
- 今までは`querySelector`とか `@query` を使っていた。
- [createRef()](https://github.com/lit/lit/blob/main/packages/lit-html/src/directives/ref.ts#L12) で取得する Ref インスタンスは React と同じ [value を持つシンプルなオブジェクト](https://github.com/lit/lit/blob/main/packages/lit-html/src/directives/ref.ts#L14-L20) 。

#### [Static Expressions](https://github.com/lit/lit/wiki/About-Lit-2.0#static-expressions)

略 😭

#### [Compiled template support](https://github.com/lit/lit/wiki/About-Lit-2.0#compiled-template-support)

- html が返す TemplateResult を予め計算(pre-compile)しておくと、処理のオーバーヘッドが減って嬉しい 😊
- ブラウザーサポート(IE, Safari)の課題に対する代替手段にもなりそう。
- `interface CompiledTemplate`は[もうある](https://github.com/lit/lit/blob/main/packages/lit-html/src/lit-html.ts#L255) けれど、実装はまだないっぽい。

#### [Multiple expressions in unquoted attributes](https://github.com/lit/lit/wiki/About-Lit-2.0#multiple-expressions-in-unquoted-attributes)

- `html'<div foo=${a}${b}></div>'`が出来る
- ...けど、メリットはなに...? 🤔

### LitElement

#### [Reactive Controllers](https://github.com/lit/lit/wiki/About-Lit-2.0#reactive-controllers)

(前述) （´-`）.｡oO(実装の実態は[reactive-element 配下にあって](https://github.com/lit/lit/blob/main/packages/reactive-element/src/reactive-controller.ts)、lit-element は [export しているだけ](https://github.com/lit/lit/blob/main/packages/lit-element/src/index.ts#L7) なんだけどね)

### ReactiveElement

#### [Shadow root & styles support](https://github.com/lit/lit/wiki/About-Lit-2.0#shadow-root--styles-support)

(前述) （´-`）.｡oO（LitElement にあった実装あれこれを ReactiveElement に移動した）

#### 細かい機能差

- [static shadowRootOptions](https://github.com/lit/lit/wiki/About-Lit-2.0#static-shadowrootoptions)
- [static finalizeStyles()](https://github.com/lit/lit/wiki/About-Lit-2.0#static-finalizestyles)

### Labs

#### [@lit-labs/ssr and @lit-labs/ssr-client](https://github.com/lit/lit/wiki/About-Lit-2.0#lit-labsssr-and-lit-labsssr-client)

(前述)

#### [@lit-labs/react](https://github.com/lit/lit/wiki/About-Lit-2.0#lit-labsreact)

- React で Web Components を使用するための便利メソッドを提供してくれる。
- [createComponent()](https://github.com/lit/lit/blob/main/packages/labs/react/src/create-component.ts)
  - Web Component を ReactComponent で wrap するための util
  - React で Web Components は描画出来る...けど、React の props を Web Components に渡すのは結構大変なんだよね...(attr/prop の bind とか、event とか)。
- [useController()](https://github.com/lit/lit/blob/main/packages/labs/react/src/use-controller.ts)

#### [@lit-labs/task](https://github.com/lit/lit/wiki/About-Lit-2.0#lit-labstask)

略 😭

#### [@lit-labs/scoped-registry-host](https://github.com/lit/lit/wiki/About-Lit-2.0#lit-labsscoped-registry-host)

略 😭

## 結論

Lit2 使おう！👊😊
