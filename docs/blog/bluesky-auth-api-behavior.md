---
title: "Bluesky (AT Protocol) の認証関連 API のふるまい詳細メモ"
date: 2025-02-12
---

[Bluesky の SDK](https://docs.bsky.app/docs/get-started) を使ったウェブアプリ ([tweet-to-sky](https://github.com/TatsuyaYamamoto/app.t28.dev/tree/main/apps/tweet-to-sky)) の開発に際して、
Bluesky (正確には AT Protocol) の認証関連の API の詳細を調べることあったので、メモを残しておく。**だって API Doc がないんだもん 🥺**

`認証関連の API` は正確には:

> the atproto PDS server and account management APIs
>
> ref: [com.atproto.server.createAccount](https://docs.bsky.app/docs/api/com-atproto-server-create-account)

## セッションを作成する・ログインする

### SDK

SDK ではこんな感じにセッションを作成（ログイン）する。
戻り値のオブジェクトは `resumeSession` (後述) で使うための [`AtpSessionData`](https://github.com/bluesky-social/atproto/blob/%40atproto%2Fapi%400.13.35/packages/api/src/types.ts#L23) 型とは[ちょっと違う](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/api/src/client/types/com/atproto/server/createSession.ts#L22)のがややこしい...。

```ts
const agent = new AtpAgent({ service: "https://bsky.social" });
const sessionDataLike = agent.login({
  identifier: "***",
  password: "***",
});
```

SDK 内部 ([atp-agent.ts#L308](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/api/src/atp-agent.ts#L308)) では:

1. API ([com.atproto.server.createSession](https://docs.bsky.app/docs/api/com-atproto-server-create-session)) を呼び出して
2. agent の状態としてセッションを保存して
3. agent の使用者側へ[通知](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/api/src/atp-agent.ts#L326)する

### HTTP API

curl で [com.atproto.server.createSession](https://docs.bsky.app/docs/api/com-atproto-server-create-session) を実行する。

```bash
ID=***
PASS=***
curl --silent -X POST -H "Content-Type: application/json" https://bsky.social/xrpc/com.atproto.server.createSession -d "{\"identifier\":\"$ID\",\"password\":\"$PASS\"}" | jq
{
  "did": "***",
  "didDoc": { ... },
  "handle": "***",
  "email": "***",
  "emailConfirmed": true,
  "emailAuthFactor": false,
  "accessJwt": "***",
  "refreshJwt":  "***",
  "active": true
}
```

Bluesky における「セッション作成」の実態は「アクセストークンとリフレッシュトークンを取得する」ということ。

## セッション情報を取得する・セッションを再開する

セッションを**再開する** という表現は少し変かもしれない。
ログインで取得したトークンに停止というものはなく、再度 Web API を呼ぶときは保存したトークンを使えばいいから。

### SDK

SDK の場合、agent クラス (のインスタンス) をログイン状態にすることが「セッションを再開する」ことになる。

```ts
agent.resumeSession(savedSessionData);
```

内部([atp-agent.ts#L355](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/api/src/atp-agent.ts#L355))では:

1. アクセストークンを使ってセッション情報を取得する
2. トークンのエラーが出たら (ここの詳細は後述)
   1. リフレッシュトークンを使ってトークンを更新する
   2. セッション情報を取得する

### HTTP API

`セッション情報を取得する` は curl で [com.atproto.server.getSession](https://docs.bsky.app/docs/api/com-atproto-server-get-session) を実行する。

```bash
ACCESS=***
curl --silent -H "Authorization: Bearer $ACCESS" https://bsky.social/xrpc/com.atproto.server.getSession | jq
{
  "handle": "***",
  "did": "***",
  "didDoc": { ... },
  "email": "***",
  "emailConfirmed": true,
  "emailAuthFactor": false,
  "active": true
}
```

## セッションを削除する・ログアウトする

トークンを用いているのでサーバー側もステートレスかと思いきや、削除することができる。

### SDK

```ts
agent.logout();
```

内部 ([atp-agent.ts#L335](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/api/src/atp-agent.ts#L335))では:

1. API ([com.atproto.server.deleteSession](https://docs.bsky.app/docs/api/com-atproto-server-delete-session)) を呼び出して
2. agent の状態を更新して
3. agent の使用者側へ通知する

### HTTP API

curl で [com.atproto.server.deleteSession](https://docs.bsky.app/docs/api/com-atproto-server-delete-session) を実行する。
削除出来るのはアクセストークン**ではなく** [^1]、リフレッシュトークンのみ。

```bash
☠️ access token を削除する機能ではない
ACCESS=***
curl --silent -X POST -H "Authorization: Bearer $ACCESS" https://bsky.social/xrpc/com.atproto.server.deleteSession
{"error":"InvalidToken","message":"Invalid token type"}

🥳 refresh token を削除する機能
REFRESH=***
curl --silent -X POST -H "Authorization: Bearer $REFRESH" https://bsky.social/xrpc/com.atproto.server.deleteSession
```

## (内部的に) トークンをリフレッシュする

### SDK

トークンのリフレッシュは然るべきタイミングで agent が自動的に実行するため、[AtpAgent class](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/api/src/atp-agent.ts#L52) の public API としては公開されていない[^2]。

然るべきタイミング:

- `resumeSession` 時にトークンが古かったらリフレッシュする ([atp-agent.ts#L372](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/api/src/atp-agent.ts#L372))
- API 呼び出したときに `ExpiredToken` エラーが返ってきたらリフレッシュする [atp-agent.ts#L207](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/api/src/atp-agent.ts#L207))

### HTTP API

curl で [com.atproto.server.refreshSession](https://docs.bsky.app/docs/api/com-atproto-server-refresh-session) を実行する。

```bash
REFRESH_TOKEN=***
curl --silent -X POST -H "Authorization: Bearer $REFRESH_TOKEN" https://bsky.social/xrpc/com.atproto.server.refreshSession | jq
{
  "did": "***",
  "didDoc": { ... },
  "handle": "***",
  "accessJwt": "***",
  "refreshJwt": "***",
  "active": true
}
```

deleteSession したあとは、refreshSession できない。

```bash
curl --silent -X POST -H "Authorization: Bearer $REFRESH" https://bsky.social/xrpc/com.atproto.server.deleteSession
curl --silent -X POST -H "Authorization: Bearer $REFRESH" https://bsky.social/xrpc/com.atproto.server.refreshSession | jq
{
  "error": "ExpiredToken",
  "message": "Token has been revoked"
}
```

リフレッシュトークンの有効期間は 3ヶ月 [^3] だが、1度使うと、有効期間がそこから2時間に短くなる。

```bash
$ curl --silent -X POST -H "Content-Type: application/json" https://bsky.social/xrpc/com.atproto.server.createSession -d "{\"identifier\":\"$ID\",\"password\":\"$PASS\"}" | jq "{accessJwt, refreshJwt}"
{
  "accessJwt": "***",
  "refreshJwt": "***"
}

👇️ リフレッシュトークン取得直後に使用する
$ date +%R && curl --silent -X POST -H "Authorization: Bearer $REFRESH" https://bsky.social/xrpc/com.atproto.server.refreshSession
10:32
{"did":"did:plc:...","didDoc":{"@context":["https://www.w3.org/ns/did/v1",

$ date +%R && curl --silent -X POST -H "Authorization: Bearer $REFRESH" https://bsky.social/xrpc/com.atproto.server.refreshSession
10:33
{"did":"did:plc:...","didDoc":{"@context":["https://www.w3.org/ns/did/v1",

$ date +%R && curl --silent -X POST -H "Authorization: Bearer $REFRESH" https://bsky.social/xrpc/com.atproto.server.refreshSession
12:31
{"did":"did:plc:...","didDoc":{"@context":["https://www.w3.org/ns/did/v1",

👇️ 2時間後に expire した！
$ date +%R && curl --silent -X POST -H "Authorization: Bearer $REFRESH" https://bsky.social/xrpc/com.atproto.server.refreshSession
12:32
{"error":"ExpiredToken","message":"Token has been revoked"}
```

## （Personal Data Server が）リフレッシュトークンを管理する

前述の通り、Bluesky はトークンを使いつつもステートフルな認証を行っている:

- Personal Data Server で `deleteSession` ができる
- Personal Data Server で `refreshSession` すると、リフレッシュトークンの有効期間が短くなる (JWT の内容より優先される時間がサーバー側にある)

### リフレッシュトークンを削除する

Personal Data Server は `deleteSession` を呼び出されると ([deleteSession.ts#L18](https://github.com/bluesky-social/atproto/blob/%40atproto%2Fapi%400.13.35/packages/pds/src/api/com/atproto/server/deleteSession.ts#L18))、
DB からリフレッシュトークンを削除する ([auth.ts#L178](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/pds/src/account-manager/helpers/auth.ts#L178))。

### リフレッシュトークンをローテートする

Personal Data Server は `refreshToken` を呼び出されると、リフレッシュトークンをローテートする([refreshSession.ts#L42](https://github.com/bluesky-social/atproto/blob/%40atproto%2Fapi%400.13.35/packages/pds/src/api/com/atproto/server/refreshSession.ts#L42))。

ローテーション:

1. DB からリフレッシュトークンを取得する ([index.ts#L236](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/pds/src/account-manager/index.ts#L236))
2. 新しい有効期限日 (2時間) を計算する ([index.ts#L245-L252](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/pds/src/account-manager/index.ts#L245-L252))
3. 新しいアクセストークン・リフレッシュトークンを作成する ([index.ts#L262-L268](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/pds/src/account-manager/index.ts#L262-L268))
4. DB 更新
   - 既存のリフレッシュトークンの有効期限日を更新する([index.ts#L274-L278](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/pds/src/account-manager/index.ts#L274-L278))
   - 新しいリフレッシュトークンを保存する ([index.ts#L279](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/pds/src/account-manager/index.ts#L279))

[^1]: curl したりコードを読んでいたら Bluesky のコードが違うことに気づいて、[PR を出せた！](https://github.com/bluesky-social/atproto/pull/3530) 😳

[^2]: agent の使用者が呼び出せないわけではない ([atp-agent.ts#L433](https://github.com/bluesky-social/atproto/blob/%40atproto/api%400.13.35/packages/api/src/atp-agent.ts#L433))

[^3]: リフレッシュトークンは JWT なので、デコードすれば分かる。
