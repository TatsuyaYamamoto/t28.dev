---
title: "Node.js の Modules: Packages documentation のバージョン間の差分を見てみた"
date: 2023-05-06
---

## 前回のおさらい

前回([(Node.js にとっての) ES modules ってなに](./ecmascript-modules-for-nodejs))少し親しくなった ESM ですが、
新しい機能の印象が(個人的に)まだまだ強いので、
各バージョンのドキュメントの Diff を取って直近の LTS 間の更新を見ることで、
もっと ESM とお近づきになることにしました。

## v18.16.0 vs v16.20.0

### Summary

- `Community Conditions Definitions` に `"react-native"` が追加された
- `Subpath folder mappings` が削除された

### Diff

```bash
$ sdiff -sl <( git cat-file -p v18.16.0:doc/api/packages.md) <(git cat-file -p v16.20.0:doc/api/packages.md)
```

<details>
<summary>出力</summary>

````bash
* `"react-native"` - will be matched by the React Native fram <
  platforms). _To target React Native for Web, `"browser"` sh <
  before this condition._                                     <
                                                              > ### Subpath folder mappings
                                                              >
                                                              > <!-- YAML
                                                              > changes:
                                                              >   - version: v16.0.0
                                                              >     pr-url: https://github.com/nodejs/node/pull/37215
                                                              >     description: Runtime deprecation.
                                                              >   - version: v15.1.0
                                                              >     pr-url: https://github.com/nodejs/node/pull/35747
                                                              >     description: Runtime deprecation for self-referencing imp
                                                              >   - version:
                                                              >     - v14.13.0
                                                              >     - v12.20.0
                                                              >     pr-url: https://github.com/nodejs/node/pull/34718
                                                              >     description: Documentation-only deprecation.
                                                              > -->
                                                              >
                                                              > > Stability: 0 - Deprecated: Use subpath patterns instead.
                                                              >
                                                              > Before subpath patterns were supported, a trailing `"/"` suff
                                                              > support folder mappings:
                                                              >
                                                              > ```json
                                                              > {
                                                              >   "exports": {
                                                              >     "./features/": "./features/"
                                                              >   }
                                                              > }
                                                              > ```
                                                              >
                                                              > _This feature will be removed in a future release._
                                                              >
                                                              > Instead, use direct [subpath patterns][]:
                                                              >
                                                              > ```json
                                                              > {
                                                              >   "exports": {
                                                              >     "./features/*": "./features/*.js"
                                                              >   }
                                                              > }
                                                              > ```
                                                              >
                                                              > The benefit of patterns over folder exports is that packages
                                                              > imported by consumers without subpath file extensions being n
                                                              >
     state,                                                   |      state
added:                                                        | added: v16.9.0
  - v16.9.0                                                   <
  - v14.19.0                                                  <
used when working on the current project. It can be set to an | used when working on the current project. It can set to any o
same package manager versions without having to install anyth | same package manager versions without having to install anyth
                                                              > [subpath patterns]: #subpath-patterns
22:19:23 kotori@[~/workspace/oss/node][tags/v12.22.9]
(;'8')?! < $ sdiff -s <( git cat-file -p v18.16.0:doc/api/packages.md) <(git cat-file -p v16.20.0:doc/api/packages.md)
* `"react-native"` - will be matched by the React Native fram <
  platforms). _To target React Native for Web, `"browser"` sh <
  before this condition._                                     <
                                                              > ### Subpath folder mappings
                                                              >
                                                              > <!-- YAML
                                                              > changes:
                                                              >   - version: v16.0.0
                                                              >     pr-url: https://github.com/nodejs/node/pull/37215
                                                              >     description: Runtime deprecation.
                                                              >   - version: v15.1.0
                                                              >     pr-url: https://github.com/nodejs/node/pull/35747
                                                              >     description: Runtime deprecation for self-referencing imp
                                                              >   - version:
                                                              >     - v14.13.0
                                                              >     - v12.20.0
                                                              >     pr-url: https://github.com/nodejs/node/pull/34718
                                                              >     description: Documentation-only deprecation.
                                                              > -->
                                                              >
                                                              > > Stability: 0 - Deprecated: Use subpath patterns instead.
                                                              >
                                                              > Before subpath patterns were supported, a trailing `"/"` suff
                                                              > support folder mappings:
                                                              >
                                                              > ```json
                                                              > {
                                                              >   "exports": {
                                                              >     "./features/": "./features/"
                                                              >   }
                                                              > }
                                                              > ```
                                                              >
                                                              > _This feature will be removed in a future release._
                                                              >
                                                              > Instead, use direct [subpath patterns][]:
                                                              >
                                                              > ```json
                                                              > {
                                                              >   "exports": {
                                                              >     "./features/*": "./features/*.js"
                                                              >   }
                                                              > }
                                                              > ```
                                                              >
                                                              > The benefit of patterns over folder exports is that packages
                                                              > imported by consumers without subpath file extensions being n
                                                              >
     state,                                                   |      state
added:                                                        | added: v16.9.0
  - v16.9.0                                                   <
  - v14.19.0                                                  <
used when working on the current project. It can be set to an | used when working on the current project. It can set to any o
same package manager versions without having to install anyth | same package manager versions without having to install anyth
                                                              > [subpath patterns]: #subpath-patterns
````

</details>

## v16.20.0 vs v14.21.3

### Summary

- [Modules loaders](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#modules-loaders) (commonjs と ES modules の読み込みに関する説明) が追加された
- [Package entry points](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#package-entry-points)
  - `main`、`exports` フィールドの説明のニュアンスが少し変わった
    - v14: `main` より `exports` が優先される
    - v16: `exports` が推奨。 `main` を使うのは Node.js v10 をサポートするケースなど
- [Main entry point export](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#main-entry-point-export)
  - 定義方法の推奨が変わった
    - v14
      ```json
      {
        "main": "./main.js",
        "exports": "./main.js"
      }
      ```
    - v16
      ```json
      {
        "exports": "./index.js"
      }
      ```
      - 現在サポートされている Node.js のバージョン、最新のビルドツールは `exports` をサポートしている
      - それ以外の環境向けの互換性のために `main` も含められる
      - 他のセクションにある package.json の例でも `main` フィールドが削除されている
- [Subpath exports](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#subpath-exports)
  - `Extensions in subpaths` の追加
    - subpath module は 拡張子付きで export すると良さそうなんだけれど、理由はよく理解出来なかった...。
    - 他のセクションにある package.json の例でも拡張子付きに書き換わっている
- `Conditions Definitions` が [Community Conditions Definitions](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#community-conditions-definitions) に変わり、Node.js が定義している条件以外のものに関する説明になった
- [Subpath folder mappings](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#subpath-folder-mappings) (**Deprecated**) が追加された

### 余談的?差分

- `ES Modules` **ではなく**、`ES modules` が正しいみたい

### Diff

```bash
$ sdiff -s <(git cat-file -p v16.20.0:doc/api/packages.md) <(git cat-file -p v14.21.3:doc/api/packages.md)
```

<details>
<summary>出力</summary>

````bash
                                                              <
                                                              <
    - v12.20.0                                                <
    - v12.17.0                                                <
    pr-url: https://github.com/nodejs/node/pull/29866         <
    description: Unflag conditional exports.                  <
  - version:                                                  <
    - v13.7.0                                                 <
    description: Remove the `--experimental-conditional-expor |     description: Unflag conditional exports.
initial input, or when referenced by `import` statements or ` | initial input, or when referenced by `import` statements with
expressions:                                                  <
* Files with an `.mjs` extension.                             | * Files ending in `.mjs`.
* Files with a `.js` extension when the nearest parent `packa | * Files ending in `.js` when the nearest parent `package.json
  contains a top-level [`"type"`][] field with a value of `"m |   top-level [`"type"`][] field with a value of `"module"`.
or when referenced by `import` statements, `import()` express | or when referenced by `import` statements within ES module co
`require()` expressions:                                      <
* Files with a `.cjs` extension.                              | * Files ending in `.cjs`.
* Files with a `.js` extension when the nearest parent `packa | * Files ending in `.js` when the nearest parent `package.json
  contains a top-level field [`"type"`][] with a value of `"c |   top-level field [`"type"`][] with a value of `"commonjs"`.
### Modules loaders                                           <
                                                              <
Node.js has two systems for resolving a specifier and loading <
                                                              <
There is the CommonJS module loader:                          <
                                                              <
* It is fully synchronous.                                    <
* It is responsible for handling `require()` calls.           <
* It is monkey patchable.                                     <
* It supports [folders as modules][].                         <
* When resolving a specifier, if no exact match is found, it  <
  extensions (`.js`, `.json`, and finally `.node`) and then a <
  [folders as modules][].                                     <
* It treats `.json` as JSON text files.                       <
* `.node` files are interpreted as compiled addon modules loa <
  `process.dlopen()`.                                         <
* It treats all files that lack `.json` or `.node` extensions <
  text files.                                                 <
* It cannot be used to load ECMAScript modules (although it i <
  [load ECMASCript modules from CommonJS modules][]). When us <
  JavaScript text file that is not an ECMAScript module, it l <
  CommonJS module.                                            <
                                                              <
There is the ECMAScript module loader:                        <
                                                              <
* It is asynchronous.                                         <
* It is responsible for handling `import` statements and `imp <
* It is not monkey patchable, can be customized using [loader <
* It does not support folders as modules, directory indexes ( <
  `'./startup/index.js'`) must be fully specified.            <
* It does no extension searching. A file extension must be pr <
  when the specifier is a relative or absolute file URL.      <
* It can load JSON modules, but an import assertion is requir <
* It accepts only `.js`, `.mjs`, and `.cjs` extensions for Ja <
  files.                                                      <
* It can be used to load JavaScript CommonJS modules. Such mo <
  are passed through the `cjs-module-lexer` to try to identif <
  which are available if they can be determined through stati <
  Imported CommonJS modules have their URLs converted to abso <
  paths and are then loaded via the CommonJS module loader.   <
                                                              <
                                                              <
node --input-type=module --eval "import { sep } from 'node:pa | node --input-type=module --eval "import { sep } from 'path';
echo "import { sep } from 'node:path'; console.log(sep);" | n | echo "import { sep } from 'path'; console.log(sep);" | node -
In a package's `package.json` file, two fields can define ent | In a package’s `package.json` file, two fields can define e
package: [`"main"`][] and [`"exports"`][]. Both fields apply  | package: [`"main"`][] and [`"exports"`][]. The [`"main"`][] f
and CommonJS module entry points.                             | in all versions of Node.js, but its capabilities are limited:
                                                              > the main entry point of the package.
The [`"main"`][] field is supported in all versions of Node.j | The [`"exports"`][] field provides an alternative to [`"main"
capabilities are limited: it only defines the main entry poin | package main entry point can be defined while also encapsulat
                                                              > **preventing any other entry points besides those defined in
                                                              > This encapsulation allows module authors to define a public i
                                                              > their package.
The [`"exports"`][] provides a modern alternative to [`"main" | If both [`"exports"`][] and [`"main"`][] are defined, the [`"
multiple entry points to be defined, conditional entry resolu | takes precedence over [`"main"`][]. [`"exports"`][] are not s
between environments, and **preventing any other entry points | modules or CommonJS; [`"main"`][] is overridden by [`"exports
defined in [`"exports"`][]**. This encapsulation allows modul | exists. As such [`"main"`][] cannot be used as a fallback for
clearly define the public interface for their package.        | can be used as a fallback for legacy versions of Node.js that
                                                              > [`"exports"`][] field.
For new packages targeting the currently supported versions o <
[`"exports"`][] field is recommended. For packages supporting <
below, the [`"main"`][] field is required. If both [`"exports <
[`"main"`][] are defined, the [`"exports"`][] field takes pre <
[`"main"`][] in supported versions of Node.js.                <
                                                              <
both CommonJS and ES modules in a single package please consu | both CommonJS and ES Modules in a single package please consu
Existing packages introducing the [`"exports"`][] field will  | **Warning**: Introducing the [`"exports"`][] field prevents c
of the package from using any entry points that are not defin | package from using any entry points that are not defined, inc
entry points so that the package's public API is well-defined | entry points so that the package’s public API is well-defin
a project that previously exported `main`, `lib`,             | a project that previous exported `main`, `lib`,
  "name": "my-package",                                       |   "name": "my-mod",
    "./feature/index": "./feature/index.js",                  <
Alternatively a project could choose to export entire folders | Alternatively a project could choose to export entire folders
without extensioned subpaths using export patterns:           <
  "name": "my-package",                                       |   "name": "my-mod",
    "./lib/*.js": "./lib/*.js",                               <
    "./feature/*.js": "./feature/*.js",                       <
With the above providing backwards-compatibility for any mino | As a last resort, package encapsulation can be disabled entir
a future major change for the package can then properly restr | export for the root of the package `"./*": "./*"`. This expos
to only the specific feature exports exposed:                 | in the package at the cost of disabling the encapsulation and
                                                              > benefits this provides. As the ES Module loader in Node.js en
                                                              > [the full specifier path][], exporting the root rather than b
                                                              > about entry is less expressive than either of the prior examp
                                                              > is encapsulation lost but module consumers are unable to
                                                              > `import feature from 'my-mod/feature'` as they need to provid
                                                              > path `import feature from 'my-mod/feature/index.js`.
```json                                                       <
{                                                             <
  "name": "my-package",                                       <
  "exports": {                                                <
    ".": "./lib/index.js",                                    <
    "./feature/*.js": "./feature/*.js",                       <
    "./feature/internal/*": null                              <
  }                                                           <
}                                                             <
```                                                           <
                                                              <
When writing a new package, it is recommended to use the [`"e | To set the main entry point for a package, it is advisable to
                                                              > [`"exports"`][] and [`"main"`][] in the package’s [`package
  "exports": "./index.js"                                     |   "main": "./main.js",
                                                              >   "exports": "./main.js"
All currently supported versions of Node.js and modern build  <
`"exports"` field. For projects using an older version of Nod <
build tool, compatibility can be achieved by including the `" <
alongside `"exports"` pointing to the same module:            <
                                                              <
```json                                                       <
{                                                             <
  "main": "./index.js",                                       <
  "exports": "./index.js"                                     <
}                                                             <
```                                                           <
                                                              <
                                                              <
                                                              >   "main": "./main.js",
    ".": "./index.js",                                        |     ".": "./main.js",
    "./submodule.js": "./src/submodule.js"                    |     "./submodule": "./src/submodule.js"
import submodule from 'es-module-package/submodule.js';       | import submodule from 'es-module-package/submodule';
#### Extensions in subpaths                                   <
                                                              <
Package authors should provide either extensioned (`import 'p <
extensionless (`import 'pkg/subpath'`) subpaths in their expo <
that there is only one subpath for each exported module so th <
import the same consistent specifier, keeping the package con <
consumers and simplifying package subpath completions.        <
                                                              <
Traditionally, packages tended to use the extensionless style <
benefits of readability and of masking the true path of the f <
package.                                                      <
                                                              <
With [import maps][] now providing a standard for package res <
and other JavaScript runtimes, using the extensionless style  <
bloated import map definitions. Explicit file extensions can  <
enabling the import map to utilize a [packages folder mapping <
subpaths where possible instead of a separate map entry per p <
export. This also mirrors the requirement of using [the full  <
in relative and absolute import specifiers.                   <
                                                              <
### Exports sugar                                             <
                                                              <
<!-- YAML                                                     <
added: v12.11.0                                               <
-->                                                           <
                                                              <
If the `"."` export is the only export, the [`"exports"`][] f <
for this case being the direct [`"exports"`][] field value.   <
                                                              <
```json                                                       <
{                                                             <
  "exports": {                                                <
    ".": "./index.js"                                         <
  }                                                           <
}                                                             <
```                                                           <
                                                              <
can be written:                                               <
                                                              <
```json                                                       <
{                                                             <
  "exports": "./index.js"                                     <
}                                                             <
```                                                           <
                                                              <
                                                              <
In addition to the [`"exports"`][] field, there is a package  | In addition to the [`"exports"`][] field, it is possible to d
to create private mappings that only apply to import specifie | package import maps that only apply to import specifiers from
package itself.                                               | itself.
Entries in the `"imports"` field must always start with `#` t | Entries in the imports field must always start with `#` to en
disambiguated from external package specifiers.               | disambiguated from package specifiers.
The resolution rules for the imports field are otherwise anal | The resolution rules for the imports field are otherwise
exports field.                                                | analogous to the exports field.
                                                              <
changes:                                                      <
  - version:                                                  <
    - v16.10.0                                                <
    - v14.19.0                                                <
    pr-url: https://github.com/nodejs/node/pull/40041         <
    description: Support pattern trailers in "imports" field. <
  - version:                                                  <
    - v16.9.0                                                 <
    - v14.19.0                                                <
    pr-url: https://github.com/nodejs/node/pull/39635         <
    description: Support pattern trailers.                    <
    "./features/*.js": "./src/features/*.js"                  |     "./features/*": "./src/features/*.js"
    "#internal/*.js": "./src/internal/*.js"                   |     "#internal/*": "./src/internal/*.js"
import featureX from 'es-module-package/features/x.js';       | import featureX from 'es-module-package/features/x';
import featureY from 'es-module-package/features/y/y.js';     | import featureY from 'es-module-package/features/y/y';
import internalZ from '#internal/z.js';                       | import internalZ from '#internal/z';
This is a direct static matching and replacement without any  | This is a direct static replacement without any special handl
for file extensions. Including the `"*.js"` on both sides of  | extensions. In the previous example, `pkg/features/x.json` wo
restricts the exposed package exports to only JS files.       | `./src/features/x.json.js` in the mapping.
    "./features/*.js": "./src/features/*.js",                 |     "./features/*": "./src/features/*.js",
import featureInternal from 'es-module-package/features/priva | import featureInternal from 'es-module-package/features/priva
import featureX from 'es-module-package/features/x.js';       | import featureX from 'es-module-package/features/x';
### Conditional exports                                       | ### Exports sugar
                                                              > <!-- YAML
                                                              > added: v12.11.0
                                                              > -->
                                                              > If the `"."` export is the only export, the [`"exports"`][] f
                                                              > for this case being the direct [`"exports"`][] field value.
                                                              >
                                                              > If the `"."` export has a fallback array or string value, the
                                                              > [`"exports"`][] field can be set to this value directly.
                                                              >
                                                              > ```json
                                                              > {
                                                              >   "exports": {
                                                              >     ".": "./main.js"
                                                              >   }
                                                              > }
                                                              > ```
                                                              >
                                                              > can be written:
                                                              >
                                                              > ```json
                                                              > {
                                                              >   "exports": "./main.js"
                                                              > }
                                                              > ```
                                                              >
                                                              > ### Conditional exports
                                                              >   "main": "./main-require.cjs",
    "import": "./index-module.js",                            |     "import": "./main-module.js",
    "require": "./index-require.cjs"                          |     "require": "./main-require.cjs"
Node.js implements the following conditions, listed in order  | Node.js implements the following conditions:
specific to least specific as conditions should be defined:   <
* `"node-addons"` - similar to `"node"` and matches for any N <
  This condition can be used to provide an entry point which  <
  addons as opposed to an entry point which is more universal <
  on native addons. This condition can be disabled via the    <
  [`--no-addons` flag][].                                     <
* `"node"` - matches for any Node.js environment. Can be a Co <
  module file. _In most cases explicitly calling out the Node <
  not necessary._                                             <
  `import()`, or via any top-level import or resolve operatio |    `import()`, or via any top-level import or resolve operati
  ECMAScript module loader. Applies regardless of the module  |    ECMAScript module loader. Applies regardless of the module
  target file. _Always mutually exclusive with `"require"`._  |    target file. _Always mutually exclusive with `"require"`._
  referenced file should be loadable with `require()` althoug |    referenced file should be loadable with `require()` althou
  matches regardless of the module format of the target file. |    matches regardless of the module format of the target file
  formats include CommonJS, JSON, and native addons but not E |    formats include CommonJS, JSON, and native addons but not
  `require()` doesn't support them. _Always mutually exclusiv |    `require()` doesn't support them. _Always mutually exclusi
  `"import"`._                                                |    `"import"`._
                                                              > * `"node"` - matches for any Node.js environment. Can be a Co
                                                              >    module file. _This condition should always come after `"im
                                                              >    `"require"`._
                                                              > * `"node-addons"` - similar to `"node"` and matches for any N
                                                              >    This condition can be used to provide an entry point which
                                                              >    addons as opposed to an entry point which is more universa
                                                              >    on native addons. This condition can be disabled via the
                                                              >    [`--no-addons` flag][].
  or ES module file. _This condition should always come last. |    or ES module file. _This condition should always come last
The `"node-addons"` condition can be used to provide an entry <
uses native C++ addons. However, this condition can be disabl <
[`--no-addons` flag][]. When using `"node-addons"`, it's reco <
`"default"` as an enhancement that provides a more universal  <
using WebAssembly instead of a native addon.                  <
                                                              <
                                                              >   "main": "./main.js",
    ".": "./index.js",                                        |     ".": "./main.js",
    "./feature.js": {                                         |     "./feature": {
Defines a package where `require('pkg/feature.js')` and       | Defines a package where `require('pkg/feature')` and `import
`import 'pkg/feature.js'` could provide different implementat | could provide different implementations between Node.js and o
Node.js and other JS environments.                            | environments.
                                                              >   "main": "./main.js",
    "default": "./feature.mjs"                                |     "default": "./feature.mjs",
a nested condition does not have any mapping it will continue | a nested conditional does not have any mapping it will contin
                                                              <
node --conditions=development index.js                        | node --conditions=development main.js
### Community Conditions Definitions                          | ### Conditions Definitions
Condition strings other than the `"import"`, `"require"`, `"n | The `"import"`, `"require"`, `"node"`, `"node-addons"` and `"
`"node-addons"` and `"default"` conditions                    | conditions are defined and implemented in Node.js core,
[implemented in Node.js core](#conditional-exports) are ignor | [as specified above](#packages_conditional_exports).
Other platforms may implement other conditions and user condi | The `"node-addons"` condition can be used to provide an entry
enabled in Node.js via the [`--conditions` / `-C` flag][].    | uses native C++ addons. However, this condition can be disabl
                                                              > [`--no-addons` flag][]. When using `"node-addons"`, it's reco
                                                              > `"default"` as an enhancement that provides a more universal
                                                              > using WebAssembly instead of a native addon.
Since custom package conditions require clear definitions to  | Other condition strings are unknown to Node.js and thus ignor
usage, a list of common known package conditions and their st | Runtimes or tools other than Node.js can use them at their di
is provided below to assist with ecosystem coordination.      <
* `"types"` - can be used by typing systems to resolve the ty | These user conditions can be enabled in Node.js via the [`--c
  the given export. _This condition should always be included | flag](#packages_resolving_user_conditions).
* `"deno"` - indicates a variation for the Deno platform.     |
* `"browser"` - any web browser environment.                  | The following condition definitions are currently endorsed by
                                                              >
                                                              > * `"browser"` - any environment which implements a standard s
                                                              >    browser APIs available from JavaScript in web browsers, in
                                                              >    APIs.
  entry point, for example to provide additional debugging co |    entry point. _Must always be mutually exclusive with `"pro
  better error messages when running in a development mode. _ <
  mutually exclusive with `"production"`._                    <
  point. _Must always be mutually exclusive with `"developmen |    point. _Must always be mutually exclusive with `"developme
                                                              > The above user conditions can be enabled in Node.js via the [
                                                              > flag](#packages_resolving_user_conditions).
                                                              >
                                                              > Platform specific conditions such as `"deno"`, `"electron"`,
                                                              > may be used, but while there remain no implementation or inte
                                                              > from these platforms, the above are not explicitly endorsed b
                                                              >
                                                              <
Within a package, the values defined in the package's         | Within a package, the values defined in the package’s
`package.json` [`"exports"`][] field can be referenced via th | `package.json` [`"exports"`][] field can be referenced via th
    ".": "./index.mjs",                                       |     ".": "./main.mjs",
    "./foo.js": "./foo.js"                                    |     "./foo": "./foo.js"
import { something } from 'a-package'; // Imports "something" | import { something } from 'a-package'; // Imports "something"
const { something } = require('a-package/foo.js'); // Loads f | const { something } = require('a-package/foo'); // Loads from
### Subpath folder mappings                                   <
                                                              <
<!-- YAML                                                     <
changes:                                                      <
  - version: v16.0.0                                          <
    pr-url: https://github.com/nodejs/node/pull/37215         <
    description: Runtime deprecation.                         <
  - version: v15.1.0                                          <
    pr-url: https://github.com/nodejs/node/pull/35747         <
    description: Runtime deprecation for self-referencing imp <
  - version:                                                  <
    - v14.13.0                                                <
    - v12.20.0                                                <
    pr-url: https://github.com/nodejs/node/pull/34718         <
    description: Documentation-only deprecation.              <
-->                                                           <
                                                              <
> Stability: 0 - Deprecated: Use subpath patterns instead.    <
                                                              <
Before subpath patterns were supported, a trailing `"/"` suff <
support folder mappings:                                      <
                                                              <
```json                                                       <
{                                                             <
  "exports": {                                                <
    "./features/": "./features/"                              <
  }                                                           <
}                                                             <
```                                                           <
                                                              <
_This feature will be removed in a future release._           <
                                                              <
Instead, use direct [subpath patterns][]:                     <
                                                              <
```json                                                       <
{                                                             <
  "exports": {                                                <
    "./features/*": "./features/*.js"                         <
  }                                                           <
}                                                             <
```                                                           <
                                                              <
The benefit of patterns over folder exports is that packages  <
imported by consumers without subpath file extensions being n <
                                                              <
2. The package is usable in both current Node.js and older ve | 1. The package is usable in both current Node.js and older ve
3. The package main entry point, e.g. `'pkg'` can be used by  | 1. The package main entry point, e.g. `'pkg'` can be used by
4. The package provides named exports, e.g. `import { name }  | 1. The package provides named exports, e.g. `import { name }
5. The package is potentially usable in other ES module envir | 1. The package is potentially usable in other ES module envir
6. The hazards described in the previous section are avoided  | 1. The hazards described in the previous section are avoided
                                                              >   "main": "./index.cjs",
See [Enabling](esm.md#enabling).                              | See [Enabling](esm.md#esm_enabling).
                                                              <
  underlying CommonJS files, it doesn't matter if `utilities- |   underlying CommonJS files, it doesn’t matter if `utilitie
but doesn't affect the ES module version (for example, becaus | but doesn’t affect the ES module version (for example, beca
                                                              >   "main": "./index.cjs",
                                                              >   "main": "./index.cjs",
the package's management of state is carefully isolated (or t | the package’s management of state is carefully isolated (or
user's application code could `import` the ES module version  | user’s application code could `import` the ES module versio
Aside from writing a stateless package (if JavaScript's `Math | Aside from writing a stateless package (if JavaScript’s `Ma
some ways to isolate state so that it's shared between the po | some ways to isolate state so that it’s shared between the
1. If possible, contain all state within an instantiated obje | 1. If possible, contain all state within an instantiated obje
   ```js                                                      |     ```js
   import Date from 'date';                                   |     import Date from 'date';
   const someDate = new Date();                               |     const someDate = new Date();
   // someDate contains state; Date does not                  |     // someDate contains state; Date does not
   ```                                                        |     ```
   The `new` keyword isn't required; a package's function can |    The `new` keyword isn’t required; a package’s function
2. Isolate the state in one or more CommonJS files that are s | 1. Isolate the state in one or more CommonJS files that are s
   ```cjs                                                     |     ```cjs
   // ./node_modules/pkg/index.cjs                            |     // ./node_modules/pkg/index.cjs
   const state = require('./state.cjs');                      |     const state = require('./state.cjs');
   module.exports.state = state;                              |     module.exports.state = state;
   ```                                                        |     ```
   ```js                                                      |     ```js
   // ./node_modules/pkg/index.mjs                            |     // ./node_modules/pkg/index.mjs
   import state from './state.cjs';                           |     import state from './state.cjs';
   export {                                                   |     export {
     state                                                    |       state
   };                                                         |     };
   ```                                                        |     ```
Any plugins that attach to the package's singleton would need | Any plugins that attach to the package’s singleton would ne
                                                              <
                                                              >   "main": "./index.cjs",
as [npm](https://docs.npmjs.com/cli/v8/configuring-npm/packag | as [npm](https://docs.npmjs.com/creating-a-package-json-file)
                                                              <
The `"name"` field defines your package's name. Publishing to | The `"name"` field defines your package’s name. Publishing
                                                              <
  "main": "./index.js"                                        |   "main": "./main.js"
The `"main"` field defines the entry point of a package when  | The `"main"` field defines the script that is used when the [
via a `node_modules` lookup.  Its value is a path.            | is loaded via `require()`](modules.md#modules_folders_as_modu
                                                              > is a path.
When a package has an [`"exports"`][] field, this will take p <
`"main"` field when importing the package by name.            <
                                                              <
It also defines the script that is used when the [package dir <
via `require()`](modules.md#folders-as-modules).              <
                                                              <
// This resolves to ./path/to/directory/index.js.             | require('./path/to/directory'); // This resolves to ./path/to
require('./path/to/directory');                               <
### `"packageManager"`                                        | When a package has an [`"exports"`][] field, this will take p
                                                              > `"main"` field when importing the package by name.
                                                              > ### `"packageManager"`
added: v16.9.0                                                | added: v14.19.0
                                                              <
when searching in the current folder, that folder's parent, a | when searching in the current folder, that folder’s parent,
until a node\_modules folder or the volume root is reached.   | until a node_modules folder or the volume root is reached.
                                                              <
    - v12.17.0                                                <
    pr-url: https://github.com/nodejs/node/pull/29866         <
    description: Unflag conditional exports.                  <
  - version:                                                  <
    - v13.7.0                                                 <
    description: Remove the `--experimental-conditional-expor |     description: Remove the `--experimental-conditional-expor
* Type: {Object} | {string} | {string\[]}                     | * Type: {Object} | {string} | {string[]}
                                                              <
Package imports permit mapping to external packages.          | Import maps permit mapping to external packages.
[Conditional exports]: #conditional-exports                   | [Conditional exports]: #packages_conditional_exports
[`"exports"`]: #exports                                       | [`"exports"`]: #packages_exports
[`"imports"`]: #imports                                       | [`"imports"`]: #packages_imports
[`"main"`]: #main                                             | [`"main"`]: #packages_main
[`"name"`]: #name                                             | [`"name"`]: #packages_name
[`"packageManager"`]: #packagemanager                         | [`"packageManager"`]: #packages_packagemanager
[`"type"`]: #type                                             | [`"type"`]: #packages_type
[`--conditions` / `-C` flag]: #resolving-user-conditions      | [`--no-addons` flag]: cli.md#cli_no_addons
[`--no-addons` flag]: cli.md#--no-addons                      | [`ERR_PACKAGE_PATH_NOT_EXPORTED`]: errors.md#errors_err_packa
[`ERR_PACKAGE_PATH_NOT_EXPORTED`]: errors.md#err_package_path <
[`package.json`]: #nodejs-packagejson-field-definitions       | [`package.json`]: #packages_node_js_package_json_field_defini
[entry points]: #package-entry-points                         | [entry points]: #packages_package_entry_points
[folders as modules]: modules.md#folders-as-modules           | [self-reference]: #packages_self_referencing_a_package_using_
[import maps]: https://github.com/WICG/import-maps            | [subpath exports]: #packages_subpath_exports
[load ECMASCript modules from CommonJS modules]: modules.md#t | [subpath imports]: #packages_subpath_imports
[loader hooks]: esm.md#loaders                                | [supported package managers]: corepack.md#corepack_supported_
[packages folder mapping]: https://github.com/WICG/import-map | [the dual CommonJS/ES module packages section]: #packages_dua
[self-reference]: #self-referencing-a-package-using-its-name  | [the full specifier path]: esm.md#esm_mandatory_file_extensio
[subpath exports]: #subpath-exports                           <
[subpath imports]: #subpath-imports                           <
[subpath patterns]: #subpath-patterns                         <
[supported package managers]: corepack.md#supported-package-m <
[the dual CommonJS/ES module packages section]: #dual-commonj <
[the full specifier path]: esm.md#mandatory-file-extensions   <
````

</details>

## v14.21.3 vs v12.22.12

### Summary

- [Determining package manager](https://nodejs.org/dist/latest-v14.x/docs/api/packages.html#packages_determining_package_manager) が追加された
- [Subpath exports](https://nodejs.org/dist/latest-v14.x/docs/api/packages.html#packages_subpath_exports)
  - `Stability: 1 - Experimental` が外れた
- [Subpath imports](https://nodejs.org/dist/latest-v14.x/docs/api/packages.html#packages_subpath_imports)
  - `Stability: 1 - Experimental` が外れた
- [Subpath patterns](https://nodejs.org/dist/latest-v14.x/docs/api/packages.html#packages_subpath_imports)
  - `Stability: 1 - Experimental` が外れた
  - matching pattern から除外するために `null` が使えるようになった
- Exports sugar
  - `Stability: 1 - Experimental` が外れた
- Conditional exports
  - `Stability: 1 - Experimental` が外れた
  - `"node-addons"` が追加された
- Nested conditions
  - `Stability: 1 - Experimental` が外れた
- [Conditions Definitions](https://nodejs.org/dist/latest-v14.x/docs/api/packages.html#packages_conditions_definitions) が追加された
- [Self-referencing a package using its name](https://nodejs.org/dist/latest-v14.x/docs/api/packages.html#packages_self_referencing_a_package_using_its_name)
  - scoped packages の例が追加された (機能追加ではない？)

### Diff

```bash
$ sdiff -s <(git cat-file -p v14.21.3:doc/api/packages.md) <(git cat-file -p v12.22.12:doc/api/packages.md)
```

<details>
<summary>出力</summary>

````bash
  - version:                                                  |   - version: v12.20.0
    - v14.13.0                                                <
  - version:                                                  |   - version: v12.19.0
    - v14.6.0                                                 <
    - v12.19.0                                                <
    - v13.7.0                                                 <
    - v13.6.0                                                 <
<!-- YAML                                                     <
added: v12.0.0                                                <
-->                                                           <
## Determining package manager                                <
                                                              <
> Stability: 1 - Experimental                                 <
                                                              <
While all Node.js projects are expected to be installable by  <
managers once published, their development teams are often re <
specific package manager. To make this process easier, Node.j <
tool called [Corepack][] that aims to make all package manage <
available in your environment - provided you have Node.js ins <
                                                              <
By default Corepack won't enforce any specific package manage <
the generic "Last Known Good" versions associated with each N <
but you can improve this experience by setting the [`"package <
in your project's `package.json`.                             <
                                                              <
<!-- YAML                                                     <
added: v12.7.0                                                <
-->                                                           <
                                                              > > Stability: 1 - Experimental
                                                              >
<!-- YAML                                                     <
added:                                                        <
  - v14.6.0                                                   <
  - v12.19.0                                                  <
-->                                                           <
                                                              > > Stability: 1 - Experimental
                                                              >
<!-- YAML                                                     <
added:                                                        <
  - v14.13.0                                                  <
  - v12.20.0                                                  <
-->                                                           <
                                                              > > Stability: 1 - Experimental
                                                              >
**`*` maps expose nested subpaths as it is a string replaceme | The left hand matching pattern must always end in `*`. All in
only.**                                                       | the right hand side will then be replaced with this value, in
                                                              > contains any `/` separators.
All instances of `*` on the right hand side will then be repl <
value, including if it contains any `/` separators.           <
                                                              <
To exclude private subfolders from patterns, `null` targets c <
                                                              <
```json                                                       <
// ./node_modules/es-module-package/package.json              <
{                                                             <
  "exports": {                                                <
    "./features/*": "./src/features/*.js",                    <
    "./features/private-internal/*": null                     <
  }                                                           <
}                                                             <
```                                                           <
                                                              <
```js                                                         <
import featureInternal from 'es-module-package/features/priva <
// Throws: ERR_PACKAGE_PATH_NOT_EXPORTED                      <
                                                              <
import featureX from 'es-module-package/features/x';          <
// Loads ./node_modules/es-module-package/src/features/x.js   <
```                                                           <
                                                              <
<!-- YAML                                                     <
added: v12.11.0                                               <
-->                                                           <
                                                              > > Stability: 1 - Experimental
                                                              >
<!-- YAML                                                     <
added:                                                        <
  - v13.2.0                                                   <
  - v12.16.0                                                  <
changes:                                                      <
  - version:                                                  <
    - v13.7.0                                                 <
    - v12.16.0                                                <
    pr-url: https://github.com/nodejs/node/pull/31001         <
    description: Unflag conditional exports.                  <
-->                                                           <
                                                              > > Stability: 1 - Experimental
                                                              >
Node.js implements the following conditions:                  | Node.js supports the following conditions out of the box:
* `"node-addons"` - similar to `"node"` and matches for any N <
   This condition can be used to provide an entry point which <
   addons as opposed to an entry point which is more universa <
   on native addons. This condition can be disabled via the   <
   [`--no-addons` flag][].                                    <
                                                              > Other conditions such as `"browser"`, `"electron"`, `"deno"`,
                                                              > etc., are unknown to Node.js, and thus ignored. Runtimes or t
                                                              > Node.js can use them at their discretion. Further restriction
                                                              > guidance on condition names might occur in the future.
                                                              >
                                                              > > Stability: 1 - Experimental
                                                              >
<!-- YAML                                                     <
added:                                                        <
  - v14.9.0                                                   <
  - v12.19.0                                                  <
-->                                                           <
exports, while resolving the existing `"node"`, `"node-addons | exports, while resolving the existing `"node"`, `"default"`,
`"import"`, and `"require"` conditions as appropriate.        | `"require"` conditions as appropriate.
### Conditions Definitions                                    <
                                                              <
The `"import"`, `"require"`, `"node"`, `"node-addons"` and `" <
conditions are defined and implemented in Node.js core,       <
[as specified above](#packages_conditional_exports).          <
                                                              <
The `"node-addons"` condition can be used to provide an entry <
uses native C++ addons. However, this condition can be disabl <
[`--no-addons` flag][]. When using `"node-addons"`, it's reco <
`"default"` as an enhancement that provides a more universal  <
using WebAssembly instead of a native addon.                  <
                                                              <
Other condition strings are unknown to Node.js and thus ignor <
Runtimes or tools other than Node.js can use them at their di <
                                                              <
These user conditions can be enabled in Node.js via the [`--c <
flag](#packages_resolving_user_conditions).                   <
                                                              <
The following condition definitions are currently endorsed by <
                                                              <
* `"browser"` - any environment which implements a standard s <
   browser APIs available from JavaScript in web browsers, in <
   APIs.                                                      <
* `"development"` - can be used to define a development-only  <
   entry point. _Must always be mutually exclusive with `"pro <
* `"production"` - can be used to define a production environ <
   point. _Must always be mutually exclusive with `"developme <
                                                              <
The above user conditions can be enabled in Node.js via the [ <
flag](#packages_resolving_user_conditions).                   <
                                                              <
Platform specific conditions such as `"deno"`, `"electron"`,  <
may be used, but while there remain no implementation or inte <
from these platforms, the above are not explicitly endorsed b <
                                                              <
New conditions definitions may be added to this list by creat <
to the [Node.js documentation for this section][]. The requir <
a new condition definition here are that:                     <
                                                              <
* The definition should be clear and unambiguous for all impl <
* The use case for why the condition is needed should be clea <
* There should exist sufficient existing implementation usage <
* The condition name should not conflict with another conditi <
  condition in wide usage.                                    <
* The listing of the condition definition should provide a co <
  benefit to the ecosystem that wouldn't otherwise be possibl <
  this would not necessarily be the case for company-specific <
  application-specific conditions.                            <
                                                              <
The above definitions may be moved to a dedicated conditions  <
course.                                                       <
                                                              <
<!-- YAML                                                     <
added:                                                        <
  - v13.1.0                                                   <
  - v12.16.0                                                  <
changes:                                                      <
  - version:                                                  <
    - v13.6.0                                                 <
    - v12.16.0                                                <
    pr-url: https://github.com/nodejs/node/pull/31002         <
    description: Unflag self-referencing a package using its  <
-->                                                           <
```cjs                                                        | ```js
Finally, self-referencing also works with scoped packages. Fo <
code will also work:                                          <
                                                              <
```json                                                       <
// package.json                                               <
{                                                             <
  "name": "@my/package",                                      <
  "exports": "./index.js"                                     <
}                                                             <
```                                                           <
                                                              <
```cjs                                                        <
// ./index.js                                                 <
module.exports = 42;                                          <
```                                                           <
                                                              <
```cjs                                                        <
// ./other.js                                                 <
console.log(require('@my/package'));                          <
```                                                           <
                                                              <
```console                                                    <
$ node other.js                                               <
42                                                            <
```                                                           <
                                                              <
See [Enabling](esm.md#esm_enabling).                          | See [Enabling](#esm_enabling).
```cjs                                                        | ```js
    ```cjs                                                    |     ```js
* [`"main"`][] - The default module when loading the package, <
  specified, and in versions of Node.js prior to the introduc <
* [`"packageManager"`][] - The package manager recommended wh <
  the package. Leveraged by the [Corepack][] shims.           <
                                                              > * [`"main"`][] - The default module when loading the package,
                                                              >   specified, and in versions of Node.js prior to the introduc
  - v13.1.0                                                   <
    - v13.6.0                                                 <
### `"main"`                                                  <
<!-- YAML                                                     <
added: v0.4.0                                                 <
-->                                                           <
                                                              <
* Type: {string}                                              <
                                                              <
```json                                                       <
{                                                             <
  "main": "./main.js"                                         <
}                                                             <
```                                                           <
                                                              <
The `"main"` field defines the script that is used when the [ <
is loaded via `require()`](modules.md#modules_folders_as_modu <
is a path.                                                    <
                                                              <
```cjs                                                        <
require('./path/to/directory'); // This resolves to ./path/to <
```                                                           <
                                                              <
When a package has an [`"exports"`][] field, this will take p <
`"main"` field when importing the package by name.            <
                                                              <
### `"packageManager"`                                        <
<!-- YAML                                                     <
added: v14.19.0                                               <
-->                                                           <
                                                              <
> Stability: 1 - Experimental                                 <
                                                              <
* Type: {string}                                              <
                                                              <
```json                                                       <
{                                                             <
  "packageManager": "<package manager name>@<version>"        <
}                                                             <
```                                                           <
                                                              <
The `"packageManager"` field defines which package manager is <
used when working on the current project. It can set to any o <
[supported package managers][], and will ensure that your tea <
same package manager versions without having to install anyth <
Node.js.                                                      <
                                                              <
This field is currently experimental and needs to be opted-in <
[Corepack][] page for details about the procedure.            <
                                                              <
    - v13.2.0                                                 <
    - v14.13.0                                                <
    - v12.20.0                                                <
    pr-url: https://github.com/nodejs/node/pull/34718         <
    description: Add support for `"exports"` patterns.        <
  - version:                                                  <
    - v13.7.0                                                 <
    pr-url: https://github.com/nodejs/node/pull/31008         |     pr-url: https://github.com/nodejs/node/pull/29978
    description: Implement logical conditional exports orderi |     description: Implement conditional exports.
    - v13.7.0                                                 <
    - v13.2.0                                                 <
    pr-url: https://github.com/nodejs/node/pull/29978         |     pr-url: https://github.com/nodejs/node/pull/31008
    description: Implement conditional exports.               |     description: Implement logical conditional exports orderi
                                                              >   - version:
                                                              >     - v12.20.0
                                                              >     pr-url: https://github.com/nodejs/node/pull/34718
                                                              >     description: Add support for `"exports"` patterns.
                                                              > ### `"main"`
                                                              > <!-- YAML
                                                              > added: v0.4.0
                                                              > -->
                                                              >
                                                              > * Type: {string}
                                                              >
                                                              > ```json
                                                              > {
                                                              >   "main": "./main.js"
                                                              > }
                                                              > ```
                                                              >
                                                              > The `"main"` field defines the script that is used when the [
                                                              > is loaded via `require()`](modules.html#modules_folders_as_mo
                                                              > is interpreted as a path.
                                                              >
                                                              > ```js
                                                              > require('./path/to/directory'); // This resolves to ./path/to
                                                              > ```
                                                              >
                                                              > When a package has an [`"exports"`][] field, this will take p
                                                              > `"main"` field when importing the package by name.
                                                              >
added:                                                        | added: v12.19.0
 - v14.6.0                                                    <
 - v12.19.0                                                   <
                                                              > > Stability: 1 - Experimental
                                                              >
[CommonJS]: modules.md                                        <
[Corepack]: corepack.md                                       | [CommonJS]: modules.html
[ES module]: esm.md                                           | [`ERR_PACKAGE_PATH_NOT_EXPORTED`]: errors.html#errors_err_pac
[ES modules]: esm.md                                          | [ES modules]: esm.html
[Node.js documentation for this section]: https://github.com/ | [ES module]: esm.html
                                                              > [`esm`]: https://github.com/standard-things/esm#readme
[`"imports"`]: #packages_imports                              <
[`"packageManager"`]: #packages_packagemanager                | [`"imports"`]: #packages_imports
[`--no-addons` flag]: cli.md#cli_no_addons                    <
[`ERR_PACKAGE_PATH_NOT_EXPORTED`]: errors.md#errors_err_packa <
[`esm`]: https://github.com/standard-things/esm#readme        <
[`package.json`]: #packages_node_js_package_json_field_defini <
                                                              > [`package.json`]: #packages_node_js_package_json_field_defini
[supported package managers]: corepack.md#corepack_supported_ <
[the dual CommonJS/ES module packages section]: #packages_dua <
                                                              > [the dual CommonJS/ES module packages section]: #packages_dua
````

</details>

## 感想

- v14.x でほぼ出来上がってて
- v16.x で (ドキュメントの範囲を?)少し洗練させて
- v18.x は minor update

って感じだった。そんな [v14.x は先日 EOL を迎えた](https://github.com/nodejs/Release) ので、もう細かいこと[^1]は気にせずに、ESM を使って良いんじゃないかな！

[^1]: 「あれ、この機能は今の Node.js のバージョンでも使えるんだっけ? 🤔」みたいなやつ
