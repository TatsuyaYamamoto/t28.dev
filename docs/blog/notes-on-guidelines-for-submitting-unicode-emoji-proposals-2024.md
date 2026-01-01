---
title: "Emoji proposal を提出するためにガイドラインを読んだ"
date: 2024-08-01
---

[なんやかんや](https://x.com/T28_tatsuya/status/1779133467546329461)あって emoji proposal を提出したくなりました。
私が emoji proposal を提出するまで読んだガイドラインの詳細 (~~ただの和訳 or 意訳~~)や関連文書のメモを残しておきます。

_[Unicode](https://home.unicode.org/about-unicode/) と [Emoji](https://home.unicode.org/emoji/about-emoji/) の細かいところは、置いておく。_

## The Unicode Consortium

[The Unicode Consortium](https://www.unicode.org/consortium/consort.html) は Unicode 標準を開発している団体で、標準に**新しく含める emoji を一般から応募している**。

> The Unicode Consortium solicits proposals from the public for which new emoji should be considered for inclusion in the standard.
>
> ref: [About Emoji](https://home.unicode.org/emoji/about-emoji/)

## Guidelines for Submitting Unicode® Emoji Proposals

**[Guidelines for Submitting Unicode® Emoji Proposals](https://www.unicode.org/emoji/proposals.html)**

emoji は誰でも提案が出来ます（採用されるとは言っていない）。

> Anyone can submit an emoji proposal, but only a small fraction are accepted for encoding.

2024 年の提案期間は 4/2 ~ 7/31 で、

> Submissions will reopen April 2, 2024 and close at the end of day on July 31, 2024.

Google Forms で PDF を送る。

> Submit your proposal as a PDF with reference images using the [Unicode Emoji Submission Form](https://docs.google.com/forms/d/e/1FAIpQLSc4BxO5oygciuNnbp0FiIKhhorX3RSgA1QIuVx0o5Vo_og14Q/viewform?vc=0&c=0&w=1&flr=0&usp=mail_form_link).

当然、ガイドラインに準拠した完全な文書以外は処理してくれない(ので、ガイドラインを読み込む)。

> Submissions will not be processed unless they are complete and adhere to these Guidelines.

## 法的通知

**[Legal Notice](https://www.unicode.org/emoji/proposals.html#submission)**

「Emoji proposal の提出」は文書を作って送るだけではないです。

> your first step in this process is to read the [Emoji Proposal Agreement & License](https://unicode.org/emoji/emoji-proposal-agreement.pdf) that you will be required to agree to as part of your Submission.

The Unicode Consortium は提案する emoji における[広範な、取り消し不能な、永久的な、(略)、ライセンスを求めており](https://www.unicode.org/emoji/emoji-proposal-agreement.pdf)、提案者はこれに同意する必要があります。

端的に言えばあらゆる権利を放棄する(正確な表現ではない)ということです。
The Unicode Consortium が定めた標準にはオープンでフリーなライセンスが付与されていて、このライセンスに基づいてベンダーは emoji の実装をしています。
当然、一度 emoji が実装されれば削除することは出来ないです。
このような構造のため、提案者の権利を大きく制限する契約書になっています。

## 提案過程

**[Process](https://unicode.org/emoji/proposals.html#process)**

提案の流れがガイドラインにまとまっています。

### 1. 提案が考慮すべき要件をすべて満たしていることを確認する

> 1. Before preparing a document, ensure your proposal meets all of the requirements to be considered:

#### a. 既に承認されているか

> See if it’s already [been approved](https://www.unicode.org/emoji/charts/emoji-released.html).

承認されてたら、これ以上提案は不要。

#### b. 優先順位保留中・検討中・4 年以内に拒否されたか

> Scan the list of [Emoji Requests](https://unicode.org/emoji/emoji-requests.html) to see whether your proposed emoji has previously been submitted. Emoji that are listed as “Prioritization Pending” or “Under Consideration” do not require additional proposals. Emoji declined within the last four years are not eligible for re-review.

[リスト](https://unicode.org/emoji/emoji-requests.html) には 2015 年以降に提案された emoji が載っています。
執筆時点での通過状況を見てみると、全 1230 件の内、220 件が emoji としてリリースされています。 17.9% なので、高いような、低いような...。

| 状態                   | 件数 |
| :--------------------- | :--- |
| Declined               | 862  |
| Expired                | 109  |
| Prioritization Pending | 36   |
| Alpha Candidate        | 3    |
| Released as Emoji      | 220  |

なお、拒否された提案の一部がリストに入っていない可能性があるので、実際の値はもう少し下がりそうです。

> This list may not yet include all proposals that were forwarded on to the UTC document registry, but declined by the UTC.

#### c. 過去の提案を参考にしつつ、フォームをちゃんと埋める

> Familiarize yourself with previous [submission](https://unicode.org/emoji/proposals.html#example_proposals) proposals. Don’t skip any of the fields in the form. The Emoji Standard & Research Working Group receives a lot of Submissions, and complete proposals help them best evaluate them.

#### d. ガイドラインをよく読む

> Read this entire document, including the [Selection Factors](https://unicode.org/emoji/proposals.html#selection_factors).

#### e. FAQ を読む

> Read the [Emoji Submission FAQ](https://www.unicode.org/faq/emoji_submission.html) for common questions and their answers.

#### f. 自動的に拒否されるものがある

> Note that proposals will be automatically declined for [logos, brands, other third-party IP rights, UI icons, signage, specific people, specific buildings and landmarks, deities](https://unicode.org/emoji/proposals.html#Selection_Factors_Inappropriate), [Region flags without ISO 3166 code](https://unicode.org/emoji/proposals.html#Region_Flags_Without_Code), if it [includes text](https://unicode.org/emoji/proposals.html#Includes_Text), [requests an exact image](https://unicode.org/emoji/proposals.html#Exact_Images), proposes a [variation on direction](https://unicode.org/emoji/proposals.html#Direction_Variation), or if you [lack the required rights or license for images](https://unicode.org/emoji/proposals.html#Lack_Of_License).

[自動的に拒否される対象](https://unicode.org/emoji/proposals.html#automatically_declined):

- [ロゴ・ブランド・第三者の知的財産・UI アイコン・看板・特定の人物・特定の建物やランドマーク・神々](https://unicode.org/emoji/proposals.html#Selection_Factors_Inappropriate)
- [旗](https://unicode.org/emoji/proposals.html#Region_Flags_Without_Code)
- [画像に必要な権利・ライセンスが不足している](https://unicode.org/emoji/proposals.html#Lack_Of_License)
- [正確な画像](https://unicode.org/emoji/proposals.html#Exact_Images)
- [文字が含まれている](https://unicode.org/emoji/proposals.html#Includes_Text)
- [方向のバリエーション](https://unicode.org/emoji/proposals.html#Direction_Variation)

#### g. emoji 自体の説得力のみで提案は進められる

> Please do not justify the addition of an emoji because it furthers a “cause,” no matter how worthwhile. A proposal may be advanced despite a “cause” argument — if other factors are compelling — but will not be advanced because of it.

`たとえどれほど価値があるとしても、「大義」を促進するという理由で絵文字の追加を正当化しないでください。` (google 翻訳ママ)

### 2. 提案文書を準備する

> 2. Prepare your proposal document:

#### a. すべての質問に可能な限り完全に対処する

> Your document must contain all of the sections shown in the format below, provide empirical evidence, and address all of the questions specified there as completely as possible.

#### b. すべての基準を満たしていることを確認する

> Capture screenshots of usage frequency to include in your proposal to ensure it is relevant and meets all of the criteria.

#### c. 画像を用意する

> Create or procure open-source supporting example images.

### 3. 提案文書を確認する

> 3. Review your proposal document to confirm it is complete, has all of the necessary frequency citations, the images are not copyrighted, and meets all of the [selection factors](https://unicode.org/emoji/proposals.html#selection_factors).

### 4. 提出する

> 4. Submit your proposal as a PDF with reference images using the [Unicode Emoji Submission Form](https://docs.google.com/forms/d/e/1FAIpQLSc4BxO5oygciuNnbp0FiIKhhorX3RSgA1QIuVx0o5Vo_og14Q/viewform?vc=0&c=0&w=1&flr=0&usp=mail_form_link). Your complete “Submission” will be made up of the completed form, which includes acceptance of the [Emoji Proposal Agreement & License](https://unicode.org/emoji/emoji-proposal-agreement.pdf), and your proposal PDF.

## Emoji 提案の書式

**[Format for Emoji Proposals](https://www.unicode.org/emoji/proposals.html#emoji_proposals_format)**

```
Title: Proposal for Emoji <name>
Submitter: <name(s)>
Date: <date>

1. Identification
2. Images
3. Factors for Inclusion
4. Factors for Exclusion
5. Other information
```

### 1. Identification

#### a. Keywords

Emoji を見つけるために使われる可能性がある用語を書く。
例えば [🤗(`smiling face with open hands`)](https://www.unicode.org/emoji/charts/emoji-list.html#1f917)の場合、`face | hug | hugging | open hands | smiling face | smiling face with open hands`。

#### b. Category

[既存の emoji のカテゴリー](https://www.unicode.org/emoji/charts/emoji-ordering.html)の内、属しうるカテゴリーを書く。

### 2. Images

#### a. Color and black&white example images

#### b. License

### 3. Factors for Inclusion

emoji の採用を「支持する」項目を書く

#### [1. Multiple meanings (複数の意味)](https://www.unicode.org/emoji/proposals.html#Selection_Factors_Multiple_Meanings)

提案する emoji には比喩的な意味や象徴性が含まれているか。

- 🦈 -> 高利貸し・詐欺師
- 🐷 -> 空腹・星座・食べ物・農業
- 💪 -> 強さ・肘

#### [2. Use in sequences (組み合わせでの使用)](https://www.unicode.org/emoji/proposals.html#Selection_Factors_Sequences)

- 💦🧼👐 -> 手洗い
- 😍😭 -> 圧倒的な可愛らしさ
- 🗑️🔥-> 燃えるゴミ

~~emoji を連ねるのはインターネット(主にオタク)的なノリだと思ってたけれど、emoji として正しい使い方だったんだね...。~~

#### [3. Breaks new ground (新境地を開拓する)](https://www.unicode.org/emoji/proposals.html#Selection_Factors_New_Ground)

全く新しいものを表現しているか。
例えば、ほうき (`🧹`) の emoji は掃除を表現することが出来るため、掃除機の emoji の提案は新境地を開拓出来ない。

#### [4. Distinctiveness (特徴性)](https://www.unicode.org/emoji/proposals.html#Selection_Factors_Distinctive)

提案する emoji が認識しやすく、象徴的である理由を説明する。

- emoji は文字なので、小さく (18px × 18px) で描画されても認識出るほどの特徴があるか。
- `🍺` (ジョッキにビールが満たされた状態だけでなく、ビール全般) のように広い意味を持っているか。

#### [5. Usage level (使用レベル)](https://www.unicode.org/emoji/proposals.html#Selection_Factors_Usage)

提案する emoji がどれぐらい使われている表現なのか、証拠 (指定されたプラットフォームの検索結果のスクリーンショット)を提示する。

- Google Video Search
- Google Books
- Google Trends: Web Search
- Google Trends: Image Search
- Google Books Ngram Viewer

#### [6. Completeness (完全性)](https://www.unicode.org/emoji/proposals.html#Selection_Factors_Completeness)

Unicode v8.0 で `🦂` 等の emoji (5種類) が追加されたことで、12星座を表現することが出来るようになった。
このようなギャップを埋める (完全性) ための提案項目。分類学的な完全性を提案するもの**ではない**。

**説得力のある例がない限り、`n/a` と書く。**

#### [7. Compatibility (互換性)](https://www.unicode.org/emoji/proposals.html#Selection_Factors_Compatibility)

ここでの互換性は、各サービス間の互換性。
特定のサービスで組み込まれているが広く親しまれている顔文字がある場合、emoji として標準化したら全てのサービスで使えるから良いねっていう提案項目。

**説得力のある例がない限り、`n/a` と書く。**

### [Factors for Exclusion](https://www.unicode.org/emoji/proposals.html#factors_exclusion)

emoji の採用に対して「不利に働く」項目に対して、問題がないことを書く（つまり、**No** と言えることが大事）

#### [1. Already representable (すでに表現できる)](https://www.unicode.org/emoji/proposals.html#Selection_Factors_Representable)

別の emoji、または既存の emoji の組み合わせで表現できる emoji の提案はダメ。

`🐿`はシマリス ([ネズミ目リス科シマリス属](https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%9E%E3%83%AA%E3%82%B9))として登録しているが、リス全般の表現として使われていることが多い。
そのため、例えばシマリス(属)ではないムササビ([リス科リス亜科ムササビ属](https://ja.wikipedia.org/wiki/%E3%83%A0%E3%82%B5%E3%82%B5%E3%83%93))の提案は難しい。

ハロウィーンは既存の emoji (`🎃`) や組み合わせ (`🎃👻`)で表現できるので、提案は難しい。

#### [2. Overly specific (具体的すぎる)](https://www.unicode.org/emoji/proposals.html#Specific)

`🍣` は「寿司全般」を表している（多分、マグロが一番有名な寿司だから）。この状況において、さらに「サバの寿司」の提案は具体的すぎる (`🍣` の部分集合) なので、ダメ。

#### [3. Open-ended (限度がない)](https://www.unicode.org/emoji/proposals.html#Selection_Factors_Open)

きりが無い追加になっていないか...ということだと思う。例えば、ゴールデンレトリバー(犬種)の emoji を追加したのでチワワも追加しよう、チワワを追加したのでダックスフンドも追加しよう...という構造になる提案だと、ダメ。

既存の犬のemoji (`🐕`)は macOS だと明らかに柴犬が描画されるけれど、これはベンダーの好み次第(かもしれない)。これが自分の好み・需要と一致しているかは...運。

#### [4. Transient (一過性)](https://www.unicode.org/emoji/proposals.html#Transient)

一過性のもの、流行りもののような、提案時の使用レベルが続かないものは、ダメ。
将来的にも使用を見込まれるシンボルでなければ、emoji の提案は出来ない。

#### [5. Faulty comparison (誤った比較)](https://www.unicode.org/emoji/proposals.html#Transient)

既存の emoji を根拠に、新しい emoji の提案は出来ない。

- 犬の emoji (🐶🐕) に正面・全身のものがあっても、他の動物も同様に正面・全身の emoji を追加する正当性はない。
- 犬の emoji (🐕🐩)・ラクダの emoji (🐪🐫)に種類違いがあっても、他の動物も同様に種類違いの emoji を追加する正当性はない。
