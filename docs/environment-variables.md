# 環境変数ガイド

## 環境の種類

このアプリには3つの環境があります。

| 環境 | 説明 | 設定場所 |
|---|---|---|
| **ローカル開発** | 手元のPCで `npm run dev` するとき | `.env.local` ファイル |
| **Vercel Preview** | PRを作るたびに自動で立ち上がるプレビュー環境 | Vercel ダッシュボード |
| **Vercel Production** | 本番環境（mainブランチへのマージで自動デプロイ） | Vercel ダッシュボード |

## .env.local とは

Next.js が自動で読み込む、**ローカル開発専用**の環境変数ファイルです。

- `.gitignore` に含まれているので、**Git にはコミットされません**（秘密鍵を誤ってpushしてしまうのを防ぐため）
- `.env.local.example` がテンプレートなので、それをコピーして使います

```bash
cp .env.local.example .env.local
# .env.local を編集して実際の値を入れる
```

## 必要な環境変数

### DATABASE_URL
- **用途**: PostgreSQL データベースへの接続
- **取得先**: [neon.tech](https://neon.tech) でプロジェクトを作成すると表示される接続文字列
- **形式**: `postgresql://user:password@host/dbname`
- **必要な環境**: ローカル・Preview・Production すべて（それぞれ別のDBを推奨）

### STRIPE_SECRET_KEY
- **用途**: サーバーサイドでの決済処理（API Route から使用）
- **取得先**: [Stripe ダッシュボード](https://dashboard.stripe.com/apikeys)
- **形式**: `sk_test_...`（開発用）、`sk_live_...`（本番用）
- **必要な環境**: ローカル・Preview・Production すべて

### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- **用途**: ブラウザ上での Stripe 決済フォーム表示
- **取得先**: [Stripe ダッシュボード](https://dashboard.stripe.com/apikeys)
- **形式**: `pk_test_...`（開発用）、`pk_live_...`（本番用）
- **必要な環境**: ローカル・Preview・Production すべて
- **注意**: `NEXT_PUBLIC_` プレフィックスがついているものはブラウザに公開されます。公開鍵なので問題ありません。

## ローカル開発のセットアップ手順

1. `.env.local.example` をコピー
   ```bash
   cp .env.local.example .env.local
   ```
2. `.env.local` に実際の値を入れる（Stripe はテスト用キーを使う）
3. `npm run dev` で起動

## Vercel へのデプロイ手順

Vercel の環境変数は **コードではなくダッシュボードで管理します**。

1. [vercel.com](https://vercel.com) でプロジェクトを開く
2. Settings → Environment Variables を開く
3. 上記3つの変数を入力する
   - Preview 環境と Production 環境で Stripe のキーを分けることを推奨
     - Preview: `sk_test_...` / `pk_test_...`
     - Production: `sk_live_...` / `pk_live_...`

## 初回デプロイ後に必要な追加作業

Vercel にデプロイしただけではDBのテーブルがまだ存在しません。
以下のコマンドをローカルから本番DBに向けて一度実行する必要があります。

```bash
DATABASE_URL="本番のDATABASE_URL" npx prisma migrate deploy
```
