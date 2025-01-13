---
title: "Pull Request におけるベストプラクティス情報をまとめて自分用にまとめる"
date: "2025-01-13"
---

## まとめ

## [GitHub] 自分の変更を他のユーザーが確認できるようにする

[URL](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes)

- 変更を簡単に確認できるようにする
  - 小さい PR を書き込む
  - 最初に独自の pull request を確認する
  - コンテキストとガイダンスを提供する
    - > pull request の明確なタイトルと説明を記述します
    - > pull request の本文は次のようになります。
      >
      > - pull request の目的
      > - 変更点の概要
      > - 問題の追跡や以前の会話など、追加のコンテキストへのリンク
- チームに常に情報を提供する
  - GitHub Copilot を使って pull request の概要を生成する
  - 関連する issue やプロジェクトへのリンク
  - 状態をラベルで強調表示する

## [GitHub] Beginner’s guide to GitHub: Creating a pull request

[URL](https://github.blog/developer-skills/github/beginners-guide-to-github-creating-a-pull-request/)

> 1. 小さなプルリクエストを書く。小さなプルリクエストは、レビューやマージが簡単で速く、バグを導入する余地が少なく、変更履歴が明確になります。
> 2. まず自分のプルリクエストをレビューしましょう。プルリクエストを提出する前に、自分のプルリクエストをレビュー、ビルド、テストしましょう。こうすることで、他の人がレビューを始める前に、自分が見落としているかもしれないエラーやタイプミスを発見することができます。
> 3. コンテキストとガイダンスを提供する。レビュアーがプルリクエストの内容をすぐに理解できるように、プルリクエストには明確なタイトルと説明を書きましょう。プルリクエストの本文には、次のような内容を含めるべきです：
>    - プルリクエストの目的
>    - 変更点の概要
>    - 追跡中の課題、チケット、以前の会話など、追加コンテキストへのリンク

## [Microsoft] Engineering Fundamentals Playbook - Pull Requests

[URL](https://microsoft.github.io/code-with-engineering-playbook/code-reviews/pull-requests/)

> プルリクエストは常に小さく保つように努めるべきです。小さな PR には複数の利点があります:
>
> - レビューが容易で、レビュー担当者にとって明らかな利点があります。
> - デプロイが容易で、これはリリースを迅速に、頻繁に行うという戦略と一致しています。
> - 競合や古い PR の可能性を最小限に抑えます。

> ただし、PR は機能、最適化、コードの可読性などに焦点を当て、コンテキストのないコードや疎結合のコードを含む PR は避ける必要があります。適切なサイズはありませんが、コード レビューは共同作業のプロセスであり、大きな PR は難しくなる可能性があり、レビューに時間がかかる可能性があることに留意してください。常に、価値を付加しながらも可能な限り小さな PR にするよう努める必要があります。

> Best Practices
>
> - be consistent,
> - not break the build, and
> - include related tests as part of the PR.

### Pull Request Description

[URL](https://microsoft.github.io/code-with-engineering-playbook/code-reviews/pull-requests/#pull-request-description)

### Pull Request Template

https://microsoft.github.io/code-with-engineering-playbook/code-reviews/pull-request-template/

## [HackerOne] Writing A Great Pull Request Description

[URL](https://www.pullrequest.com/blog/writing-a-great-pull-request-description/) (Microsoft の文書が参照していた文書)

> The Pull Request (PR for short) is the method by which — specifically using Git and GitHub — you can loop interested parties into reviewing and then approving your change, then merging it into some branch (presumably the trunk). This is where you explain the “whats” and “whys” of your code.

PR はコードの「内容」と「理由」を説明して、それを関係者に確認・承認してもらう。

### Your PR Description Matters

> Here you’ll get to explain what you’ve done, why you’ve done it, and how to prove it is ready to be merged into the main trunk.

PR で説明すること:

- 何を行ったか
- なぜそれを行ったか
- メイン トランクにマージする準備ができていることをどのように証明するか

### The Template

> A favorite, simple template of mine:
>
> ```
> ## What?
> ## Why?
> ## How?
> ## Testing?
> ## Screenshots (optional)
> ## Anything Else?
> ```
>
> As you can tell, it’s not rocket science. It’s not even computer science. It’s just a clean, easy to understand synopsis of your work.

著者の好みのテンプレート。簡潔で理解しやすい作業の概要を書いているだけ。

#### The What

> Just explicit prose on your net change will typically suffice. At a high level, this is where you let the reviewer know the overall effect of the PR.

レビュー担当者に PR の全体的な影響を知らせるために、実質的な変更点を明示的に記述する。

> It’s important to explain what the change is and then and only then reference the ticket. It’s a much better experience for the reviewer if they’re able to spend more time reviewing code and less time studying specification that may not even be applicable on the code level.

以下ができれば、コードのレビューに時間を費やせる:

- 変更内容を把握してからチケットを参照する
- コードからは察せない仕様をレビュー担当者に調査させない

> Again, try to be explicit and try to capture the changes in a few short, concise sentences that don’t require more than a few seconds to grasp.

大事すぎて、`explicit` を 3 回言っている。

#### The Why

> The “why” tells us what business or engineering goal this change achieves.

ビジネス、またはエンジニアリングの観点で、なぜこの PR を実施するかを説明する。

#### The How

> the PR diff will tell most of the story of the “how”, but make sure to draw attention to the significant design decisions.

PR の diff が PR の how を説明しているとも言える。しかし、設計上の決定 (設計上のなぜとも言える) にも注目することが重要。

> You decided to write a recursive method instead of a loop, pointing out the merits of this will help the reviewer understand your reasoning and in turn provide a better review.

「ループの代わりに再帰メソッドを使う」設計上の決定の説明を書けば、PR 作成者の考えが理解できるためより良いレビューを提供できる:

- 「なぜループを使わない？」という議論が不要になる
- 設計（「ループより再起メソッド」という決定）に対して議論ができる

## [Google] The Change Author’s Guide - Writing Good CL Descriptions

[URL](https://google.github.io/eng-practices/review/developer/cl-descriptions.html)

> CL の説明は変更の公開記録であり、次の点を伝えることが重要です:
>
> - どのような変更が行われていますか? CL 全体を読まなくても読者が何が変更されているかを把握できるように、主要な変更を要約する必要があります。
> - これらの変更が行われるのはなぜですか? この変更を行ったとき、作成者としてどのような状況でしたか? ソース コードに反映されていない決定はありましたか? など。

## [Google] The Change Author’s Guide - Small CLs

[URL](https://google.github.io/eng-practices/review/developer/small-cls.html)

## [Google] The Change Author’s Guide - How to Handle Reviewer Comments

[URL](https://google.github.io/eng-practices/review/developer/handling-comments.html)

## [ATLASSIAN] The (written) unwritten guide to pull requests

[URL](https://www.atlassian.com/blog/git/written-unwritten-guide-pull-requests)

## [MDN] プルリクエストの提出とレビューのガイドライン

[URL](https://developer.mozilla.org/ja/docs/MDN/Community/Pull_requests)

## [GitLab] Code Review Guidelines

[URL](https://docs.gitlab.com/ee/development/code_review.html)

[^1]: "CL" は "changelist" の略で、Pull request に相当する [Google の社内用語](https://google.github.io/eng-practices/#terminology) らしい
