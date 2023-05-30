---
title: "React Hooks の deps がどのように評価されているか、React Hooks の実装を読んで知る"
date: 2021-11-21
---

- ["React Hooks の deps にオブジェクトを渡す"](./use-object-as-react-hooks-deps) の副産物
- React Hooks の deps がどのように評価されているか、実装を~~適当に端折って~~追う。

---

## React Hooks の deps ってどうやって評価されてるの？

- [React - Introducing Hooks](https://ja.reactjs.org/docs/hooks-intro.html) (おさらい)
  - [React Hooks](https://ja.reactjs.org/docs/hooks-overview.html) によって、関数コンポーネント内で状態や副作用が表現できる。
  - [Effect Hook](https://ja.reactjs.org/docs/hooks-overview.html#effect-hook) (例えば `useEffect`) では、関数コンポーネントで副作用が発生する処理が実装出来る。
  - [deps(第 2 引数)](https://ja.reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect) で 副作用が依存している値を指定することで、副作用処理の実行を制御出来る。

...わけですが、副作用が依存している deps が更新されたかどうかをどのように評価しているか知りたくなりました。

## ReactFiberHooks

[React](https://github.com/facebook/react/blob/v17.0.2/packages/react/package.json#L22) が [export](https://github.com/facebook/react/blob/v17.0.2/packages/react/index.js#L50) している [useEffect](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/React.js#L39) は [ReactHooks.js](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactHooks.js#L101) で定義されています。

```flow js
export function useEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null
): void {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}
```

[resolveDispatcher](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactHooks.js#L25) から [**現在の**](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactHooks.js#L26) dispatcher ([ReactCurrentDispatcher](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactCurrentDispatcher.js)) を取得して、実際の useEffect の処理を実行しているようです。
"current" が付く Dispatcher なので、Dispatcher は色々状態を持つようですね。

~~横着して grep した結果、~~ `ReactCurrentDispatcher.current` に [Dispatcher](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactInternalTypes.js#L260) オブジェクトを代入しているのは [ReactFiberHooks](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js) っぽい。

ReactFiberHooks には 各 Dispatcher の実装もありました。

- 基本的なものが 4 種類
  - [ContextOnlyDispatcher](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1796)
  - [HooksDispatcherOnMount](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1817)
  - [HooksDispatcherOnUpdate](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1838)
  - [HooksDispatcherOnRerender](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1859)
- 開発環境のみ([Production ビルド](https://github.com/facebook/react/blob/v17.0.2/scripts/rollup/build.js#L399) のときは[null](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1880-L1886)) 、使えるものが 7 種類
  - HooksDispatcherOnRerenderInDEV
  - HooksDispatcherOnMountInDEV
  - HooksDispatcherOnMountWithHookTypesInDEV
  - HooksDispatcherOnUpdateInDEV
  - InvalidNestedHooksDispatcherOnRerenderInDEV
  - InvalidNestedHooksDispatcherOnMountInDEV
  - InvalidNestedHooksDispatcherOnUpdateInDEV

Dispatcher の名前から、React の描画のライフサイクルに従って、dispatcher の実装が切り替わることが分かります。

`useEffect` に話を戻して、各 Dispatcher が実装している `useEffect` の実装を確認します。

### HooksDispatcherOnMount

```flow js
const HooksDispatcherOnMount: Dispatcher = {
  // ...
  useEffect: mountEffect,
  // ...
};
```

#### mountEffect

Development ビルド用の [あれ](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1249) [これ](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1256) をした後、`mountEffectImpl` に処理を渡しています。

#### mountEffectImpl

- [nextDeps](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1208) を作って
- [React Hooks 用の メモ化された状態オブジェクト](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1210) に Effect オブジェクトを追加している。

mount は deps が変化する前の状態なので、deps の比較もしていませんね。これは React の使用者としての API の理解と一致してる。

### HooksDispatcherOnUpdate, HooksDispatcherOnRerender

```flow js
const HooksDispatcherOnUpdate: Dispatcher = {
  // ...
  useEffect: updateEffect,
  // ...
};
```

#### updateEffect

- `mountEffect` と同様、Development ビルド用の [あれこれ](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1277) をして、`updateEffectImpl` に処理を渡しています。

#### updateEffectImpl

- [nextDeps と prevDeps を比較して](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1228)
  - 同じなら、[return](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1230)
  - 異なるなら、`mountEffectImpl` と同様に [メモ化された状態オブジェクト に Effect オブジェクトを追加](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1237)

比較に使用している [areHookInputsEqual](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1228) が 副作用関数を実行する/実行しないを決定するロジックのようですね。

### ContextOnlyDispatcher

```flow js
const ContextOnlyDispatcher: Dispatcher = {
  // ...
  useEffect: throwInvalidHookError,
  // ...
};
```

#### throwInvalidHookError

[不正な React Hooks の呼び出しをお知らせする](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L287-L297) だけ。

## Object.is

[updateEffectImpl](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L1218) が実行している [areHookInputsEqual](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L299) は、Development ビルド用の [あれ](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L303) [これ](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L311) [それ](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L322) をした後に、
2 つの deps の [配列要素毎](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.new.js#L338) に [is()](https://github.com/facebook/react/blob/v17.0.2/packages/shared/objectIs.js) で値の比較をして、1 つでも異なるものがあれば deps がが更新されていると判断されるようです。

React が実装している `is()` は [`Object.is` の polyfill](https://github.com/facebook/react/blob/v17.0.2/packages/shared/objectIs.js#L11) のようなので、[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) を見ます。

> Object.is() は 2 つの値が同一値であるかどうかを判定します。2 つの値が以下の規則の一つに当てはまる場合に同一となります。
>
> - どちらも undefined
> - どちらも null
> - どちらも true かどちらも false
> - どちらも同じ文字からなる同じ長さの文字列
> - どちらも同じオブジェクト
> - どちらも数で、どちらも +0、どちらも -0、どちらも NaN、あるいはどちらもゼロ以外で NaN でなく、同じ数値を持つ

余談: `Object.is`, `===` は(もちろん `==` も) 比較結果が違う([等価性の比較と同一性](https://developer.mozilla.org/ja/docs/Web/JavaScript/Equality_comparisons_and_sameness)) 。

## 結論

deps の各要素は [Object.is](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/is) で [同一値](https://developer.mozilla.org/ja/docs/Web/JavaScript/Equality_comparisons_and_sameness#same-value_equality) かどうかをチェックされる。
