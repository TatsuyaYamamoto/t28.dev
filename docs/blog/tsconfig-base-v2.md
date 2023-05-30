---
title: "tsconfig/bases (の一部) が v2 になったので、ファイルと設定を比較する"
date: 2023-04-23
---

関連: [tsconfig/bases 内の tsconfig.json を (自分が知りたい範囲で) 比較する](./tsconfig-bases-diff)

## tsconfig/bases?

コミュニティでメンテナンスされている 環境毎のおすすめ tsconfig、及びそのリポジトリ ([tsconfig/bases](https://github.com/tsconfig/bases)) のこと。
雑多になりがちな tsconfig.json がスッキリするし、コミュニティで決めてくれたいい感じの設定に乗っかれて楽なので、私はよく使っています。

```json
{
  "extends": "なにか",
  "compilerOptions": {
    // ちょこっと
  }
}
```

## Combined configs

[# What about combined configs?](https://github.com/tsconfig/bases#what-about-combined-configs) をまとめて、いくつか情報を付け加えると、以下の通り。

- TypeScript v4 までは tsconfig.json は 1 つの json ファイルしか extends 出来なかった
- そのため、tsconfig/bases では共通の設定を組み合わせた tsconfig.json を提供していた
  - 例: [node16-strictest-esm.combined.json](https://github.com/tsconfig/bases/blob/ca718dd359bab60057e6df1256324291efd05546/bases/node16-strictest-esm.combined.json)
- TypeScript v5 からは**複数の tsconfig.json を extends 出来る**ようになった (ref: [Supporting Multiple Configuration Files in extends](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-rc/#supporting-multiple-configuration-files-in-extends))
- Combined config を消して(commit: [Remove LTS configs other than the base one](https://github.com/tsconfig/bases/commit/0ae4791797d8ba3dd2bca9aca880eb2d3e30e6fb))、ユーザーは必要な設定を自分で組み合わせて使用する

要するに、今まで 👇 のように設定していた tsconfig.json が

```json
// OLD
{
  "extends": "@tsconfig/node16-strictest-esm/tsconfig.json"
}
```

👇 のように設定するように変わった訳ですね。

```json
// NEW!!
{
  "extends": [
    "@tsconfig/node16/tsconfig.json",
    "@tsconfig/strictest/tsconfig.json",
    "@tsconfig/esm/tsconfig.json"
  ]
}
```

この変更によって、[@tsconfig/strictest](https://www.npmjs.com/package/@tsconfig/strictest) に破壊的変更が加わり、v2 になっています (タイトル回収)。

## 新旧設定値を比較してみる (本題)

設定方法だけが変わったのか（設定方法以外になにか差分はないのか）が気になったので確認してみます。

古いバージョン(combine 形式)の tsconfig.json と新しいバージョン(multiple 形式)の tsconfig.json で diff を取ってみる。

```bash
$ COMBINED=$(curl -s https://raw.githubusercontent.com/tsconfig/bases/ca718dd359bab60057e6df1256324291efd05546/bases/node16-strictest-esm.combined.json | grep -v "//" | jq  ".compilerOptions")

$ NODE16=$(curl -s https://raw.githubusercontent.com/tsconfig/bases/main/bases/node16.json)
$ STRICTEST=$(curl -s https://raw.githubusercontent.com/tsconfig/bases/main/bases/strictest.json)
$ ESM=$(curl -s https://raw.githubusercontent.com/tsconfig/bases/main/bases/esm.json)
$ MULTIPLE=$(echo "$NODE16 $STRICTEST $ESM" | jq -s '.[0].compilerOptions * .[1].compilerOptions * .[2].compilerOptions')

$ sdiff <(echo $COMBINED) <(echo $MULTIPLE)
```

(ちなみに、tsconfig.json の extends の内容が競合した場合は、後者の設定が優先されます ([ref](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-rc/#supporting-multiple-configuration-files-in-extends)))

```bash
# diff の結果
{                                                               {
  "lib": [                                                        "lib": [
    "es2021"                                                        "es2021"
  ],                                                              ],
  "module": "es2022",                                             "module": "es2022",
  "target": "es2021",                                             "target": "es2021",
  "strict": true,                                                 "strict": true,
  "esModuleInterop": true,                                        "esModuleInterop": true,
  "skipLibCheck": true,                                           "skipLibCheck": true,
  "forceConsistentCasingInFileNames": true,                       "forceConsistentCasingInFileNames": true,
  "moduleResolution": "node",                                     "moduleResolution": "node",
  "allowUnusedLabels": false,                                     "allowUnusedLabels": false,
  "allowUnreachableCode": false,                                  "allowUnreachableCode": false,
  "exactOptionalPropertyTypes": true,                             "exactOptionalPropertyTypes": true,
  "noFallthroughCasesInSwitch": true,                             "noFallthroughCasesInSwitch": true,
  "noImplicitOverride": true,                                     "noImplicitOverride": true,
  "noImplicitReturns": true,                                      "noImplicitReturns": true,
  "noPropertyAccessFromIndexSignature": true,                     "noPropertyAccessFromIndexSignature": true,
  "noUncheckedIndexedAccess": true,                               "noUncheckedIndexedAccess": true,
  "noUnusedLocals": true,                                         "noUnusedLocals": true,
  "noUnusedParameters": true,                                     "noUnusedParameters": true,
  "importsNotUsedAsValues": "error",                          |   "checkJs": true,
  "checkJs": true                                             |   "verbatimModuleSyntax": true
}
```

結果は

- 新しいバージョンで、`"importsNotUsedAsValues": "error"` が消えた
- 新しいバージョンで、`"verbatimModuleSyntax": true` が増えた

TypeScript v5 で非推奨になった/追加されたオプションの差分が反映されているだけですね。

> error TS5101: Flag 'importsNotUsedAsValues' is deprecated and will stop functioning in TypeScript 5.5. Specify 'ignoreDeprecations: "5.0"' to silence this error.
> Use 'verbatimModuleSyntax' instead.
>
> ref: https://github.com/microsoft/TypeScript/pull/52203/files#diff-a3c1a792813a699ca6207a409ad07af6d73db2846e7d8ef6ab2c6d28aab9291bR1
