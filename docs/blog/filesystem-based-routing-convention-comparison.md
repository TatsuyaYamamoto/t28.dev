---
title: "Next.js, SvelteKit, Nuxt.js のファイルシステムベースルーティングの規約を比較して、独自ルールの参考にする"
date: 2023-09-02
---

## 背景

なんやかんやあって「ファイルシステムベースルーティングを Vue + Vite で行う」ことになり、**ファイル名・ディレクトリ構造のルール**を作りたくなりました。

例えば `/hoge` という URL パスを定義するとき、以下のように、どちらの方法がベターか迷う...。

```
src/
 ├ pages/
 │ ├ hoge/
 │ │ └ index.vue <- どっち? (統一したい)
 │ └ hoge.vue    <- どっち? (統一したい)
```

加えて、コロケーションの観点でも迷う...。
特定のページでのみ使われる実装 (例えば UI コンポーネント) を ページコンポーネントの近くに配置したい訳ですが、どんなルールなら治安を維持できるだろう...?

```
src/
 ├ components/
 │ └ AppHogePageOnly.vue <- hoge/index.vue でしか使わないのに遠すぎ！
 ├ pages/
 │ ├ hoge/
 │ │ ├ index.vue
 │ │ ├ <- AppHogePageOnly.vue はどこに置けば...?
```

## 今どきの規約を調べる

_この記事の"今どき"って、いつまで持つのやら..._

Next.js の App Router や SvelteKit が [設定より規約](https://ja.wikipedia.org/wiki/%E8%A8%AD%E5%AE%9A%E3%82%88%E3%82%8A%E8%A6%8F%E7%B4%84) な router になっていることを小耳には挟んでいたので、ルール作りの参考のためにドキュメントを読みました。

## フレームワーク毎のファイルシステムベースルーティングの基本

### Next.js (App Router)

Ref: https://nextjs.org/docs/app/building-your-application/routing

- `app/` フォルダ配下で定義した**フォルダ**で URL パス を定義する。
- `app/` フォルダ配下で定義した**ファイル**は URL パスの定義に**影響を与えず**、 UI を作るために使われる。
- [root フォルダ](https://nextjs.org/docs/app/building-your-application/routing#terminology) から `page.js` [^1] [^2] を含むフォルダまでの階層構造に従った URL パスになる。

> The App Router works in a new directory named `app`.
>
> [Routing Fundamentals - The `app` Router](https://nextjs.org/docs/app/building-your-application/routing#the-app-router)

> - **Folders** are used to define routes. A route is a single path of nested folders, following the file-system hierarchy from the **root folder** down to a final **leaf folder** that includes a page.js file.
> - **Files** are used to create UI that is shown for a route segment.
>
> [Routing Fundamentals - Roles of Folders and Files](https://nextjs.org/docs/app/building-your-application/routing#roles-of-folders-and-files)

NOTE: `page.js` 以外にも予め決められたファイル ([special files](https://nextjs.org/docs/app/building-your-application/routing#file-conventions)) があるけれど、本題からは逸れるので割愛。

### SvelteKit

Ref: https://kit.svelte.jp/docs/routing

- `src/routes` 配下の**ディレクトリ**によって、URL パスが定義される。
- ディレクトリ内に `+page.svelte` **ファイル**を作成して、アプリのページを定義する。

> アプリのルート(routes) — 例えばユーザーがアクセスできる URL パス — は、コードベースのディレクトリによって定義されます

> `+page.svelte` コンポーネントはアプリのページを定義します。

### Nuxt.js

Ref: https://nuxt.com/docs/getting-started/routing

- `pages/` ディレクトリ配下に定義した、ディレクトリ名・ファイル名を元に URL パスを構築する。

> Nuxt routing is based on [vue-router](https://router.vuejs.org/) and generates the routes from every component created in the `pages/` directory, based on their filename.

> ```
> pages/
> --| about.vue
> --| index.vue
> --| posts/
> ----| [id].vue
> ```

### まとめ

Next.js, SvelteKit に習って、以下のルールが良さそう。

- `pages/` 配下のファイルシステムの階層構造を元に、ディレクトリ名のみを参照して URL パスを構築する
- `pages/` 配下の特定の名前のファイルのみがページの UI を表現するコンポーネントになる。
  - `特定の名前` は統一されていれば、Next.js 式、 SvelteKit 式 どちらでも良いかな (好みの問題)
    - `page.[ext]`
    - `+page.[ext]`

```
src/
 ├ pages/
 │ ├ hoge/
 │ │ └ fuga/
 │ │   └ page.vue
         　↑ URL パス `/hoge/fuga` に対応するコンポーネント
```

## フレームワーク毎のコロケーションに関する規約

### Next.js (App Router)

ref: [Project Organization and File Colocation](https://nextjs.org/docs/app/building-your-application/routing/colocation)

#### Safe colocation

`page.js` を含むフォルダのみがアクセス可能な route になるので、 それ以外のファイルは route として登録されない。
つまり、`Safe colocation` が標準で実現できる。

> **project files** can be **safely colocated** inside route segments in the app directory without accidentally being routable.

> ```
> app/
>  ├ components/
>  │ └ button.tsx -> /components/button (Not routable!)
>  ├ dashboard/
>  │ ├ page.tsx   -> /dashboard         (Routable)
>  │ └ nav.tsx    -> /dashboard/nav     (Not routable!)
> ```

#### Private Folders

`app/` フォルダ配下で名前がアンダースコア(`_`)から始まるフォルダはプライベートフォルダになる。プライベートフォルダ配下では、`page.js` を定義しても route として登録されない。

`page.js` 以外が route として登録されない (Safe colocation) にも関わらず、プライベートフォルダ機能があるのは、

- プロジェクト内 (または、 Next.js のエコシステム内) での一貫性
- コードのグループ化

のようなメリットのためとしている。

> Since files in the app directory can be safely colocated by default, private folders are not required for colocation.

> - Consistently organizing internal files across a project and the Next.js ecosystem.
> - Sorting and grouping files in code editors.

> ```
> app/
>  ├ dashboard/
>  │ ├ _libs/
>  │ │ └ page.tsx -> /dashboard/_libs (Not routable!)
>  │ └ page.tsx   -> /dashboard       (Routable)
> ```

コロケーションの実現方針について、ある程度の自由度を持たせつつも、プロジェクト独自の規約のための基準をフレームワーク側から提供してくれている...という感じがする。

### SvelteKit

route files (`+page.svelte` 等の `+` prefix があるファイル) 以外のファイルを `src/routes/` 配下に置いても route として登録されない。
単一のルート内でのみ使用される他のコンポーネントを同じ場所に配置することもできます。

> Any other files inside a route directory are ignored by SvelteKit. This means you can colocate components and utility modules with the routes that need them.
>
> [Routing - Other files](https://kit.svelte.dev/docs/routing#other-files)

> `routes` contains the [routes](https://kit.svelte.dev/docs/routing) of your application. You can also colocate other components that are only used within a single route here
>
> [Project structure - Project files](https://kit.svelte.dev/docs/project-structure#project-files-src)

`Safe colocation` の観点では Next.js と同等だけれど、`Private Folders` のようなコロケーションについて一歩踏み込んだ機能・規約はない。

### Nuxt.js

ドキュメント内で言及なし。

---

## WIP

---

## 余談

**ルート(route) と ルート(root) が、ややこしい 😭**

[^1]: 拡張子は `.js`, `.jsx`, `.tsx` どれでもよい (ref: [File Conventions](https://nextjs.org/docs/app/building-your-application/routing#file-conventions))
[^2]: `pages/**/index.js` だけでなく、`api/**/route.js` も file-based routing の観点で同じ役割を持っているけれど、本記事では割愛。
