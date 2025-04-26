---
title: "自作 PC パーツ選定メモ"
date: 2025-04-21
---

デスクトップ PC がうんともすんとも言わなくなったので、自作 PC に挑戦してみようと思います。[はい](https://x.com/KonaTsukine/status/1704681369752997930)。

## 自作に必要なパーツ

おあつらえ向きなページがあったので、これを参考にする ([初心者のためのPC組み立て完全ガイド](https://jp.msi.com/Landing/how-to-build-a-pc))。

> オリジナルPCを作る理由
>
> つまり…自分で組み立てるPCはとてもクールなのです！

ええやん 😎

> パート1 : PCパーツの紹介
>
> - CPU
> - CPUクーラー
> - マザーボード
> - メモリ
> - グラフィックスカード
> - ハードドライブ
> - 電源
> - ケース
> - 周辺機器

このリストを参考にしつつ、あわよくば今の PC から流用できるパーツがあればよいなぁ〜って感じ。

## CPU

Windows PC では Intel しか使ったことないけれど、なにはともあれ、AMD を使ってみたい。
[今どきの DTM 的にも AMD で良さそう](https://note.com/kagome_p/n/n00e90a29c1c1#d1d5352e-4b71-49e0-825e-2cd85c9025da)だし。

### Ryzen

https://www.amd.com/ja/products/processors/desktops/ryzen.html#specifications

表でまとまっているの、助かる。型番の読み方は "[AMD Ryzenシリーズ「3 / 5 / 7 / 9」世代一覧と性能差まとめ](https://chimolog.co/amd-ryzen-gen-guide/)" が分かりやすかった。

せっかくだし新しいモデルから、いい感じのものを選びたい。

### X3D vs X

https://chimolog.co/amd-ryzen-gen-guide/

> 別売りのグラフィックボードを用意するなら、高性能タイプの「X」モデルがおすすめです。CPU処理性能に特化した設計になっていて、ゲーミング性能も優秀です。
>
> ただし、ハイエンドクラスのグラボを使う予定なら、ゲーム高性能タイプの「X3D」モデルも要検討。CPU処理性能がわずかに下がる代わりに、ゲーム性能はもはや別物の次元に。

ハイエンドクラスのグラボを載せる予定ないし、ゲームもちょっとやってみたいレベルなので、「X」で良いかな。
[モンハンくれるキャンペーンで X3D は対象外](https://amd-heroes.jp/sp/amd_monsterhunter_2025Q1_vol1/) ってことは、自分(カジュアルユーザー)には X シリーズで十分ってことだろうし。

### 9950X vs 9900X vs 9700X

|                                                                                                               |        |              |
| :------------------------------------------------------------------------------------------------------------ | :----- | :----------- |
| [Ryzen 9 9950X](https://www.amd.com/ja/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x.html) | 16コア | 10万円くらい |
| [Ryzen 9 9900X](https://www.amd.com/ja/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9900x.html) | 12コア | 7万円くらい  |
| [Ryzen 7 9700X](https://www.amd.com/ja/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9700x.html) | 8コア  | 5万円くらい  |

うーん、高かろう性能よかろう...なのか？

- [「Ryzen 9 9950X」「Ryzen 9 9900X」は“約束された”最強のCPUになれたのか？　ベンチマークで見えた利点と欠点](https://ascii.jp/elem/000/004/215/4215697/)
- [低発熱＆低消費電力でも性能が向上した「Ryzen 7 9700X」「Ryzen 5 9600X」のアプリ＆AI処理性能に驚いた](https://ascii.jp/elem/000/004/214/4214559/)

いくつかの記事を見ると、`9700X` で十分じゃね？って気もしてくる。と、同時に比較と言っても実行する物によって全然違うことが分かった...。

DTM 用途を考えると、Studio One も~~とっくに~~[マルチコア対応している](https://icon.jp/archives/17115)し、コア数は積んでおいた方が無難な気もしてくる。
でも、そんなに山盛りトラック・プラグインのプロジェクトを作るのかい？って考えると...まぁ...なさそう。

> It is recommended that you go with an I7 processor or higher with 4 cores or more.
>
> ref: [Studio One 6: I'm thinking of buying a new computer. What are some things that I should consider?](https://support.presonus.com/hc/en-us/articles/9163185655053-Studio-One-6-I-m-thinking-of-buying-a-new-computer-What-are-some-things-that-I-should-consider)

Studio One が 4コア以上を推奨って言っているし、倍の8コアあれば十分やろ！って気がしてきた！

## PC ケース

### 白いの

見た目から入るタイプなのは、そう。他にも理由あるけど。でも、白 PCって可愛いと思う。[今使っているキーボードも白](https://www.logicool.co.jp/ja-jp/shop/p/mx-keys-mini.920-010517) だし！
ってことで、[MPG GUNGNIR 110R WHITE](https://jp.msi.com/PC-Case/MPG-GUNGNIR-110R-WHITE) なんて良いんじゃないかな〜！
他のモデルもあるけど、[でかいし！](https://jp.msi.com/PC-Cases/Products#?tag=MPG-Series&compare=TVBHLUdVTkdOSVItMTEwUi1XSElURQ==,TVBHLUdVTkdOSVItMzAwUi1BSVJGTE9X,TUFHLUZPUkdFLTMyMFItQUlSRkxPVw==,TUFHLVBBTk8tTTEwMFItUFo=)

|                                                                             |               |
| :-------------------------------------------------------------------------- | :------------ |
| [MPG GUNGNIR 110R WHITE](https://jp.msi.com/PC-Case/MPG-GUNGNIR-110R-WHITE) | 1.5万円くらい |

### MEG/MPG/MAG?

MSI (メーカー) 内に色々ブランドがあるらしい。ま、あまり気にしなくていいや！

- MEGシリーズ：最高峰のゲーム体験を追求するエンスージアストへ
- MPGシリーズ：優れたパフォーマンスを楽しみながら、自分らしいスタイルを表現したい方へ
- MAGシリーズ：安定性と耐久性に優れ快適なゲーム体験を実現する、全ての方に向けたシリーズ

https://jp.msi.com/news/detail/MSI-Gaming-Reveals-New-Symbols-to-Identify-the-New-MEG--MPG--and-MAG-Series140188

## マザーボード

`MPG GUNGNIR 110R WHITE` とメーカーをあわせつつ、白いものを選んでいきたい所存。

### マザーボードのサイズ

[マザーボードは主にATX、microATX、Mini-ITXの3種類がある](https://www.ask-corp.jp/guide/pc-parts-pc-case.html)ようだけど、`MPG GUNGNIR 110R WHITE` はどれにも対応しているっぽい。

> Support MB Form Factor
>
> ATX / Micro-ATX / Mini-ITX

### 白いの

ケースが白なら、マザボも白だよな〜。 `MPG GUNGNIR 110R WHITE`とメーカーをあわせつつ、白いもので選ぶとこれ:

|                                                                                 |               |
| :------------------------------------------------------------------------------ | :------------ |
| [MPG X870E EDGE TI WIFI](https://jp.msi.com/Motherboard/MPG-X870E-EDGE-TI-WIFI) | 5.5万円くらい |
| [MPG B850 EDGE TI WIFI](https://jp.msi.com/Motherboard/MPG-B850-EDGE-TI-WIFI)   | 4.5万円くらい |

[EDGE (白) と CARBON (黒) の違い](https://jp.msi.com/Motherboards/Products#?tag=MPG-Series&compare=TVBHLVg4NzBFLUVER0UtVEktV0lGSQ==,TVBHLVg4NzBFLUNBUkJPTi1XSUZJ) は色だけかと思ったけれど、ちょっと違う。けど、[色違いってことでいいや](https://weekly.ascii.jp/elem/000/004/251/4251696/#:~:text=%E3%80%8Cedge%E3%80%8D%E3%81%AFmsi%E3%81%AE%E3%83%9B%E3%83%AF%E3%82%A4%E3%83%88%E3%83%9E%E3%82%B5%E3%82%99%E3%83%BC%E3%83%9B%E3%82%99%E3%83%BC%E3%83%88%E3%82%99%E3%81%AE%E7%9B%AE%E5%8D%B0%E3%80%82)。

[大事な差は USB4 の有無って感じ](https://www.youtube.com/watch?v=x2ZEfh97-7k)だけれど、USB4 は...まだ使わないかな...。

(他のメーカーの B850 モデルと比べるとちょっと高い...? って思ったけれど、いいの。これが、いいの。)

## CPU クーラー

### 空冷 vs 簡易水冷

DTM 用途だと静音性が気になるんだけれど、[空冷式の方が静かなのか](https://chimolog.co/bto-cpu-air-vs-aio/)、[水冷式の方が静かなのか](https://www.sycom.co.jp/media/archives/1269/)分からん！
コスト・メンテナンス性を考慮すると空冷式に軍配が上がるみたいだけれど、一応ハイエンド CPU だし、水冷に挑戦してみたい（えいやっ）。

### ラジエーターのサイズ

`MPG GUNGNIR 110R WHITE` には標準でファンが付いているっぽい。

> Pre-install Fan
>
> Front: 3 x 120 mm Rear: 1 x 120 mm

標準ファンを付ける場合、`Top: 120 / 240 mm` に設置する 1択だ。

> Radiator Layout
>
> Front: 120 / 140 / 240 / 280 / 360 mm
> Top: 120 / 240 mm
> Rear: 120 mm

何とは言わんが、 [NZXT](https://nzxt.com/ja-JP/collection/kraken) 製のものが気になる。 ディスプレイがあるの、いいね〜

サイズは 3種類 (240mm/280mm/360mm) あるけれど、`MPG GUNGNIR 110R WHITE` の `Top` に付けるから候補は 2つ:

|                                                                             |               |
| :-------------------------------------------------------------------------- | :------------ |
| [Kraken 240 RGB](https://nzxt.com/ja-JP/product/kraken-240-rgb)             | 2万円くらい   |
| [Kraken Elite 240 RGB](https://nzxt.com/ja-JP/product/kraken-240-elite-rgb) | 3.5万円くらい |

`9700X` の TDP が 65W と[低発熱なモデル](https://ascii.jp/elem/000/004/214/4214559/)っぽいので、`Kraken 240 RGB` で十分っぽそうだ。~~でも、空冷でも問題ないのかもしれないな...。~~

## ハードドライブ

[迷ったので](https://chimolog.co/wd-black-sn7100/)、[WD Black SN7100](https://kakaku.com/item/K0001673420/) にしました。
[NAND メモリがキオクシア製 (国産)](<https://chimolog.co/wd-black-sn7100/#:~:text=%E3%82%AD%E3%82%AA%E3%82%AF%E3%82%B7%E3%82%A2(%E6%97%A7%E6%9D%B1%E8%8A%9D%E3%83%A1%E3%83%A2%E3%83%AA)%E3%81%8B%E3%82%99%E3%81%84%E3%81%A4%E3%82%82%E3%81%A8%E3%82%99%E3%81%8A%E3%82%8Anand%E3%83%A1%E3%83%A2%E3%83%AA%E3%82%92%E4%BD%9C%E3%82%8A>) なのも、なんとなく、良い。

|                                                               |             |
| :------------------------------------------------------------ | :---------- |
| [WD Black SN7100 (2TB)](https://kakaku.com/item/K0001673420/) | 2万円くらい |

## グラフィックスカード

### NVIDIA GeForce の型番

分かりやすい。

https://chimolog.co/bto-gpu-card-guide/

## メモリ

`Ryzen 7 9700X` は DDR5-5600 まで対応しているみたいだから DDR5 を狙いたいところだけれど、[DTM 用途だとあまりこだわらなくてもいいかも](https://note.com/kagome_p/n/n00e90a29c1c1#:~:text=ddr4%20%E3%81%A8%E6%AF%94%E8%BC%83%E3%81%97%E3%81%A6%E3%82%82%E3%80%81%E8%A8%80%E3%81%86%E3%81%BB%E3%81%A8%E3%82%99%E3%80%8C%E9%80%9F%E3%81%84%E3%80%8D%E3%81%A8%E8%A8%80%E3%81%88%E3%82%8B%E6%84%9F%E3%81%97%E3%82%99%E3%81%97%E3%82%99%E3%82%83%E3%81%AA%E3%81%84%E3%81%A6%E3%82%99%E3%81%99)。

> 最大メモリ速度
>
> 2x1R DDR5-5600
> 2x2R DDR5-5600
> 4x1R DDR5-3600
> 4x2R DDR5-3600

[Crucial の 16GB x 2 のやつ](https://kakaku.com/pc/pc-memory/itemlist.aspx?pdf_ma=1746&pdf_Spec105=2&pdf_Spec301=16) を探して...白いので！

|                                                                  |                        |               |
| :--------------------------------------------------------------- | :--------------------- | ------------- |
| [crucial　CP2K16G4DFRA32A](https://kakaku.com/item/K0001540695/) | 16GB, DDR4             | 0.8万円くらい |
| [crucial　CP2K16G56C46U5](https://kakaku.com/item/K0001540697/)  | 16GB, DDR5             | 1.2万円くらい |
| [crucial　CP2K16G64C38U5B](https://kakaku.com/item/K0001661307/) | 16GB, DDR5             | 1.3万円くらい |
| [crucial　CP2K16G60C36U5W](https://kakaku.com/item/K0001633533/) | 16GB, DDR5, ホワイト！ | 1.3万円くらい |

## 電源

### 白いの

なんやかんやで Corsair の White に興味があるわけですが、どうやら [Corsair RM850 2021](https://chimolog.co/bto-best-psu/#%E3%80%90%E4%B8%87%E4%BA%BA%E5%90%91%E3%81%91%E3%80%91Corsair_RM850_2021) が良さげ。

[リストを見る限り](https://kakaku.com/pc/power-supply/itemlist.aspx?pdf_ma=694)、RM850 はちょっと古くて (2021年製)、RM850x Shift が新しそう (2024年製)。
RM は RMx の[廉価版](https://chimolog.co/bto-best-psu/#:~:text=%E5%BB%89%E4%BE%A1%E3%83%8F%E3%82%99%E3%83%BC%E3%82%B7%E3%82%99%E3%83%A7%E3%83%B3)で、Shift になっていると[メンテナンスが楽](https://www.corsair.com/jp/ja/explorer/diy-builder/power-supply-units/explaining-the-corsair-psu-lineup/?srsltid=AfmBOoq9HMj_lpfZJscc4YLPIIIMQlmgUScGdcOeSJha-ol2Yr1naoFo#)らしい (作ったことないからイメージつかないけど...)。

ちょうど RM850x が値下がっていて RM750x とほとんど価格が同じだから...`RM850x` で！大は小を兼ねてるって信じてる！

|                                                                          |               |     |
| :----------------------------------------------------------------------- | :------------ | :-- |
| [RM850x Shift White CP-9020274-JP](https://kakaku.com/item/K0001619998/) | 2.1万円くらい |     |
| [RM850 White 2021 CP-9020232-JP](https://kakaku.com/item/K0001394498/)   | 1.9万円くらい |     |

### 電源のサイズ

電源ユニットの規格とサイズには[ATX, EPS, SFX がある](https://kakaku.com/pc/power-supply/guide_0590/#sec02-1:~:text=%E3%81%8A%E3%81%8D%E3%81%BE%E3%81%97%E3%82%87%E3%81%86%E3%80%82-,%E9%9B%BB%E6%BA%90%E3%83%A6%E3%83%8B%E3%83%83%E3%83%88%E3%81%AE%E8%A6%8F%E6%A0%BC%E3%81%A8%E3%82%B5%E3%82%A4%E3%82%B9%E3%82%99,-%E8%A6%8F%E6%A0%BC)。

`MPG GUNGNIR 110R WHITE` は ATX に対応しているので、`RM850x Shift` は問題なし！

> 電源 ATX
> 収容可能最大PSUサイズ 250 mm / 9.84 inches

## PCPartPicker

https://pcpartpicker.com/list/q4sQxg
