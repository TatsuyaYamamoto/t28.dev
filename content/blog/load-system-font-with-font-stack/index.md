---
title: "システムフォントでウェブコンテンツを描画するためのFont Stack"
date: 2021-12-04
---

何かしらの Web ページを作成する時に「フォントどーしよー 😇」となるわけです。Web フォントでオシャに決めたくもあるけれど、パフォーマンスが ([雑に省略](https://www.google.com/search?q=web+font+performance+site)) 。
となると、システムフォントを使って Web コンテンツの描画がしたくなります。

## システムフォント？

> コンピューターのオペレーティングシステムで標準的に使用されるフォント

ref: [システムフォントとは - コトバンク](https://kotobank.jp/word/%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88-4218)

OS のベンダーが選んだフォントをそのまま自分のウェブコンテンツの描画に使えば

- （フォントの追加読み込みがない）パフォーマンスの確保
- （ベンダーが選んだという）フォント品質の担保

が出来て、強くなれる。という算段。

_「システムに適切なフォントとウェブコンテンツに適切なフォントは違うでしょ」という意見もあるみたいで、そうかも、とも思う。_

## Font Stack?

[font-family の仕様](https://developer.mozilla.org/ja/docs/Web/CSS/font-family) に従ってフォントの優先順位指定したリストを Font Stack と呼んだりすることがあるみたい([Web 標準の用語ではなさそう](https://www.google.com/search?q=Font+stack&oq=Font+stack) )。

システム毎にシステムフォントは異なるので、それぞれを font-family の value として順番に書いていくのが鉄板...というより必要。

## 他所様の font-family を見る

| Web サービス                        | font-family                                                                                                                                         |
| :---------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Twitter](https://twitter.com/)     | `"Segoe UI", Meiryo, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;`                                                                     |
| [GitHub](http://github.com/)        | `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";`                               |
| [dev.to](https://dev.to/)           | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';`    |
| [web.dev](https://web.dev/)         | `"Segoe UI", system-ui, -apple-system, sans-serif;`                                                                                                 |
| [Google](https://www.google.com/)   | `arial,sans-serif;`                                                                                                                                 |
| [Amazon](https://www.amazon.co.jp/) | `'Hiragino Kaku Gothic ProN','Hiragino Sans',Meiryo,sans-serif;`                                                                                    |
| [Notion](https://www.notion.so/)    | `inter-var, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";` |

| UI ライブラリ                           | font-family                                                                                                                                                                                       |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [MUI](https://mui.com/)                 | `"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";`                                    |
| [chakra-ui](https://chakra-ui.com/)     | `Inter,sans-serif;`                                                                                                                                                                               |
| [tailwindcss](https://tailwindcss.com/) | `Inter var,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;` |

「まずはこれを使いたい」という意思(Hiragino, IBM Plex Sans, Inter)を感じるもの以外は、同じ Value の順番違いって感じ(に見える)。

## それぞれのフォントを見てみる

これ！っていう公式ドキュメントがなくて辛い...😭

### -apple-system, BlinkMacSystemFont

-apple-system は iOS と macOS のシステムフォントを呼び出すための`CSS Value`。実態として、Apple の San Francisco フォントが呼び出される。
Safari, FireFox では -apple-system が使えるが、Chrome, Opera (Chromium ベースのブラウザ？)は BlinkMacSystemFont で指定するらしい。

日本語を入力した場合、通常のヒラギノより「グリフ高さが 1px 小さい」ヒラギノが表示されるようです。

- ref
  - [Using the System Font in Web Content](https://webkit.org/blog/3709/using-the-system-font-in-web-content/)
  - [Human Interface Guidelines - Typography](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/typography/)
  - [Fonts for Apple Platforms](https://developer.apple.com/fonts/)
  - [font-family を調べまわった結果のまとめ](https://www.bugbugnow.net/2020/02/font-family.html)
  - [ios11 以前と以降での、-apple-system の表示](https://qiita.com/a_t/items/18693be11bd87f98d212)

### Segoe UI

Microsoft が作った、Vista 以降の Windows で採用されているシステムフォント。

- refs
  - [Segoe UI font family](https://docs.microsoft.com/ja-jp/typography/font-list/segoe-ui)

### Roboto

Google が作った、Android, ChromeOS で採用されているシステムフォント。

- refs
  - [Roboto - Google Fonts](https://fonts.google.com/specimen/Roboto)
  - [github.com/googlefonts/roboto](https://github.com/googlefonts/roboto)

### Helvetica

古から支持されている欧文フォント、らしい（公式ページが無いのか見つけられなくてよく分からん...）。
[macOS, iOS では preinstall されている](https://developer.apple.com/fonts/system-fonts/) けど、windows にはないみたい。

### Arial

Helvetica の派生として位置づけられている欧文フォント。なんやかんやあって、Helvetica の代替として作られたものらしい。

- refs
  - [身近な書体: Arial](https://tosche.net/blog/arial)

### A generic family name

👆 で参考にしたサービス・ライブラリ内で使用されていたこれら(👇) は

- sans-serif
- system-ui
- ui-sans-serif

総称フォントファミリーで、特定のフォント名**ではなく**字形やプラットフォームごとの既定値などで分けたフォント郡の総称です。

> 総称フォントファミリーは、フォントファミリー名リストの最終選択肢である必要があります

なのは、font-family に指定した値がどれも該当しなかった時にそれっぽいフォントにフォールバックさせることを期待しているからってことですね。

- refs
  - [MDN - font-family](https://developer.mozilla.org/ja/docs/Web/CSS/font-family)

## で、どうしよっか

システムフォントを使うという観点では 👇 の方針で良さそう。

- `system-ui` でプラットフォームごとのシステムフォントを取得して
- 未対応の環境はプラットフォームごとの CSS Value でシステムフォントを取得して
- それでも無理なら`sans-serif`

```scss
body {
  // prettier-ignore
  font-family:
    // プラットフォームの既定のユーザーインターフェイスフォントを使う
    system-ui,
    // system-ui が対応していないバージョンのApple端末
    -apple-system, BlinkMacSystemFont,
    // system-ui が対応していないバージョンのAndroid or ChromeOS
    Roboto,
    // system-ui が対応していないバージョンのWindows
    Segoe UI,
    // 最後のゴールキーパー
    sans-serif;
}
```

`system-ui`は Chrome 以外はまだ新しい(または部分サポートの)機能だから、採用しているところもまだ少ないって感じだろうか 🤔

- refs
  - [CSS property: font-family: system-ui](https://caniuse.com/mdn-css_properties_font-family_system_ui)
