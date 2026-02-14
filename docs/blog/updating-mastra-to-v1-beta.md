---
title: Mastra v1 に備えて beta にアップデートする
date: 2025-12-29
modified: 2026-02-13
---

[2026年1月に Mastra v1 がリリースされる予定](https://github.com/mastra-ai/mastra/blob/mastra%401.0.0/docs/src/content/en/guides/migrations/upgrade-to-v1/overview.mdx)なので、beta にアップデートしてみる。
v1 が出るということは API が安定するということなので、過去に見つけたハックも削除できるかも...？という淡い期待を込めて...。

参考: "[Mastra アプリを Cloudflare Workers にデプロイする](./deploy-mastra-app-to-cloudflare-workers)"

## -> v0-latest

作業 PR: https://github.com/TatsuyaYamamoto/sicaco-quarter-third-street/pull/40

ガイドに従って、まずは v0 の最新版にする。

> Before upgrading to v1, make sure you've updated to the latest 0.x version of Mastra. Follow the upgrade to latest 0.x guide first, then return here to complete the v1 migration.

依存関係:

```diff
- "@ai-sdk/openai": "1.3.24",
- "@mastra/cloudflare-d1": "0.11.0",
- "@mastra/core": "0.10.6",
- "@mastra/deployer-cloudflare": "0.10.6",
- "@mastra/memory": "0.10.4",
- "zod": "3.24.4"
- "mastra": "0.10.6"
+ "@ai-sdk/openai": "2.0.88",
+ "@mastra/cloudflare-d1": "0.13.10",
+ "@mastra/core": "0.24.9",
+ "@mastra/deployer-cloudflare": "0.14.26",
+ "@mastra/memory": "0.15.13",
+ "zod": "3.25.76"
+ "mastra": "0.18.9"
```

[内部で参照されないのに型上必須だったプロパティのバグ(？)](https://t28.dev/blog/deploy-mastra-app-to-cloudflare-workers#deployer) は <https://github.com/mastra-ai/mastra/pull/6095> で修正されていた。

```diff
  // ...
  deployer: new CloudflareDeployer({
-   scope: "***",
    projectName: "sicaco-3rd--agent-worker",
-   auth: {
-     apiToken: "***",
-   },
    d1Databases: [
      // ...
    ],
  }),
```

[Mastra の内部で行っている dynamic import の path 変数が原因のエラー](https://t28.dev/blog/deploy-mastra-app-to-cloudflare-workers#deployer)は <https://github.com/mastra-ai/mastra/pull/5531> で修正されていた。

```diff
- const { tools: toolPaths } = await import(`${mastraOutputDir}/tools.mjs`);
-
- const mastraIndexMjsPath = path.resolve(mastraOutputDir, "index.mjs");
- const mastraIndexMjsContent = fs.readFileSync(mastraIndexMjsPath, "utf-8");
- const mastraIndexMjsContentReplaced = mastraIndexMjsContent
-   .replace("import(toolsPath)", "import('./tools.mjs')")
-   .replace(
-     /const toolImports = .*?];/s,
-     `const toolImports = await Promise.all([
-     ${toolPaths.map((path) => `import('${path}')`).join(",\n")}
-     ]);`,
-   );
- fs.writeFileSync(mastraIndexMjsPath, mastraIndexMjsContentReplaced);
```

v0-latest に更新したことで、新しいバグ (?) に遭遇した。
Mastra のビルド成果物を wrangler が bundle するときに、TypeScript も一緒に bundle していた。
10MB 超えのライブラリが入るのは Claudeflare へのデプロイに困るので、issue を作成した (<https://github.com/mastra-ai/mastra/issues/11449>)。

> **2026/02/13 更新:**
>
> 2026/01/30 に修正が merge されていた。

```diff
+ execSync("pnpm uninstall typescript", {
+   cwd: mastraOutputDir,
+   stdio: "inherit",
+ });
+ execSync("pnpm -r uninstall typescript", {
+   cwd: repoRootDir,
+   stdio: "inherit",
+ });
```

## v0-latest -> beta

作業 PR: https://github.com/TatsuyaYamamoto/sicaco-quarter-third-street/pull/43

依存関係:

```diff
- "@mastra/cloudflare-d1": "0.13.10",
- "@mastra/core": "0.24.9",
- "@mastra/deployer-cloudflare": "0.14.26",
- "@mastra/memory": "0.15.13",
- "mastra": "0.18.9"
+ "@mastra/cloudflare-d1": "1.0.0-beta.8",
+ "@mastra/core": "1.0.0-beta.18",
+ "@mastra/deployer-cloudflare": "1.0.0-beta.1",
+ "@mastra/memory": "1.0.0-beta.9",
+ "mastra": "1.0.0-beta.12"
```

beta への更新は楽だった。小さい API 変更の対応のみ。

```diff
  export const fairy = new Agent({
+   id: "fairy",
    name: "Fairy",
    instructions: systemPrompt,
    model: openai("gpt-4o"),
    tools: { weatherTool },
    memory: new Memory({
      options: {
        lastMessages: 10,
        semanticRecall: false,
+       generateTitle: false,
-       threads: {
-         generateTitle: false,
-       },
      },
    }),
  });
```
