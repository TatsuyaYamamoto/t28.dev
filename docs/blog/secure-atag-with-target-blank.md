---
title: 'もうなんとなくで target="_blank" と一緒に noreferrer/noopener を書かない'
date: 2022-03-21
---

「`<a>` で 新しいタブを開く (`target="_blank"` を付ける) ときは、`noreferrer` や `noopener` を付けようね〜」
という話はよく聞きます[^1]。

ところが「なんで？」と問われると「セキュリティ面で...」と曖昧だったので、理由・対策をしっかり理解しておきます。

## セキュリティとプライバシー

[MDN](https://developer.mozilla.org/ja/docs/Web/HTML/Element/a#%E3%82%BB%E3%82%AD%E3%83%A5%E3%83%AA%E3%83%86%E3%82%A3%E3%81%A8%E3%83%97%E3%83%A9%E3%82%A4%E3%83%90%E3%82%B7%E3%83%BCa) では以下の通り言及されています。

> `<a>` 要素は、ユーザーのセキュリティやプライバシーに影響を及ぼす可能性があります。

> `target="_blank"` を `rel="noreferrer"` や `rel="noopener"` なしで使用すると、ウェブサイトが window.opener API 搾取攻撃を受けやすくなります

### `rel="noreferrer"`

`Referer` リクエストヘッダーにはリクエスト元のページの URL が含まれていて、MDN の[Referer ヘッダーのプライバシーとセキュリティの考慮事項](https://developer.mozilla.org/ja/docs/Web/Security/Referer_header:_privacy_and_security_concerns) で問題点が言及されています。

- Referer ヘッダー内のアクセス元の URL から情報の追跡や盗用されたり、機密情報が漏れる可能性がある[^2]
- 例えばパスワードリセットページでセキュリティを侵害する恐れがある例
  - ソーシャルメディアへのリンクをクリックする
  - サードパーティ側でホストされている画像を読み込む

このようなリスクを低減するためにリファラーの送信を制限する方法として `noreferrer` があるという感じですね。

### `rel="noopener"`

Window オブジェクトには [opener](https://developer.mozilla.org/ja/docs/Web/API/Window/opener) というプロパティがあり、これによってウィンドウを開いたウィンドウへの参照を取得することが出来ます。

例えばあるサイト A から別のサイト B を新しいタブ/ウィンドウで開いた場合に、サイト B 内の JavaScript で opener 経由で サイト A の location にアクセスすることで、サイト A の URL を変更する事ができます。

```js
// サイト B 内の JavaScript
window.opener.location = "好きなURL"; // サイトAを別のページに遷移させられる
```

例えばサイト A の遷移先がサイト A そっくりなフィッシングサイトだったりすると....😭

信頼できないリンクを開くときに上記のように遷移先で遷移元の情報を取得したり変更を出来ないようするために、`noopener` があるという感じですね。

## 暗黙的な振る舞い

`target="_blank"` だけを指定した `<a>` はどう振る舞うの？というと、**モダンな** ブラウザでは `noopener` を設定した振る舞いになります。

ref: [MDN - `<a>`: アンカー要素 - ブラウザーの互換性](https://developer.mozilla.org/ja/docs/Web/HTML/Element/a#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%BC%E3%81%AE%E4%BA%92%E6%8F%9B%E6%80%A7)

また、`noreferrer` を指定すると、`noopener` を設定しているかのように動作します。

ref: [MDN - リンク種別: noreferrer](https://developer.mozilla.org/ja/docs/Web/HTML/Link_types/noreferrer)

## 取りうる属性値の設定パターン

前述の情報を元に目的別の設定をまとめると以下のとおりです。

1. referrer を送信**しない**、かつ opener を参照させないために (★)
   - `noreferrer` のみを設定する
   - `noreferrer noopener` 両方を設定する
2. referrer を送信**する**、かつ opener を参照させないために
   - `noopener` を設定する

(★)の設定はどちらがベストか検討します。

## ESLint (のプラグイン) が求める属性値

ESLint のルールを見てみると、React と Vue のプラグインで方針が割れています。

- [react/jsx-no-target-blank](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md) では、`noreferrer` の設定を求めている
- [vue/no-template-target-blank](https://eslint.vuejs.org/rules/no-template-target-blank.html) では、`noopener` と `noreferrer` 両方の設定を求めている

eslint-plugin-react では元々両方の設定を求めていましたが、`noreferrer` のみの設定に issues での議論の結果、実装が変更されたようです。

ref: [issues(#2022)](https://github.com/jsx-eslint/eslint-plugin-react/issues/2022), [PR(#2043)](https://github.com/jsx-eslint/eslint-plugin-react/pull/2043)

議論のポイントは `noreferrer` のみ設定と `noreferrer noopener` 両方設定でブラウザの振る舞いに違いがあるかです。そして検証の結果、違いがないので `noreferrer` のみでよいとなっています[^3]。

ref: [issues(#2022#issuecomment-526293976)](https://github.com/jsx-eslint/eslint-plugin-react/issues/2022#issuecomment-526293976)

## で、どうしよっか

私個人の判断としては eslint-plugin-react の方針にならって下記のようにしていきます。

1. referrer を送信**しない**、かつ opener を参照させないために、`noreferrer` のみを設定する
2. referrer を送信**する**、かつ opener を参照させないために、`noopener` を設定する

## おまけ

### 振る舞いの検証

遷移先で以下のような遷移元の操作が出来るかを確認してみます。

```js
// 遷移先で開発者ツールを開いて...
// このブログページの window オブジェクトが取れる
window.opener;
// ページを書き換えちゃう
window.opener.location = "https://lovelive-anime.jp";
```

export const url = "https://t28.dev";

| リンク or ボタン                                                             | 新しい Chrome の場合の期待値 |
| :--------------------------------------------------------------------------- | :--------------------------- |
| <a href={url} target="_blank">rel なしのリンク</a>                           | opener が null               |
| <a href={url} target="_blank" rel="opener">rel="opener" のリンク</a>         | ページを書き換えられる       |
| <a href={url} target="_blank" rel="noopener">rel="noopener" のリンク</a>     | opener が null               |
| <a href={url} target="_blank" rel="noreferrer">rel="noreferrer" のリンク</a> | opener が null               |

ちなみに、`referrer` な rel 属性はない。

[^1]: 本当に"よく"聞くことかは分からない...。Web アプリケーションの開発の"基本" ってどの範囲なのか曖昧なのが難しい...。

[^2]: 一方、`Referer` には分析・ログ・キャッシュの最適化などの用途もあるため、要件次第でもある。

[^3]: Firefox でバグが発生している一部のバージョンを除く
