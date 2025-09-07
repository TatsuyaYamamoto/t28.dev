---
title: "Fairy (AI エージェント) を作るメモまとめ"
date: 2025-04-15
---

間違いなく 2025年のバズワードの「AI エージェント」をそろそろ勉強しないと...という衝動に駆られたので、「Fairy の開発(超強気)」を題材にしてお勉強と QOL の両立を図る。

## Fairy?

[ゼンレスゾーンゼロ](https://zenless.hoyoverse.com/ja-jp/main) に登場する[AI アシスタント](https://zenless.hoyoverse.com/ja-jp/news/114170)。~~AI **エージェント**じゃねーじゃん...。~~

## AI エージェント？ AI アシスタント？

Google Cloud がドンピシャな記事を公開している([AI エージェントとは](https://cloud.google.com/discover/what-are-ai-agents?hl=ja))。

> AI エージェントは、AI を使用して**ユーザーの代わりに目標を追求し、タスクを完了させる**ソフトウェア システムです。推論、計画、メモリーが可能であることが示されており、意思決定、学習、適応を行うレベルの自律性を備えています。

> AI アシスタントは、ユーザーと直接連携し、**自然言語や入力を理解して応答する**ことでタスクを実行するアプリケーションやプロダクトとして設計された AI エージェントです。ユーザーの監督のもと、ユーザーに代わって推論し、行動を起こすことができます。

OpenAI のドキュメントも参考になる([Assistants API overview](https://platform.openai.com/docs/assistants/overview))

> The Assistants API allows you to build AI assistants within your own applications. An Assistant has instructions and can leverage models, tools, and files to **respond to user queries**.

つまり

- 指示を待って応答する -> AI アシスタント
- 自律的に目標を追求する -> AI エージェント

という理解ができそう。 Fairy、あいつ勝手に動くし、 AI エージェントじゃん。

## 記事まとめ

1. [Claude のシステムプロンプトを読んでみる](./claude-3-7-sonnet-system-prompt)
2. [Mastra アプリを Cloudflare にデプロイする](./deploy-mastra-app-to-cloudflare-workers)
3. [LINE Messaging API を使って Mastra アプリから LINE でリプライを受け取る](./mastra-app-replies-with-line-messaging-api)
4. [文脈を組む AI エージェントを作るための LLM のコンテキスト と Mastra のメモリ](./llm-context-and-mastra-memory-for-stateful-conversation)
5. [Mastra の AI Agent にユーザーを区別させる (1)](./user-differentiation-with-mastra-ai-agent-1)
6. 増えて！(願望)
