---
title: "JavaScriptによる正しいクリップボードのコピー"
date: 2022-02-23
---

多分。(秒で弱気になる)

クリップボードに何かしらの文字をコピーしたい欲が定期的に来るにも関わらず、いっつも調べ回ってるので、これで最後...は無理だけれど当分なしにしたい。

## ソースコード (コピペ用)

```ts
/**
 * Copy a text to the clipboard.
 *
 * @param {string} text - copy target value
 * @returns {Promise<void>} If the Clipboard API or copy command is not supported or not enabled, it's rejected.
 *
 * @licence MIT
 * @see https://t28.dev/correct-implementation-of-clipboard-in-js
 */
export const copyToClipboard = (text: string): Promise<void> => {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }

  const dummyEl = document.createElement("input");
  dummyEl.value = text;
  dummyEl.readOnly = true;
  dummyEl.style.position = "absolute";
  dummyEl.style.opacity = "0";
  document.body.appendChild(dummyEl);

  dummyEl.setSelectionRange(0, 5000_0000_0000);

  const result = document.execCommand("copy");
  dummyEl.parentNode?.removeChild(dummyEl);

  return result
    ? Promise.resolve()
    : Promise.reject(
        new Error("Copy is not supported or enable on this device."),
      );
};
```

## ソースコード (解説用)

### Clipboard API

```ts
if (navigator.clipboard) {
  return navigator.clipboard.writeText(text);
}
```

[クリップボード API](https://developer.mozilla.org/ja/docs/Web/API/Clipboard_API) を使います。
`writeText()`でクリップボードに文字列をコピーさせる Promise を受け取っておしまい........**とはならない** 。

[Safari on iOS でのサポートが 13.4 以降](https://developer.mozilla.org/ja/docs/Web/API/Clipboard#browser_compatibility) という点を考えると、Clipboard API だけで実装するのは心許ない...。
`if` で Clipboard API のサポートをチェックして、ダメなら古の手段(`execCommand`)を取ります。

### execCommand

ググるとよく出てくる手段が [execCommand()](https://developer.mozilla.org/ja/docs/Web/API/Document/execCommand) を使うやつ。
これ自体は編集可能な領域を操作するコマンドを実行する API で、`copy command` (クリップボードにコピー) もある、という構造。
`copy command` の [Safari on iOS でのサポートが 10 以降](https://developer.mozilla.org/ja/docs/Web/API/Document/execCommand#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%BC%E3%81%AE%E4%BA%92%E6%8F%9B%E6%80%A7) なので、
レガシー環境の対応としてはこれで許してほしい。

ちなみに、**execCommand()は deprecated**なので、「クリップボード API が使えないときは `execCommand` を使う」で正しい。

#### ダミー要素を作る

`copy command` は選択範囲をクリップボードにコピーするものなので、コピー対象の文字列を選択するためにダミー要素を作成します。
ダミー要素に`<input>` を使うか、`<div>` を使うかでやることが変わります。

##### `<input>`の場合

```ts
const dummyEl = document.createElement("input");
dummyEl.value = text;
dummyEl.readOnly = true;
dummyEl.style.position = "absolute";
dummyEl.style.opacity = "0";
document.body.appendChild(dummyEl);

dummyEl.setSelectionRange(0, 5000_0000_0000);
```

- readOnly にすることで文字選択(`setSelectionRange()`)時にモバイルのキーボード起動と要素までのスクロールを防ぐ。
- ちなみに、[HTMLInputElement.select()](https://developer.mozilla.org/ja/docs/Web/API/HTMLInputElement/select) は [iOS で色々ややこしいみたい](https://stackoverflow.com/questions/3272089/programmatically-selecting-text-in-an-input-field-on-ios-devices-mobile-safari) なので使わない。

##### `<div>`の場合

```ts
const dummyEl = document.createElement("div");
dummyEl.innerText = text;
dummyEl.style.position = "absolute";
dummyEl.style.opacity = "0";
document.body.appendChild(dummyEl);

const range = document.createRange();
range.selectNode(dummyEl);
window.getSelection()?.addRange(range);
```

- `<div>`は入力要素ではないので、readOnly みたいな工夫は要らない。
- `<div>` には [HTMLInputElement.setSelectionRange()](https://developer.mozilla.org/ja/docs/Web/API/HTMLInputElement/setSelectionRange) みたいな便利メソッドはないので、文字選択は Range で頑張る。

##### どっちにすんの

iOS12 以上を対象にするってことで妥協して、`<input>` を使う 😇

- [Stackoverflow](https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios) を参考にすると、👆 の手段はどちらも iOS10 (iOS11 は分からん) では期待通りに動かない 😭

  - iOS10 では、`<input>` または `<textarea>` からのみコピーが行える
    - => `<div>`が使えん
  - iOS10 では、readOnly が false のときコピーが行える
    - => ダミーの`<input>` にフォーカスがあたってスクロールされる

- 自分で確認した範囲[^1]ではどっちも動くけれど、`<div>` は連続で実行すると何故か`execCommand()`がたまに失敗して安定しないから、とりあえず`<input>`で。~~正しいクリップボードのコピーとは？？？？~~

#### コピーを実行して後片付け

```ts
const result = document.execCommand("copy");
dummyEl.parentNode?.removeChild(dummyEl);
```

ダミー要素は消しておく。

#### レスポンス

```ts
  return result
    ? Promise.resolve()
    : Promise.reject("Copy is not supported or enable on this device.");
};
```

`copy command` が対応していないか無効であれば、 `execCommand` は false を返却するため、この情報を使って Promise を解決します。

[^1]: iOS Simulator 12.4, iOS 実機 12.1.4
