# Cloudflare Pages デプロイメントガイド

## 概要
このガイドでは、Lemansフロントエンドアプリケーションを Cloudflare Pages にデプロイする方法を説明します。

## 前提条件
- Cloudflare アカウント
- GitHub リポジトリ
- Node.js 18 以上

## デプロイ手順

### 1. Cloudflare Pages プロジェクトの作成

1. Cloudflare ダッシュボードにログイン
2. 左サイドバーから「Pages」を選択
3. 「Create a project」をクリック
4. 「Connect to Git」を選択
5. GitHub リポジトリを選択（`lemans`）
6. 以下の設定を入力：
   - **Project name**: `lemans-frontend`
   - **Production branch**: `main`
   - **Build command**: `npm run build:cloudflare`
   - **Build output directory**: `out`
   - **Root directory**: `/lemans/front`

### 2. 環境変数の設定

Cloudflare Pages ダッシュボードで以下の環境変数を設定：

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
NODE_VERSION=18
```

### 3. カスタムドメインの設定（オプション）

1. Pages プロジェクトの「Custom domains」タブ
2. 「Set up a custom domain」をクリック
3. ドメインを入力し、DNS レコードを設定

## 設定ファイルの説明

### `next.config.mjs`
- `output: 'export'`: 静的サイト生成を有効化
- `trailingSlash: true`: URL の末尾にスラッシュを追加
- `distDir: 'out'`: ビルド出力ディレクトリを指定
- `images.unoptimized: true`: 画像最適化を無効化（静的エクスポート用）

### `wrangler.toml`
- Cloudflare Pages の設定ファイル
- ビルドコマンドと出力ディレクトリを指定

### `_headers`
- セキュリティヘッダーを設定
- X-Frame-Options, X-Content-Type-Options など

### `_redirects`
- SPA（Single Page Application）用のリダイレクト設定
- 全てのルートを index.html にリダイレクト

## 注意事項

1. **Server-Side Rendering (SSR) の制限**
   - Cloudflare Pages は静的サイトホスティングのため、SSR は使用できません
   - API Routes は Edge Functions として動作します

2. **Server Actions の制限**
   - 静的エクスポート時はServer Actionsが使用できません
   - クライアントサイドでの認証処理に変更済み

3. **データベースマイグレーション**
   - ビルド時の `drizzle-kit migrate` は本番環境では実行されません
   - 手動でマイグレーションを実行する必要があります

4. **環境変数**
   - `NEXT_PUBLIC_` で始まる環境変数のみがクライアント側で使用可能です
   - 機密情報は適切に管理してください

5. **認証とミドルウェア**
   - 静的エクスポート時はミドルウェアが動作しません
   - `AuthGuard` コンポーネントでクライアントサイド認証を実装済み

## トラブルシューティング

### ビルドエラー
- Node.js バージョンを 18 に設定
- 依存関係の問題を確認

### 環境変数の問題
- Cloudflare Pages ダッシュボードで環境変数を再確認
- 環境変数名のスペルミスを確認

### ルーティングの問題
- `_redirects` ファイルの設定を確認
- SPA ルーティングが正しく動作するか確認

## リンク

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)
- [Next.js 静的エクスポート](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)