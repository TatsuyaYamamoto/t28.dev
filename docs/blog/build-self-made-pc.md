---
title: "自作 PC 組み立てメモ"
date: 2025-05-18
---

[自作 PC 用に選定したパーツ](./self-made-pc-parts) の購入が完了したので、組み立てに取り掛かりました。

## パーツリスト

|                    | パーツ                                                                                                                                                                                                                                          | マニュアル                                                                                                  |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| PC ケース          | [MPG GUNGNIR 110R WHITE](https://jp.msi.com/PC-Case/MPG-GUNGNIR-110R-WHITE)                                                                                                                                                                     | [PDF](https://download-2.msi.com/archive/mnu_exe/case/GUNGNIR110R_110M_110L_111R_111M.pdf)                  |
| マザーボード       | [MPG B850 EDGE TI WIFI](https://jp.msi.com/Motherboard/MPG-B850-EDGE-TI-WIFI)                                                                                                                                                                   | [PDF](https://download-2.msi.com/archive/mnu_exe/mb/MPGB850EDGETIWIFI_Japanese.pdf)                         |
| CPU                | [Ryzen 7 9700X](https://www.amd.com/ja/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9700x.html)                                                                                                                                   |
| CPU クーラー       | [Kraken 240 RGB](https://nzxt.com/ja-JP/product/kraken-240-rgb)                                                                                                                                                                                 | [PDF](https://www.datocms-assets.com/34299/1681980278-cooling_kraken-rgb_digital-manual_v3_230221.pdf) [^1] |
| SSD                | [WD Black SN7100 (2TB)](https://kakaku.com/item/K0001673420/)                                                                                                                                                                                   |
| メモリ             | [crucial　CP2K16G64C38U5W](https://www.crucial.jp/memory/ddr5/CP2K16G64C38U5W)                                                                                                                                                                  |
| 電源               | [Corsair RM850x Shift White CP-9020274-JP](https://www.corsair.com/jp/ja/p/psu/cp-9020274-jp/rm850x-shift-80-plus-gold-fully-modular-atx-power-supply-white-jp-cp-9020274-jp?srsltid=AfmBOooBlApKyqLJIvt_RlUpGQZ4xnDw7ojvXB-ecVN6dx7oqZelY8to#) |
| グラフィックボード | 旧 PC の使いまわし 🥳                                                                                                                                                                                                                           |

## 組み立ての参考にしたやつ

## あれこれつなぐ

### マザーボードのコンポーネント

マザーボードに何を繋げばいいか、難しすぎでしょ？？？

| コンポーネント名 |                                           | 何とつなげる？                                                          | NOTE                                                                                                                                                                                                                                   |     |
| :--------------- | :---------------------------------------- | :---------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| ATX_PWR1         | 電源コネクター                            | 電源                                                                    |
| CPU_PWR1         | 電源コネクター                            | 電源                                                                    | 電源供給用 (プライマリ) (ref: [reddit - CPU power 1 and 2 question](https://www.reddit.com/r/buildapc/comments/1hx9zrj/cpu_power_1_and_2_question/))                                                                                   |
| CPU_PWR2         | 電源コネクター                            | 電源                                                                    | 電源供給用 (補助電源)                                                                                                                                                                                                                  |
| PCIE_PWR1        | 電源コネクター                            | 電源                                                                    | 複数の PCIe デバイスや消費電力の大きい PCIe デバイスを使うとき用 (ref: [msi - FAQ](https://www.msi.com/faq/10875))                                                                                                                     |
| CPU_FAN1         | ファンコネクター                          | `Kraken 240 RGB` の `M1 Pump 3-Pin connector`                           |                                                                                                                                                                                                                                        |
| PUMP_SYS1        | ファンコネクター                          |                                                                         |                                                                                                                                                                                                                                        |
| SYS_FAN1         | ファンコネクター                          | `MPG GUNGNIR 110R WHITE` の ファンコネクタ (1)                          |                                                                                                                                                                                                                                        |
| SYS_FAN2         | ファンコネクター                          | `MPG GUNGNIR 110R WHITE` の ファンコネクタ (2)                          |                                                                                                                                                                                                                                        |
| SYS_FAN3         | ファンコネクター                          | `MPG GUNGNIR 110R WHITE` の ファンコネクタ (3)                          |                                                                                                                                                                                                                                        |
| SYS_FAN4         | ファンコネクター                          | `MPG GUNGNIR 110R WHITE` の ファンコネクタ (4)                          |                                                                                                                                                                                                                                        |
| SYS_FAN5         | ファンコネクター                          |                                                                         |                                                                                                                                                                                                                                        |
| SYS_FAN6         | ファンコネクター                          |                                                                         |                                                                                                                                                                                                                                        |
| JUSBC1           | USB 20Gbps Type-Cフロントパネルコネクター | `MPG GUNGNIR 110R WHITE` の `USB 3.2 Gen2`                              | 20Gbps なので、 ~~`USB4 Gen 2x2`~~ か `USB 3.2 Gen 2x2` [^2]                                                                                                                                                                           |
| JUSB2            | USB 5Gbpsコネクター                       | `MPG GUNGNIR 110R WHITE` の `USB 3.2 Gen1`                              | 5Gbpsなので、`USB 3.2 Gen 1x1` か ~~`USB 3.1 Gen 1`~~ か ~~`USB 3.0`~~ [^2]                                                                                                                                                            |
| JUSB3            | USB 5Gbpsコネクター                       |                                                                         |                                                                                                                                                                                                                                        |
| JUSB4            | USB 2.0コネクター                         | `Kraken 240 RGB` の `M3 USB Connector` (USB2.0内部ヘッダー)             |                                                                                                                                                                                                                                        |
| JUSB5            | USB 2.0コネクター                         | `Kraken 240 RGB` の `O2 Internal USB Cable` (内部のUSB2.0ヘッダー)      |                                                                                                                                                                                                                                        |
| JPWRLED1         | LED電源入力                               |                                                                         |                                                                                                                                                                                                                                        |
| JRGB1            | RGB LEDコネクター                         |                                                                         | JRGBコネクターは 5050 RGB LEDストリップ12Vに接続する                                                                                                                                                                                   |
| JARGB_V2_1       | A-RAINBOW V2 (ARGB Gen2) LEDコネクター    | `MPG GUNGNIR 110R WHITE` の `1 to 6 ARGB (3 pin) Control Board`         | JARGB_V2コネクターは ARGB Gen2 と ARGB LEDストリップ に接続する (定格最大出力は3A (5V))                                                                                                                                                |
| JARGB_V2_2       | A-RAINBOW V2 (ARGB Gen2) LEDコネクター    |                                                                         |                                                                                                                                                                                                                                        |
| JARGB_V2_3       | A-RAINBOW V2 (ARGB Gen2) LEDコネクター    |                                                                         |                                                                                                                                                                                                                                        |
| JAUD1            | フロントオーディオコネクター              | `MPG GUNGNIR 110R WHITE` の `HDAUDIO`                                   |
| JBAT1            | クリアCMOS (BIOSリセット) ジャンパー      |                                                                         |                                                                                                                                                                                                                                        |
| JAF_2            | EZ Connヘッダー V2                        |                                                                         | システムファン用ヘッダー・12V ARGBヘッダー・USB2.0ヘッダーを1つのコネクターに統一している (ref: [msi - HOW TO指南：EZ Connコネクターとケーブルのご紹介](https://jp.msi.com/blog/how-to-use-msi-exclusive-ez-conn-connector-and-cable)) |
| JCI1             | ケース開放スイッチコネクター              |                                                                         |                                                                                                                                                                                                                                        |
| JFP1             | フロントパネルコネクター                  | `MPG GUNGNIR 110R WHITE` の `POWERLED+` `POWERLED-` `POWERSW` `RESETSW` |                                                                                                                                                                                                                                        |
| JFP2             | フロントパネルコネクター                  |                                                                         | Buzzer Speaker を繋げるコネクタっぽいけど、Buzzer Speaker が付属していない                                                                                                                                                             |
| JOCFS1 (JOC_FS1) | セーフブートジャンパ                      |                                                                         |                                                                                                                                                                                                                                        |
| SATA▼A1▲A2       | SATA 6Gb/sコネクター                      |                                                                         |                                                                                                                                                                                                                                        |
| SATA▼A3▲A4       | SATA 6Gb/sコネクター                      |                                                                         |                                                                                                                                                                                                                                        |

## 起動する

### msi Click Bios

https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12233947392

### インストールする

- [msi - \[マザーボード\]Windows USBインストールメディアを作成してWindows 10/11を再インストールする方法](https://jp.msi.com/support/technical_details/MB_OS_Installation)

- [msi - \[マザーボード\] マザーボードのドライバーのインストール/更新方法](https://jp.msi.com/support/technical_details/MB_Driver_Update)

- [](https://jp.msi.com/support/technical_details/MB_BIOS_Update)

## msi

|                              |                                                           |
| :--------------------------- | :-------------------------------------------------------- |
| Adobe Redeem Launcher        | 要らん                                                    |
| Dropbox Redeem Launcher      | 要らん                                                    |
| MSI Center                   |                                                           |
| AMD Chipset Drivers          | インストールされていないけど、まぁ、要るかな              |
| AMD Graphics Drivers         | 更新する                                                  |
| Qualcomm Bluetooth Drivers   | 更新する                                                  |
| Qualcomm Wi-Fi Drivers       | 更新する                                                  |
| Realtek HD Universal Drivers | インストールされていない -> 要る                          |
| Norton 360                   | 要らん                                                    |
| CPU-Z MSI GAMING             | [便利らしい](https://chimolog.co/bto-gaming-pc-settings/) |
| AIDA64 Extreme - MSI Edition | ハードウェアの情報が見られるらしい、とりま CPU-Z で良いや |
| Voicemod                     | 要らん                                                    |
| MSI Wallpaper                | 要らん                                                    |

## 設定

- https://pc-karuma.net/change-windows-11-user-folder-name/

[^1]: ドメインが謎 (`https://datocms-assets.com`) だけれど、[NZXT Japan の X アカウント](https://x.com/NZXTJapan/status/1547787019929063425)も貼っているものだから、正規？のもののはず

[^2]: マーケティング表記ってなんだよ？？？？ (https://www.buffalo.jp/topics/knowledge/detail/usb4.html)
