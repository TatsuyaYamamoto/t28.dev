---
title: "sendBeaconでjson形式のデータを送る"
date: 2021-07-04
description: "sendBeaconでjson形式のデータを送るtipをMDNのリンクと併せて紹介"
---

## なにこれ

[sendBeacon()](https://developer.mozilla.org/ja/docs/Web/API/Navigator/sendBeacon) で送るデータを json 形式で送るための tips

---

## sendBeacon()

[sendBeacon()](https://developer.mozilla.org/ja/docs/Web/API/Navigator/sendBeacon) は文書のアンロードに関わらず、確実にデータを送信したいときに便利です。
送るデータが複数ある場合は(そうでないときも)、やっぱりデータは JSON 形式で送りたいですよね。

> `navigator.sendBeacon(url, data);` <br />
> data: 送るデータを含む ...(略)... Blob, ...(略)... のいずれかのオブジェクトです。

`sendBeacon()` は [Blob](https://developer.mozilla.org/ja/docs/Web/API/Blob) を受け取るので、JSON 形式のデータを持つ Blob を作成します。

## JSON から Blob を作成する

[Blob() コンストラクタは、他のオブジェクトから Blob を作成することができます。](https://developer.mozilla.org/ja/docs/Web/API/Blob#blob_%E3%81%AE%E4%BD%9C%E6%88%90)

```js
const obj = { hello: "world" };
const blob = new Blob([JSON.stringify(obj, null, 2)], {
  type: "application/json",
});
```

## こんな感じのメソッドを使ってる

```js
const sendBeaconWithJson = (json) => {
  const data = new Blob([JSON.stringify(json)], {
    type: "application/json",
  });
  return navigator.sendBeacon(`/any/path`, data);
};
```
