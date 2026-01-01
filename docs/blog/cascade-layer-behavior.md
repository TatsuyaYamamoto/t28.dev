---
title: "仕様と照らし合わせながら CSS カスケードレイヤーのふるまいをメモする"
date: 2025-11-15
---

"[CSS の C (Cascading) を見つめ直す](./re-examine-cascading-of-css)" のおかげで CSS のカスケードがちょっと[^1]分かったので、早速、

> [Widely available になってから 1年以上経っている](https://github.com/web-platform-dx/web-features/blob/main/features/cascade-layers.yml.dist#L7)。
> また、いくつかの [UIコン](https://chakra-ui.com/docs/styling/cascade-layers) [ポーネント](https://mui.com/material-ui/customization/css-layers/)・[CSS ラ](https://tailwindcss.com/blog/tailwindcss-v4) [イブラリ](https://panda-css.com/docs/concepts/cascade-layers)でも使われるようになっている

、[カスケードレイヤー](https://developer.mozilla.org/ja/docs/Learn_web_development/Core/Styling_basics/Cascade_layers) をいじってみる。

## いじる

[カスタムプロパティ](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/--*) (`--color`) 上書きしながら `@layer` のふるまいを検証する。

### 最初

```css
body {
  background-color: var(--color);
}
```

`--color` が未定義だから、白背景 ([playground](https://developer.mozilla.org/en-US/play?id=6b%2FIOLgEKZhhlS9sWq5ghEEJLCbQc09p8m7R05yWWfF8HA2DJnVjSQh0B31%2FUMCPKbcH9P8pFK5bFqqT))。

### `red` レイヤーを追加

```css
/** 👇️ */
@layer red {
  :root {
    --color: red;
  }
}

body {
  background-color: var(--color);
}
```

`--color` が定義された結果、赤背景になる ([playground](https://developer.mozilla.org/en-US/play?id=cIlwykrDKs3NAiVO96ycCKTVpFTKcqQOdGHSVAKwOO8F87W4Kfkb1Nbf%2B02Y71dl%2FJwE6mPHgEA%2F80U0))

### `red` レイヤーの後に `blue` レイヤー を追加

```css
@layer red {
  :root {
    --color: red;
  }
}

/** 👇️ */
@layer blue {
  :root {
    --color: blue;
  }
}

body {
  background-color: var(--color);
}
```

> Cascade layers (like declarations) are ordered by order of appearance.
> (...) then for normal rules the declaration whose cascade layer is last wins, (...)
>
> ref: https://www.w3.org/TR/css-cascade-5/#cascade-layering

レイヤーは出現順に並べられ、最後にある宣言が優先される。
そのため、青背景になる ([playground](https://developer.mozilla.org/en-US/play?id=6fNQ4nVaK9LZq8KSDfK4srLoskk2rBhivMUEnDtp6za5oox2OSRqKmRDmnHJSVMUo%2BcE%2BG%2BJap7IQJEz))。

### `blue` レイヤーの後に `green` レイヤー を追加

```css
@layer red {
  :root {
    --color: red;
  }
}

@layer blue {
  :root {
    --color: blue;
  }
}

/** 👇️ */
@layer green {
  :root {
    --color: green;
  }
}

body {
  background-color: var(--color);
}
```

最後に宣言された緑背景になる ([playground](https://developer.mozilla.org/en-US/play?id=0VpBxHqGeWSTJ3meovs%2FJOKRPqtkSUKca%2FRAlPD%2FTODlFFZuTojSBml5WF0qTd15SHxPsKTQVgMn7eYa))。

### ファイルの先頭でレイヤーを宣言する

```css
/** 👇️ */
@layer green, blue, red;

@layer red {
  :root {
    --color: red;
  }
}

@layer blue {
  :root {
    --color: blue;
  }
}

@layer green {
  :root {
    --color: green;
  }
}

body {
  background-color: var(--color);
}
```

`@layer green, blue, red;` でレイヤーの順番が決まっているので、その後に宣言した `@layer green {}` は記述の green レイヤーに割り当てられる。

> Explicit layer identifiers provide a way to assign multiple style blocks to a single layer.
>
> ref: https://www.w3.org/TR/css-cascade-5/#layer-names

そのため red レイヤーが最も優先度が高く、赤背景になる ([playground](https://developer.mozilla.org/en-US/play?id=ZPkKnDWXnU3THeJPNlZOAkk%2FFA4lrG8%2BbBHeDPUo74muz8voNXjLo36cVn0bBG99j0nBS9JZUEvIWX7v))。

### レイヤーの宣言をずらす

```css
@layer red {
  :root {
    --color: red;
  }
}

/** 👇️ */
@layer green, blue, red;

@layer blue {
  :root {
    --color: blue;
  }
}

@layer green {
  :root {
    --color: green;
  }
}

body {
  background-color: var(--color);
}
```

`@layer red{}` の次に `@layer green, blue, red;` が宣言されているため、レイヤーの順番は `red -> green -> blue`になる。
そのため、青背景になる([playground](https://developer.mozilla.org/en-US/play?id=R9WQG5G1Fy3KuyW5oGgCi1JwhGQYyCz5VdQZxAHXBvaZonkCXuVy4Xfxhlw9f5QDNYbK9r%2FXDdVhCfjl))。

### 匿名レイヤーを追加する

```css
@layer green, blue, red;

/** 👇️ */
@layer {
  :root {
    --color: yellow;
  }
}

@layer red {
  :root {
    --color: red;
  }
}

@layer blue {
  :root {
    --color: blue;
  }
}

@layer green {
  :root {
    --color: green;
  }
}

/** 👇️ */
@layer {
  :root {
    --color: purple;
  }
}

body {
  background-color: var(--color);
}
```

になる。匿名レイヤーは、宣言ごとに一意のものとして扱われる。

> anonymous segments have unique identities for each occurrence.
>
> ref: https://www.w3.org/TR/css-cascade-5/#layer-names

そのため上記のレイヤー順は:

1. `green`
2. `blue`
3. `red`
4. `<anonymouse>`
5. `<anonymouse>`

になり、紫背景になる ([playground](https://developer.mozilla.org/en-US/play?id=riIchCM61SxFDFbmqJsmh9fqW6NcTEiCrLaPjDPjewhX0cY86g89VS2GUoNXLgGPrYMJgN9uB18%2BE9IP))。

### `@layer` を使わずに宣言する (implicit final layer)

```css
/** 👇️ */
:root {
  --color: orange;
}

@layer green, blue, red;

@layer {
  :root {
    --color: yellow;
  }
}

@layer red {
  :root {
    --color: red;
  }
}

@layer blue {
  :root {
    --color: blue;
  }
}

@layer green {
  :root {
    --color: green;
  }
}

@layer {
  :root {
    --color: purple;
  }
}

body {
  background-color: var(--color);
}
```

`@layer` を使わない宣言は `implicit final layer` に追加される。

> For the purpose of this step, any declaration not assigned to an explicit layer is added to an implicit final layer.
>
> ref: https://www.w3.org/TR/css-cascade-5/#cascade-layering

**final** なので、レイヤー順において一番優先されるレイヤーになるため、オレンジ背景になる([playground](https://developer.mozilla.org/en-US/play?id=VCPV14yCupfywJKX6tXQnLBrpT9XtTuU%2BO%2FUpzrDsrvfF5Z2aONQ9juD%2FhQvSb82SuhxNlJpA%2BhKQhea))。

## (余談) カスケードレイヤーが解決すること

ref: [MDN - カスケードレイヤー - カスケードレイヤーが解決できる課題](https://developer.mozilla.org/ja/docs/Learn_web_development/Core/Styling_basics/Cascade_layers#%E3%82%AB%E3%82%B9%E3%82%B1%E3%83%BC%E3%83%89%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E3%81%8C%E8%A7%A3%E6%B1%BA%E3%81%A7%E3%81%8D%E3%82%8B%E8%AA%B2%E9%A1%8C)

> 大規模なコードベースでは、(...)

大規模なコードベースのスタイルは様々なところから提供される:

- 複数のチーム
- コンポーネントライブラリー
- フレームワーク
- サードパーティ

それらは作成者スタイルシート内でカスケードされる。辛すぎ。

> 多くのソースから提供されたスタイルが一緒にカスケードされること、(...)

チーム・人によってカスケード値を決める方法が違うかもしれない。辛すぎ。

> 詳細度の競合は、すばやくエスカレートする可能性があります。(...)

`!important` での解決はありがちだけれど、競合を通常の宣言から重要な宣言に移しているだけ。辛すぎ。

> カスケードオリジンがユーザー、ユーザーエージェント、作成者スタイル間のパワーバランスを提供するのと同じように、カスケードレイヤーは、(...)

カスケードレイヤーはサブオリジンがあるかのように、構造的に整理する方法。

> レイヤー内のルールは、レイヤー外のスタイルルールと競合することなく、互いにカスケードされます。(...)

カスケードレイヤーを使えば、レイヤーごとにスタイルを独立させられるので、細かい競合を気にせずに済む。嬉しすぎ。

> レイヤーの優先順位は、常にセレクターの詳細度よりも優先されます。(...)

レイヤー間の詳細度の懸念はない。嬉しすぎ。

[^1]: ほんとうの意味で、ちょっと。
