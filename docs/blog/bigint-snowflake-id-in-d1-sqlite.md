---
title: "D1 (SQLite) に BigInt の値 (Snowflake ID) を入れる"
date: 2025-08-19
---

「D1 に Snowflake ID を含むレコードを入れて、Snowflake ID のカラムでソートした結果を取得する」に際して、調べたことメモ

## Snowflake ID

Snowflake ID は Twitter (現 X) が開発した識別子のフォーマット。

- [Twitter IDs (snowflake)](https://developer.x.com/ja/docs/basics/twitter-ids)
- [X IDs](https://docs.x.com/fundamentals/x-ids)

時間に基づいた 64 bit の符号なし整数なので、ID をソートするだけで時系列順のリストを作ることが出来る。64bit は以下のように割り当てられる:

```
[ 1bit 予約 (0) ] [ 41bit タイムスタンプ ] [ 10bit マシンID ] [ 12bit シーケンス ]
```

[適当な投稿の ID (`1807340962626290079`)](https://x.com/T28_tatsuya/status/1807340962626290079) を見てみる。
2進数に変換すると 61 ビットのデータ量であることが分かる。

```js
BigInt("1807340962626290079").toString(2);
// '1100100010100111101110000011110100001010110100100000110011111'

BigInt("1807340962626290079").toString(2).length;
// 61
```

下位 12ビット・10ビットを切り捨ててタイムスタンプを取得する。 タイムスタンプは基準時刻 (Twitter の場合は `1288834974657` [^1]) からの経過ミリ秒。

```js
new Date(
  Number(((BigInt("1807340962626290079") >> 12n) >> 10n) + 1288834974657n),
).toISOString();
// '2024-06-30T09:10:38.918Z'
```

## SQLite のデータ型

SQLite は[5種類のデータ型](https://www.sqlite.org/datatype3.html#storage_classes_and_datatypes) がある。

> - **NULL.** The value is a NULL value.
> - **INTEGER.** The value is a signed integer, stored in 0, 1, 2, 3, 4, 6, or 8 bytes depending on the magnitude of the value.
> - **REAL.** The value is a floating point value, stored as an 8-byte IEEE floating point number.
> - **TEXT.** The value is a text string, stored using the database encoding (UTF-8, UTF-16BE or UTF-16LE).
> - **BLOB.** The value is a blob of data, stored exactly as it was input.

Snowflake ID (整数) を入れるなら `INTEGER` 型が第一候補になりそうだが、結局 `TEXT` にした (後述)。

## Edge/JSON/ブラウザ 環境で BigInt を使う

JavaScript の整数は53ビットまでしか表現出来ない。

```js
Number.MAX_SAFE_INTEGER.toString(2).length;
// 53
```

そのため、仮に SQLite に Snowflake ID (BigInt) を数値として入れても、取り出したときに[丸め誤差](https://ja.wikipedia.org/wiki/%E6%B5%AE%E5%8B%95%E5%B0%8F%E6%95%B0%E7%82%B9%E6%95%B0#%E3%82%A8%E3%83%A9%E3%83%BC%EF%BC%88%E8%AA%A4%E5%B7%AE%EF%BC%89)の影響を受ける。

```js
1807340962626290079;
// 1807340962626290200
```

また[JSON は BigInt に対応していない](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/BigInt#:~:text=BigInt%20%E5%80%A4%E3%81%AF%E6%97%A2%E5%AE%9A%E3%81%A7%20JSON%20%E3%81%AE%E3%82%B7%E3%83%AA%E3%82%A2%E3%83%A9%E3%82%A4%E3%82%BA%E3%81%AB%E5%AF%BE%E5%BF%9C%E3%81%97%E3%81%A6%E3%81%84%E3%81%AA%E3%81%84)ため、
シリアライズすると誤差が出る。

```js
JSON.stringify({ a: 12345678901234567890 });
// '{"a":12345678901234567000}'
```

[Twitter も言っている](https://docs.x.com/fundamentals/x-ids#:~:text=you%20should%20always%20use%20the%20string)ので、BigIntの値は文字列としてやりとりする。

## TEXT 型の ID でソートする

SQLite でソートする場合、`INTEGER` 型なら普通に大小比較をしてくれる。

```shell
$ echo "CREATE TABLE numbers(value INTEGER);
INSERT INTO numbers VALUES(2), (10), (100);
SELECT * FROM numbers ORDER BY value" | sqlite3
2
10
100
```

一方`TEXT` 型だと辞書順になるので、桁が異なると困る。

```shell
$ echo "CREATE TABLE numbers(value TEXT);
INSERT INTO numbers VALUES('2'), ('10'), ('100');
SELECT * FROM numbers ORDER BY value" | sqlite3
10
100
2
```

そのため SQLite へ INSERT するまえに 0 埋めをして桁を揃えることで辞書順でも大小比較出来るようにする。
また、SELECT した後は 0 を消す。

[drizzle の custom type](https://orm.drizzle.team/docs/custom-types) を定義する場合は、こんな処理を入れる。

```ts
const snowflakeId = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return "text";
  },
  toDriver(value) {
    // Pad-zero
    return value.padStart(SNOWFLAKE_ID_MAX_DIGIT_NUMBER, "0");
  },
  fromDriver(value) {
    // Remove padded zeros
    return value.replace(/^0+/, "");
  },
});
```

ちなみに `SNOWFLAKE_ID_MAX_DIGIT_NUMBER` は 20 で計算している。

```js
(2n ** 64n - 1n).toString(2);
// '1111111111111111111111111111111111111111111111111111111111111111'
(2n ** 64n - 1n).toString().length;
// 20;
```

[^1]: 基準時刻が `1288834974657` であることのソースが見つからない。検索するとさも当然な感じで計算する記事が沢山ある。
