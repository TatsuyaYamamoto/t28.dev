---
title: "Git Aliases で「Pull request のリファレンスを参照するローカルブランチを作る」"
date: "2025-04-22"
---

お仕事で Pull request のレビューを行うとき、ローカルで実行したりエディターでコードを見たくなること多々あります。
そのとき、一般的には

- HEAD ブランチを見て、
- ローカルで fetch & switch して[^1]、
- 終わったらブランチを消す

という流れになると思いますが、今の私は PR 番号で作業をしたい 👇️

- **PR 番号**を見て、
- ローカルで fetch (ここで **PR 番号のブランチ**を作って) & switch して、
- 終わったら ブランチを**PR 番号を使って消す**

シェルスクリプトを書けば良い話ですが、実装は置き場にこだわりたいですよね？
今回のような Git 用のスクリプトは [Git の Alias](https://git-scm.com/book/ja/v2/Git-%E3%81%AE%E5%9F%BA%E6%9C%AC-Git-%E3%82%A8%E3%82%A4%E3%83%AA%E3%82%A2%E3%82%B9) を使うのがちょうど良さそうなので、Alias に挑戦してみます 🦕

## Git Aliases

https://git-scm.com/docs/git-config#Documentation/git-config.txt-alias

Git の Alias は [`git command wrapper`](https://git-scm.com/docs/git-config#:~:text=git[1]%20command%20wrapper) と記されている通り、Git のサブコマンドやオプションをエイリアスとして登録して簡単に呼び出すことが出来るものです。しかも、Git の補完が効く[^2]！

```ini
# .gitconfig で 👇️を登録すると
[alias]
  last = cat-file commit HEAD
```

```shell
# 👇️ が実行できる
$ git last
tree 48a4f5d10b5e5be913daeb3fe605ca3fcc72ff96
parent 59aeabe2738e115c7dc2c77c988dca45eeb12747
author ...
committer ...

feat: this is commit message
```

Git Alias は[外部のコマンドも実行できる](https://git-scm.com/docs/git-config#:~:text=it%20will%20be%20treated%20as%20a%20shell%20command)ため、これを使って `git pr-switch` を実装したい。

```shell
# 👇️ ってやって #123 の実装をローカルで見たい
$ git pr-switch 123
```

## Pull request のリファレンスを参照する local ブランチを作る

https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/checking-out-pull-requests-locally#modifying-an-inactive-pull-request-locally

コマンドは GitHub が教えてくれている。

```shell
$ git fetch origin pull/ID/head:BRANCH_NAME
```

GitHub では pull request の HEAD ブランチや merge 後の commit (仮) を参照する特別なリファレンスがある[^3]。

- `pull/<number>/head`
- `pull/<number>/merge`

これで PR 番号からローカルブランチを作ることが出来るってわけ。

## Git Aliases で外部コマンドを実行したり、引数を受け取る

- エイリアスの先頭に `!` を付けて、外部コマンドを実行できるようにする
- インライン関数を定義してエイリアスで引数をいい感じに処理できるようにする

...って[公式ドキュメントが教えてくれている](https://git-scm.com/docs/git-config#:~:text=A%20convenient%20way)。

> `alias.cmd = "!c() { echo $1 | grep $2 ; }; c"`

## 結論

ってことで、`pr-swich` を書きました。

- 流石に 1 行で書くと読むのが辛いので、`\` で改行した
- 再度 `pr-switch` を実行して PR の更新に追従するために、`git switch --detach` で一旦ブランチから抜ける
- 関数ではなく `sh -c` で実装している記事が多くあるけれど、私は公式ドキュメントに巻かれたい

```ini
[alias]
    pr-switch = "!c(){\
      readonly PR_NUMBER=$1; \
      git switch --detach; \
      git fetch origin pull/$PR_NUMBER/head:#$PR_NUMBER; \
      git switch \"#$PR_NUMBER\"; \
    };c"
```

ついでに、`pr-prune` も書いてみた。PR ブランチが `#<number>` 形式なので、まとめて消す実装がちょっと楽に出来る。

```ini
[alias]
    pr-prune = "!c(){\
      git branch --list '#*' | grep -v '*' | xargs --no-run-if-empty git branch -D; \
    };c"
```

[^1]: [gh コマンド (`gh pr checkout 123`) でも出来る](https://docs.github.com/ja/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/checking-out-pull-requests-locally#modifying-an-active-pull-request-locally)んだけれどね。

[^2]: Zsh の補完が優秀なだけかも

[^3]: [stack overflow は教えてくれる](https://stackoverflow.com/questions/63594658/git-refs-merge-vs-head-in-pull-request)けれど、公式ドキュメントは教えてくれない (見つけられない)
