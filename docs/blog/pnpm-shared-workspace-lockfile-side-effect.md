---
title: "pnpm の `shared-workspace-lockfile` によるパッケージ間の依存関係の副作用を確認する"
date: 2025-02-01
---

## shared-workspace-lockfile について

[`shared-workspace-lockfile`](https://pnpm.io/ja/npmrc#shared-workspace-lockfile) は `.npmrc` で設定できる pnpm のオプションの 1 つ。
`shared-workspace-lockfile=true` の場合 (デフォルトのふるまい)、 pnpm は workspace のルートに単一の pnpm-lock.yaml ファイルを作る。

つまり:

```
root/
　├ pnpm-workspace.yaml
　├ pnpm-lock.yaml  👈️ このロックファイルで決定したパッケージは
　├ node_modules/
　│　├ .pnpm/       👈 ここの virtual store にインストールされる
　│　└ hoge/        👈 root で使われるパッケージはここに symlink が貼られる
　├ packages/
　│　└ package-a/
　│　　　└ node_modules/
　│　　　　　└ fuga/ 👈 root で使われるパッケージはここに symlink が貼られる
```

一方 `shared-workspace-lockfile=false` にすると、ロックファイルは各パッケージのディレクトリに作成される:

```
root/
　├ pnpm-workspace.yaml
　├ pnpm-lock.yaml  👈️ root でインストールしたパッケージはこのロックファイル(1)に書かれる
　├ node_modules/
　│　├ .pnpm/       👈 ロックファイル(1)で決定したパッケージはここの virtual store にインストールされる
　│　└ hoge/        👈 root で使われるパッケージはここに symlink が貼られる
　├ packages/
　│　└ package-a/
　│　　　├ pnpm-lock.yaml 👈️ package-a でインストールしたパッケージはこのロックファイル(2)に書かれる
　│　　　└ node_modules/
　│　　　　　├ .pnpm/      👈️ ロックファイル(2)で決定したパッケージはここの virtual store にインストールされる
　│　　　　　└ fuga/       👈 package-a で使われるパッケージはここに symlink が貼られる
```

## shared-workspace-lockfile=true のメリット・デメリット（疑惑）

`shared-workspace-lockfile=true` にしたメリットはドキュメントに書いてある:

> - every dependency is a singleton (全ての依存関係がシングルトン...1つで管理できる?)
> - faster installations in a monorepo (インストールが早くなる)
> - fewer changes in code reviews as they are all in one file (差分が1つにまとまる)

しかし、`true` のデメリット、または `false` のメリットがドキュメントに書かれていない（Issue/Pull request でも見つけられなかった)。

workspace 配下の各パッケージがロックファイルを共有しているということは、workspace 配下のパッケージ間で「依存関係の依存関係」できるかもしれない。
依存関係の依存関係がある場合、**パッケージ内の依存関係を更新したときに他のパッケージの依存関係に副作用が発生するのでは？**

## 検証

検証用リポジトリ: https://github.com/TatsuyaYamamoto/shared-workspace-lockfile-behavior-research

### やったこと

1. 2 つの環境を用意した:

   ```
   root/
   　│ 👇️️ 環境 (1)
   　├ shared-workspace-lockfile=false/
   　│　├ pnpm-workspace.yaml
   　│　├ package.json
   　│　└ packages/
   　│　　　├ package-a/
   　│　　　│　├ node_modules/
   　│　　　│　├ package.json
   　│　　　│　└ pnpm-lock.yaml 👈️ `shared-workspace-lockfile=false` によってパッケージ内にもロックファイルが出来る
   　│　　　└ package-b/
   　│　　　 　├ node_modules/
   　│　　　 　├ package.json
   　│　　　 　└ pnpm-lock.yaml
   　│ 👇️️ 環境 (2)
   　├ shared-workspace-lockfile=true/
   　│　├ pnpm-workspace.yaml
   　│　├ package.json
   　│　├ pnpm-lock.yaml  👈️ `shared-workspace-lockfile=true` なので単一のロックファイルが root に出来る
   　│　└ packages/
   　│　　　├ package-a/
   　│　　　│　├ node_modules/
   　│　　　│　└ package.json
   　│　　　└ package-b/
   　│　　　 　├ node_modules/
   　│　　　 　└ package.json
   ```

2. `vue@3.0.0` を `package-a` にインストールする:
   - `shared-workspace-lockfile=false/packages/package-a/pnpm-lock.yaml`:
     - `vue@3.0.0` が追加される
     - `vue@3.0.0` が依存している `@babel/parser@7.26.7` が追加される
   - `shared-workspace-lockfile=true/pnpm-lock.yaml`:
     - `vue@3.0.0` が追加される
     - `vue@3.0.0` が依存している `@babel/parser@7.26.7` が追加される
3. `@babel/parser@7.11.5` [^1] を `package-b` にインストールする
   - `shared-workspace-lockfile=false/packages/package-b/pnpm-lock.yaml`:
     - `@babel/parser@7.11.5` が追加される
   - `shared-workspace-lockfile=true/pnpm-lock.yaml`
     - `@babel/parser@7.11.5` に **更新される**
4. ロックファイルの差分をみる

### 差分

`shared-workspace-lockfile=false` においては:

- `packages/package-a/pnpm-lock.yaml` が `@babel/parser@7.26.7` に依存したまま
- `packages/package-b/pnpm-lock.yaml` が `@babel/parser@7.11.5` に依存している

一方 `shared-workspace-lockfile=true` においては:

- `<root>/pnpm-lock.yaml` が `@babel/parser@7.11.5` のみに依存している (package-a が package-b の更新に影響を受けている)

つまり、

- `shared-workspace-lockfile=false` は `package-a` - `package-b` 間に依存関係の**依存関係がない**
- `shared-workspace-lockfile=true` は `package-a` - `package-b` 間に依存関係の**依存関係がある**

```bash
$ sdiff -l shared-workspace-lockfile=false/packages/package-a/pnpm-lock.yaml shared-workspace-lockfile=true/pnpm-lock.yaml
lockfileVersion: '9.0'                                        (
                                                              (
settings:                                                     (
  autoInstallPeers: true                                      (
  excludeLinksFromLockfile: false                             (
                                                              (
importers:                                                    (
                                                              (
  .:                                                          |   .: {}
                                                              >
                                                              >   packages/package-a:
    dependencies:                                             (
      vue:                                                    (
        specifier: 3.0.0                                      (
        version: 3.0.0                                        (
                                                              (
                                                              >   packages/package-b:
                                                              >     dependencies:
                                                              >       '@babel/parser':
                                                              >         specifier: 7.11.5
                                                              >         version: 7.11.5
                                                              >
packages:                                                     (
                                                              (
  '@babel/helper-string-parser@7.25.9':                       (
    resolution: {integrity: sha512-4A/SCr/2KLd5jrtOMFzaKjVtAe (
    engines: {node: '>=6.9.0'}                                (
                                                              (
  '@babel/helper-validator-identifier@7.25.9':                (
    resolution: {integrity: sha512-Ed61U6XJc3CVRfkERJWDz4dJwK (
    engines: {node: '>=6.9.0'}                                (
                                                              (
  '@babel/parser@7.26.7':                                     |   '@babel/parser@7.11.5':
    resolution: {integrity: sha512-kEvgGGgEjRUutvdVvZhbn/BxVt |     resolution: {integrity: sha512-X9rD8qqm695vgmeaQ4fvz/o3+W
    engines: {node: '>=6.0.0'}                                (
    hasBin: true                                              (
                                                              (
  '@babel/types@7.26.7':                                      (
    resolution: {integrity: sha512-t8kDRGrKXyp6+tjUh7hw2RLycl (
    engines: {node: '>=6.9.0'}                                (
                                                              (
  '@vue/compiler-core@3.0.0':                                 (
    resolution: {integrity: sha512-XqPC7vdv4rFE77S71oCHmT1K4K (
                                                              (
  '@vue/compiler-dom@3.0.0':                                  (
    resolution: {integrity: sha512-ukDEGOP8P7lCPyStuM3F2iD5w2 (
                                                              (
  '@vue/reactivity@3.0.0':                                    (
    resolution: {integrity: sha512-mEGkztGQrAPZRhV7C6PorrpT3+ (
                                                              (
  '@vue/runtime-core@3.0.0':                                  (
    resolution: {integrity: sha512-3ABMLeA0ZbeVNLbGGLXr+pNUwq (
                                                              (
  '@vue/runtime-dom@3.0.0':                                   (
    resolution: {integrity: sha512-f312n5w9gK6mVvkDSj6/Xnot1X (
                                                              (
  '@vue/shared@3.0.0':                                        (
    resolution: {integrity: sha512-4XWL/avABGxU2E2ZF1eZq3Tj7f (
                                                              (
  csstype@2.6.21:                                             (
    resolution: {integrity: sha512-Z1PhmomIfypOpoMjRQB70jfvy/ (
                                                              (
  estree-walker@2.0.2:                                        (
    resolution: {integrity: sha512-Rfkk/Mp/DL7JVje3u18FxFujQl (
                                                              (
  source-map@0.6.1:                                           (
    resolution: {integrity: sha512-UjgapumWlbMhkBgzT7Ykc5YXUT (
    engines: {node: '>=0.10.0'}                               (
                                                              (
  vue@3.0.0:                                                  (
    resolution: {integrity: sha512-ZMrAARZ32sGIaYKr7Fk2GZEBh/ (
                                                              (
snapshots:                                                    (
                                                              (
  '@babel/helper-string-parser@7.25.9': {}                    (
                                                              (
  '@babel/helper-validator-identifier@7.25.9': {}             (
                                                              (
  '@babel/parser@7.26.7':                                     |   '@babel/parser@7.11.5':
    dependencies:                                             (
      '@babel/types': 7.26.7                                  (
                                                              (
  '@babel/types@7.26.7':                                      (
    dependencies:                                             (
      '@babel/helper-string-parser': 7.25.9                   (
      '@babel/helper-validator-identifier': 7.25.9            (
                                                              (
  '@vue/compiler-core@3.0.0':                                 (
    dependencies:                                             (
      '@babel/parser': 7.26.7                                 |       '@babel/parser': 7.11.5
      '@babel/types': 7.26.7                                  (
      '@vue/shared': 3.0.0                                    (
      estree-walker: 2.0.2                                    (
      source-map: 0.6.1                                       (
                                                              (
  '@vue/compiler-dom@3.0.0':                                  (
    dependencies:                                             (
      '@vue/compiler-core': 3.0.0                             (
      '@vue/shared': 3.0.0                                    (
                                                              (
  '@vue/reactivity@3.0.0':                                    (
    dependencies:                                             (
      '@vue/shared': 3.0.0                                    (
                                                              (
  '@vue/runtime-core@3.0.0':                                  (
    dependencies:                                             (
      '@vue/reactivity': 3.0.0                                (
      '@vue/shared': 3.0.0                                    (
                                                              (
  '@vue/runtime-dom@3.0.0':                                   (
    dependencies:                                             (
      '@vue/runtime-core': 3.0.0                              (
      '@vue/shared': 3.0.0                                    (
      csstype: 2.6.21                                         (
                                                              (
  '@vue/shared@3.0.0': {}                                     (
                                                              (
  csstype@2.6.21: {}                                          (
                                                              (
  estree-walker@2.0.2: {}                                     (
                                                              (
  source-map@0.6.1: {}                                        (
                                                              (
  vue@3.0.0:                                                  (
    dependencies:                                             (
      '@vue/compiler-dom': 3.0.0                              (
      '@vue/runtime-dom': 3.0.0                               (
      '@vue/shared': 3.0.0                                    (
```

## 結論

- `shared-workspace-lockfile=true` にすると、workspace 配下のパッケージ間で「依存関係の依存関係」が出来る
- package-a でパッケージを更新したとき、package-b 内の依存関係に影響する可能性がある
- 副作用の可能性を無視できない場合は `shared-workspace-lockfile=false` にする

[^1]: `vue@3.0.0` -> [`@vue/compiler-dom@3.0.0`](https://github.com/vuejs/core/blob/v3.0.0/packages/vue/package.json#L41) -> [`@vue/compiler-core@3.0.0`](https://github.com/vuejs/core/blob/v3.0.0/packages/compiler-dom/package.json#L40) -> [`@babel/parser@^7.11.5`](https://github.com/vuejs/core/blob/v3.0.0/packages/compiler-core/package.json#L35) という依存関係の構造において、`@babel/parser@7.11.5` は semver を満たす最低バージョン
