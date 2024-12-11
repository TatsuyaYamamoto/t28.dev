---
title: "AI 学習に関する SNS 毎の規約(など)を見てみる 2024"
date: 2024-12-11
---

なんやかんやあって、SNS 毎の AI 学習に対するスタンスを調べたので、規約文などのメモを残す。

## X/Twitter

### 規約

https://x.com/ja/tos

> お客様は、このライセンスに、当社が（i）**お客様によって提供されたテキストやその他の情報**を分析し、その他の方法で本サービスを提供、促進、改善する**権利**（生成型か他のタイプかを問わず、**当社の機械学習や人工知能モデルへの使用やトレーニング**など）、および（ii）当社のコンテンツ利用規約に従い、サービスにまたはサービスを通じて送信されたコンテンツを他の企業、組織、または個人が利用できるようにする権利（サービスの改善、および他のメディアやサービスでのコンテンツのシンジケーション、放送、配信、リポスト、プロモーション、公開など）が**含まれることに同意するもの**とします。

「X/Twitter に投稿したものを機械学習する」って規約文に書いてある。

### robots.txt

https://x.com/robots.txt

Google のクローラーにだけ部分的に許可を出しているけれど、それ以外のクローラー全てに対して巡回を拒否している。

## Bluesky

### 規約

https://bsky.social/about/support

2024/12/11 時点では規約上での機械学習に関する言及がない。

### 公式の投稿

規約ではないからなんとも言えないけれど、[公式の投稿で「AI学習しないと宣言」をしている](https://bsky.app/profile/bsky.app/post/3layuzbti6s2x)。
**規約ではないけれど**。

> We do not use any of your content to train generative AI, and have no intention of doing so.

Bluesky に投稿されたコンテンツをBlueskyが生成AIの学習に使うことはない、とのこと。

> Bluesky uses AI internally to assist in content moderation, which helps us triage posts and shield human moderators from harmful content. We also use AI in the Discover algorithmic feed to serve you posts that we think you’d like.
>
> None of these are Gen AI systems trained on user content.

Blueskyの社内で AI は使用している:

- 有害なコンテンツからの保護
- Discover アルゴリズム フィードでの投稿提供

ただしこれらを実現するためにユーザーコンテンツを学習していないらしい。
その場合、何を使って AI を構築しているのだろう...。

### robots.txt

https://bsky.app/robots.txt

> By default, may crawl anything on this domain.

明確にクローラーによる巡回を許可している。

## Meta (Facebook/Instagram/Threads)

### 規約

https://www.facebook.com/privacy/genai

> Metaでは、オンラインに公開されている情報と、使用許諾を受けた情報を使用しています。また、Metaの製品やサービスでシェアされた情報も使用しています。

「Meta のサービスに投稿したものを機械学習する」って規約文に書いてある。

### robots.txt

https://www.instagram.com/robots.txt

https://www.threads.net/robots.txt

https://www.facebook.com/robots.txt

> Collection of data on Instagram through automated means is prohibited unless you have express written permission from Instagram and may only be conducted for the limited purpose contained in said permission.

クローラーによる巡回は禁止。

## まとめ

- X/Twitter は「X/Twitter は投稿物を AI 学習するけれど、クローラーの巡回は許さん」
- Bluesky は「Bluesky は投稿物を AI 学習をしないけれど、クローラーの巡回は許す」
- Meta は「Meta は投稿物を AI 学習するけれど、クローラーの巡回は許さん」
