---
title: "長い物に巻かれるために、Pull Request のベストプラクティス情報を集めた"
date: "2025-01-13"
---

「Pull request ではこうした方が良い」というふわっとした知識が頭に入っているが、 例によって

- 誰がそう勧めているの？
- 他にはないの？

という点が気になってしまった。
早速[長い物に巻かれるために情報収集しつつ](https://www.google.com/search?q=pull+request+best+practices)、特に長いであろう物の意見を見てみる:

- [GitHub](#github)
- [Microsoft](#microsoft)
- [HackerOne](#hackerone) [^1]
- [Google](#google)
- [GitLab](#gitlab)

## GitHub

### 自分の変更を他のユーザーが確認できるようにする

[URL](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/getting-started/helping-others-review-your-changes)

> レビューが容易でチームに常に情報を提供できる pull request を作成するためのベストプラクティス

GitHub (のドキュメント) によるベストプラクティス:

- 変更を簡単に確認できるようにする
  - 小さい PR を書き込む
  - 最初に独自の pull request を確認する
  - コンテキストとガイダンスを提供する
- チームに常に情報を提供する
  - GitHub Copilot を使って pull request の概要を生成する
  - 関連する issue やプロジェクトへのリンク
  - 状態をラベルで強調表示する

> 1 つの目的を満たす、焦点を絞った小さな pull request を作成することを目的とします

小さい pull request の効果:

- レビューとマージが簡単かつ迅速になる
- バグを導入する余地が少なくなる
- 変更の履歴がより明確になる

> 最初に独自の pull request を確認する

自分が作った pull request をまずは自分でレビューする

> pull request の明確なタイトルと説明を記述します。

pull request の本文:

- pull request の目的
- 変更点の概要
- 問題の追跡や以前の会話など、追加のコンテキストへのリンク

> 必要なフィードバックの種類を共有します。 たとえば、ざっと見るだけでよいでしょうか、それとも深い批評が必要でしょうか。
> (...)
> pull request が複数のファイルに対する変更で構成されている場合は、ファイルをレビューする順序に関するガイダンスをレビュー担当者に提供します。

「レビューの仕方」についても pull request で説明するべき。

### Beginner’s guide to GitHub: Creating a pull request

[URL](https://github.blog/developer-skills/github/beginners-guide-to-github-creating-a-pull-request/)

> When you create pull requests going forward, here are a few best practices you should keep in mind.
>
> 1. Write small pull requests. (...)
> 2. Review your own pull request first. (...)
> 3. Provide context and guidance. (...)

GitHub (のブログ) によるベストプラクティス:

1. 小さな pull request を書く
2. まず自分で pull request をレビューする
3. コンテキストとガイダンスを提供する

-> `GitHub (のドキュメント) によるベストプラクティス` と同じ。

## Microsoft

### Engineering Fundamentals Playbook - Pull Requests

[URL](https://microsoft.github.io/code-with-engineering-playbook/code-reviews/pull-requests/)

#### Size Guidance

> We should always aim to keep pull requests small. Small PRs have multiple advantages:

小さな PR のメリット:

- レビューが容易
- デプロイが容易 (頻繁にリリースする戦略と一致する)
- コンフリクトや PR が古くなる可能性を抑える

> We should always strive to have as small PRs as possible that still add value.

価値を付加しつつ、できるだけ小さな PR を作る。

機能的な特徴、最適化、コードの読みやすさなどに焦点を当て、コンテキストのないコードや疎結合のコードを含む PR は避ける必要があります。

#### Best Practices

> be consistent,

一貫性とは、PR に含まれるすべての変更が 1 つの目標 (例: 1 つのユーザー ストーリー) を解決することを目指し、本質的に関連していることを意味します。これをプロジェクト全体における単一責任の原則と考えてください。PR にはプロジェクトを変更する理由が 1 つだけある必要があります。

> not break the build, and

ビルドを壊さない (引用元に補足がないほどシンプル)

> include related tests as part of the PR.

テストを PR に含める (引用元に補足がないほどシンプル)

#### Pull Request Description

> Well written PR descriptions helps maintain a clean, well-structured change history.

適切な pull requestの説明[^2]は構造化された変更履歴を作る。

> One popular specification for open-source projects and others is the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0-beta.2/), which is structured as:

プロジェクト開始時に規約を作った方がよい。

ここで紹介されている規約:

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/)
- [Angular - Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type)

### Pull Request Template

[URL](https://microsoft.github.io/code-with-engineering-playbook/code-reviews/pull-request-template/)

> ```markdown
> # [Work Item ID](./link-to-the-work-item)
>
> For more information about how to contribute to this repo, visit this [page](https://github.com/microsoft/code-with-engineering-playbook/blob/main/CONTRIBUTING.md)
>
> ## Description
>
> ---
>
> > Should include a concise description of the changes (bug or feature), it's impact, along with a summary of the solution
>
> ## Steps to Reproduce Bug and Validate Solution
>
> ---
>
> > Only applicable if the work is to address a bug. Please remove this section if the work is for a feature or story
> > Provide details on the environment the bug is found, and detailed steps to recreate the bug.
> > This should be detailed enough for a team member to confirm that the bug no longer occurs
>
> ## PR Checklist
>
> ---
>
> > Use the check-list below to ensure your branch is ready for PR. If the item is not applicable, leave it blank.
>
> - [ ] I have updated the documentation accordingly.
> - [ ] I have added tests to cover my changes.
> - [ ] All new and existing tests passed.
> - [ ] My code follows the code style of this project.
> - [ ] I ran the lint checks which produced no new errors nor warnings for my changes.
> - [ ] I have checked to ensure there aren't other open Pull Requests for the same update/change.
>
> ## Does This Introduce a Breaking Change?
>
> ---
>
> - [ ] Yes
> - [ ] No
>
> > If this introduces a breaking change, please describe the impact and migration path for existing applications below.
>
> ## Testing
>
> ---
>
> > - Instructions for testing and validation of your code:
> >   - What OS was used for testing.
> >   - Which test sets were used.
> >   - Description of test scenarios that you have tried.
>
> ## Any Relevant Logs or Outputs
>
> ---
>
> > - Use this section to attach pictures that demonstrates your changes working / healthy
> > - If you are printing something show a screenshot
> > - When you want to share long logs upload to:
> >   `(StorageAccount)/pr-support/attachments/(PR Number)/(yourFiles) using [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)` or [portal.azure.com](https://portal.azure.com) and insert the link here.
>
> ## Other Information or Known Dependencies
>
> ---
>
> > - Any other information or known dependencies that is important to this PR.
> > - TODO that are to be done after this PR.
> ```

## HackerOne

### Writing A Great Pull Request Description

[URL](https://www.pullrequest.com/blog/writing-a-great-pull-request-description/)

> The Pull Request (PR for short) is the method by which — specifically using Git and GitHub — you can loop interested parties into reviewing and then approving your change, then merging it into some branch (presumably the trunk). This is where you explain the “whats” and “whys” of your code.

PR はコードの「内容」と「理由」を説明して、それを関係者に確認・承認してもらう。

#### Your PR Description Matters

> Here you’ll get to explain what you’ve done, why you’ve done it, and how to prove it is ready to be merged into the main trunk.

PR で説明すること:

- 何を行ったか
- なぜそれを行ったか
- メイン トランクにマージする準備ができていることをどのように証明するか

#### The Template

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

## Google

注記: "CL" は "changelist" の略で、Pull request に相当する [Google の社内用語](https://google.github.io/eng-practices/#terminology) らしい。この記事では引用文以外は pull request と書く。

### The Change Author’s Guide - Writing Good CL Descriptions

[URL](https://google.github.io/eng-practices/review/developer/cl-descriptions.html)

> 1. **What** change is being made? This should summarize the major changes such that readers have a sense of what is being changed without needing to read the entire CL.
> 2. **Why** are these changes being made? What contexts did you have as an author when making this change? Were there decisions you made that aren’t reflected in the source code? etc.

「なにを」「なぜ」変更するかを pull request に書く:

- 「なにを」は主要な変更点の要約を書く。読者が pull request 全体を読まなくても何が変更されるのかを理解できるようにする。
- 「なぜ」は pull request 作成時点でどのような状況だったか、コードに反映されていない決定はあったかを書く。

> Reading source code may reveal what the software is doing but it may not reveal why it exists

ソースコードを読むとソフトウェアが何をしているかは分かるかもしれないが、なぜそのソースコードが存在するかは分からないかもしれない。

#### First Line

> The **first line** of a CL description should be a short summary of specifically what is being done by the CL

Pull request のタイトル [^3] は 「具体的に何が行われているかの短い要約」を書く。

> the first line should stand alone, allowing readers to skim through code history much faster.

「`stand alone` な pull request」 とは以下が理解できるほど十分に情報が含まれた pull request ということ:

- Pull request が実際に何をしたか
- 他の pull request とどう違うか

#### Body is Informative

> the rest of the description should fill in the details and include any supplemental information a reader needs to understand the changelist holistically

Pull request の説明には全体を理解するために必要な補足情報を書く。

> It might include a brief description of the problem that’s being solved, and why this is the best approach. If there are any shortcomings to the approach, they should be mentioned. If relevant, include background information such as bug numbers, benchmark results, and links to design documents.

補足情報:

- 解決しようとしている問題の簡単な説明
- なぜこれが最善のアプローチなのか
- アプローチに欠点がある場合は、その説明
- バグ番号、ベンチマーク結果、設計ドキュメントへのリンクなどの背景情報

#### Bad CL Descriptions

#### Good CL Descriptions

#### Review the description before submitting the CL

> CLs can undergo significant change during review. It can be worthwhile to review a CL description before submitting the CL, to ensure that the description still reflects what the CL does.

Pull request (の実装) がレビュー中に大幅に変わった場合、pull request (の説明) も書き直す。
そうしないと、実装と説明が一致しないログが残る。

### The Change Author’s Guide - Small CLs

[URL](https://google.github.io/eng-practices/review/developer/small-cls.html)

> Small, simple CLs are:

小さくて簡潔な pull request とは:

- 小さい pull request の方がレビューが簡単 (早くなる)
- 徹底的にレビューできる
  - 大きな変更があると、レビュー担当者と作成者は大量の詳細なコメントが行ったり来たりすることにイライラする傾向があり、重要なポイントが見逃されたり、省略されたりすることもあります。
- バグの可能性が減る
  - 変更が少なくなるため、CL の影響についてあなたとレビュー担当者が効果的に推論し、バグが発生していないか確認しやすくなります。
- 拒否された場合の手戻りが減る
- コンフリクトのリスクが減ってマージが簡単になる
- 適切に設計できる
  - 大きな変更の詳細をすべて洗練するよりも、小さな変更の設計とコードの健全性を磨く方がはるかに簡単です。
- Pull request のレビューを待つ間に他の作業ができる (レビューの妨げが減る)
- ロールバックが簡単になる

## ATLASSIAN

### The (written) unwritten guide to pull requests

[URL](https://www.atlassian.com/blog/git/written-unwritten-guide-pull-requests)

## GitLab

### Code Review Guidelines

[URL](https://docs.gitlab.com/ee/development/code_review.html)

[^1]: [Microsoft の文書が参照していた](https://microsoft.github.io/code-with-engineering-playbook/code-reviews/pull-requests/#:~:text=Writing%20a%20great%20pull%20request%20description)

[^2]: ここでの説明は title と body を指していると考えられる。

[^3]: CL の `the first line` は pull request title に相当すると見てよさそう。
