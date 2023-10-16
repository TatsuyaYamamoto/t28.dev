---
title: "Cloudflare のドメイン移管チェックリストを参考に Google domains から Cloudflare Registrar へドメインを移管する"
date: 2023/10/15
---

## Cloudflare のドメイン移管チェックリスト

[Squarespace が Google Domains を買収した](https://support.google.com/domains/answer/13689670?hl=ja) ので、Google Domains で管理していたドメインを[Cloudflare Registrar](https://developers.cloudflare.com/registrar/) に移管します(しました)。
Cloudflare が [ドメインを Cloudflare に移管するためのステップバイステップガイド](https://blog.cloudflare.com/ja-jp/a-step-by-step-guide-to-transferring-domains-to-cloudflare-ja-jp/) というポストで **ドメイン移管チェックリスト** を紹介していたので、これを参考に移管作業をしてみました。

> ドメインを新しいレジストラに移管することは日々行うことではありません。また、プロセスの手順を間違えるとダウンタイムや中断を招く可能性があります。そこで、今回の Speed Week でドメイン移管チェックリストをご用意しました。

SpeedWeek は [Cloudflare の新製品発表イベント](https://www.cloudflare.com/ja-jp/speed-week-2023/updates/) だけれど、あまりにもタイムリー(ポスト公開日が 2023/06/23!!)すぎる。

## 移管したいやつ

- t28.dev
  - このドメインはカスタムメールアドレスの設定も要る
- 他にもお仕事用ドメインとか

## 適格性の確認

### 1. Cloudflare のネームサーバーの利用を考えていることを確認します

> Cloudflare で登録されたドメインは、当社のネームサーバー以外を利用することはできません。

**=> Cloudflare の nameserver を設定できるので、OK!**

### 2. Cloudflare がお客様のドメインの TLD をサポートしていることを確認します

> 当社が[現在サポートしている TLD の全リストはこちら](https://www.cloudflare.com/tld-policies/)からご覧いただけます。

2023/8/3 に [Cloudflare 言及している通り](https://twitter.com/CloudflareDev/status/1686812617153593355)、 `.dev` ドメインも使えるようになった！

**=> 移管したいドメインがサポートされてる！OK!**

### 3. お客様のドメインがプレミアムドメインまたは国際化ドメイン名（IDN）でないことを確認します

`プレミアムドメイン` ?

> 文字列の希少価値が高く通常料金のドメインよりも高価格で提供している種類のドメイン
> ref: https://help.onamae.com/answer/15502

`国際化ドメイン名（IDN）` ?

> 英数字（ASCII）以外の文字を含むドメイン名
> ref: https://jprs.jp/glossary/index.php?ID=0029

**=> 使ってない！OK!**

### ドメインが過去 60 日以内に登録または移管されていないことを確認します

**=> 願う 🙏**

### WHOIS の登録者の連絡先情報が過去 60 日間に更新されていないことを確認します

**=> 願う 🙏**

## 移管前

### 現在のレジストラの資格情報を確認します

> お客様の現在のレジストラに関する資格情報がお手元にあることを確認します。何年もログインしておらず、パスワードのリセットが必要な場合があります。

**=> Google domains にはログイン出来る！ OK!**

### 現在の DNS の設定内容をメモします

> 問題が発生した場合に備えて現在の設定内容を記録しておくことをお勧めします。

**=> はーい！ 📝**

### WHOIS のプライバシーを解除します (必要な場合)

**=> エラーとか出たら考えます！ (=> 出なかった 🥰)**

### DNSSEC を無効にします

![unlock](./assets/transfer-google-domains-to-cloudflare-registrar/dnssec-disable.jpg)

**=> 無効にしました 👋**

### ドメインの更新を 15 日以内に控えている場合、ドメインを更新します

**=> 不要！**

### ドメインのロックを解除します

![unlock](./assets/transfer-google-domains-to-cloudflare-registrar/unlock.jpg)

**=> 解除しました 🔓**

### Cloudflare に登録します

> まだ Cloudflare のアカウントをお持ちでない方は、[こちらから登録してください](https://dash.cloudflare.com/sign-up)。

**=> あります 😘**

### お使いのドメインを Cloudflare に追加します

> [こちらの手順](https://developers.cloudflare.com/fundamentals/get-started/setup/add-site/)に従い、Cloudflare アカウントに新しいドメインを追加します。

domain を入力してボタンをポチると 👈

![](./assets/transfer-google-domains-to-cloudflare-registrar/add-domain.jpg)

レコードの読み込みもしてくれて便利〜 ✌️

![](./assets/transfer-google-domains-to-cloudflare-registrar/scan-records.jpg)

### Cloudflare アカウントに有効なクレジットカードを追加します

**=> した！🪪**

### Cloudflare の DNS レコードを見直します

> ドメイン追加後、[Cloudflare が自動的に設定した DNS レコード](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/#review-dns-records)と現在のレジストラで使用しているレコードと照合し、漏れがないことを確認します。

`お使いのドメインを Cloudflare に追加します` パートでレコードを自動で読み込んでくれましたが、私のケースでも漏れがありました。 Google Domains 側で bind ファイル (初めて知った) をエクスポートして、 Cloudflare 側で読み込ませればバッチリ。

![](./assets/transfer-google-domains-to-cloudflare-registrar/export-bind-file.jpg)

### DNS のネームサーバーを Cloudflare に変更します

![](./assets/transfer-google-domains-to-cloudflare-registrar/custom-name-server-in-google-domains.jpg)

**=> さらば Google Domains...(の、ネームサーバー) 😭**

### （オプション）Cloudflare Email Routing を設定します

> [メール転送機能](https://www.cloudflare.com/learning/email-security/what-is-email-routing/) を使用している場合、[こちらのガイドに従い、Cloudflare Email Routing に移行](https://blog.cloudflare.com/migrating-to-cloudflare-email-routing/)します。

既存の MX レコードとの競合エラーが発生していたので、 Google Domains からインポートした MX レコードを消して、 Cloudflare 用に新しいレコードを登録した。ダッシュボード上で消すべき・追加するべきレコードが勝手に表示されるから楽チン〜

### DNS の変更が反映されるまで待機します

> レジストラによるネームサーバーの更新処理は 24 時間かかることがあります。 Cloudflare がこれらの変更が反映されたことを確認すると、お客様宛にメールが届きます。このプロセスが完了するまで、ドメインの移管作業を続行することはできません。

**=> `$ dig t28.dev ns` で更新を確認した 💻**

(PC が繋げるネットワークによって新しい nameserver を確認できるタイミングがまちまちだったから、24 時間は見積もっておいた方が良いんだろうな〜)

## 移管手続きの開始と確認

### 認証コードを要求します

### Cloudflare への移管を開始します

### 移管にかかる価格を確認します

### 認証コードを入力します

### 連絡先情報の確認または入力を行います

### Cloudflare で移管を承認します

### 以前のレジストラで移管を承認します

### Cloudflare ダッシュボードで移管状況を確認します

## 移管後

### サイトとメールのテストを実施します

### 何か新しいものを構築します
