---
title: メモ Firebase Storage のトークンは有効期限切れにならない
date: 2021-12-10
---

Firebase Storage にアップロードしたファイルをダウンロードするためのトークン(👇) は、[Stack Overflow](https://stackoverflow.com/questions/42593002/firebase-storage-getdownloadurls-token-validity/42598354#42598354) によると期限切れにならない。

```
https://firebasestorage.googleapis.com/v0/b/:bucketName/o/folder%2Ffile-name.jpg?alt=media&token=【これ】
```

> Firebase Storage tokens do not expire.
>
> They may be revoked from the Firebase Console, which would invalidate URLs based on them.

本当？

回答者が Firebase の人だから本当のことなんだろうけれど、公式ドキュメントしっかりして欲しいな...。
(https://stackoverflow.com/users/209103/frank-van-puffelen)
