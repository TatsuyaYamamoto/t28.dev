---
title: "Node.js のリリースサイクル・バージョンを理解する"
date: 2021-10-18
description: "Node.js の Release Phases/Plan を整理して、正しくLTSを使えるようになる"
---

[公式ドキュメント](https://nodejs.org/en/about/releases/) 、Github の [README](https://github.com/nodejs/Release) 、[Issues](https://github.com/nodejs/Release/issues/76) を見た。

## Release Phases

- Node.js のリリースの状態には、**Current** 、 **Active LTS** がある。
- Current release status
  - non-breaking な変更が組み込まれる
- LTS (long-term support) status
  - "LTS になった" === "ready for general use"
  - LTS は更に 2 種類に分かれる。
    - Active LTS
      - LTS チームが適切で安定と判断された、新機能とバグ修正が入る。
    - Maintenance LTS
      - 重大なバグとセキュリティアップデータが入る。
- メジャーバージョンの範囲で、Current から LTS に移行する。
  - 「v14 は LTS」 は**間違い**。
  - 「[v14 は 14.15.0 以上が LTS](https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V14.md) 」が正しい。

## Release Plan

- 6 ヶ月毎に major version がリリースされる。
- **奇数番号リリース** と **偶数番号リリース** で、サイクルが異なる。
  - 奇数番号リリース
    - 10 月にリリースされる。
    - Current release status が終わったら、サポート対象外になる。
      - 正確には、 2 ヶ月だけ Maintenance LTS 期間がある(long-term とは?)
  - 偶数番号リリース
    - 4 月にリリースされる。
    - Current release status が終わったら、LTS status に移行する。
      - 12 ヶ月間 Active, 18 ヶ月間 Maintenance (LTS 期間は 合計 30 ヶ月)。
- 新しい奇数番号リリースと連携して、以前の偶数番号リリースは LTS に移行する。

これらをまとめると、👇 の流れ。

```
偶数バージョン初回リリース
↓
6ヶ月後
  偶数バージョン Active LTS 開始 (ここから 12ヶ月間)
  次奇数バージョン 初回リリース
↓
さらに6ヶ月後
　次偶数バージョン　初回リリース
↓
さらに6ヶ月後
　偶数バージョン Maintenance LTS 開始 (ここから 18ヶ月間)
　次偶数バージョン Active LTS 開始 (ここから 12ヶ月間)
↓
さらに18ヶ月後
　偶数バージョン サポート終了
```

## おまけ

~~解りやすいのか解りにくいのか分からんけど、~~ [wiki のリリース情報](https://ja.wikipedia.org/wiki/Node.js) を元に直近のリリース日をテーブルにまとめてみた。

| date    | v12                  | v13                  | v14                  | v15                  | v16                  | v17                  |
| :------ | :------------------- | :------------------- | :------------------- | :------------------- | :------------------- | :------------------- |
| 2019/04 | 初回リリース         | -                    | -                    | -                    | -                    | -                    |
| 2019/10 | Active LTS 開始      | 初回リリース         | -                    | -                    | -                    | -                    |
| 2020/04 | -                    | Maintenance LTS 開始 | 初回リリース         | -                    | -                    | -                    |
| 2020/06 | -                    | サポート終了         | -                    | -                    | -                    | -                    |
| 2020/10 | -                    | -                    | Active LTS 開始      | 初回リリース         | -                    | -                    |
| 2020/11 | Maintenance LTS 開始 | -                    | -                    | -                    | -                    | -                    |
| 2021/04 | -                    | -                    | -                    | Maintenance LTS 開始 | 初回リリース         | -                    |
| 2021/06 | -                    | -                    | -                    | サポート終了         | -                    | -                    |
| 2021/10 | -                    | -                    | Maintenance LTS 開始 | -                    | Active LTS 開始      | 初回リリース         |
| 2022/04 | サポート終了         | -                    | -                    | -                    | -                    | Maintenance LTS 開始 |
| 2022/10 | -                    | -                    | -                    | -                    | Maintenance LTS 開始 | -                    |
| 2023/04 | -                    | -                    | サポート終了         | -                    | -                    | -                    |
