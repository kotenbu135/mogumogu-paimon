# Git-Flow による緊急修正（Hotfix）手順 — issue #60 デプロイエラー対応

## 概要

本番環境でデプロイエラーが発生している issue #60 に対して、Git-Flow の Hotfix フローで対応します。
Hotfix は **`main` ブランチから分岐**し、修正後に **`main` と `develop` の両方にマージ**するのが原則です。

---

## 手順

### 1. main ブランチを最新化し、hotfix ブランチを作成する

```bash
git checkout main
git pull origin main
git checkout -b hotfix/60-fix-deploy-error
```

- ブランチ名: `hotfix/60-fix-deploy-error`
- ベースブランチ: `main`（本番コードから直接分岐）

### 2. 問題を修正してコミットする

デプロイエラーの原因を特定・修正してから、品質ゲートを通過させた上でコミットします。

```bash
# webapp/ で品質チェックを実行
cd webapp && npm run lint -- --fix && npm run typecheck && npm test

# 変更をステージング・コミット
git add <修正ファイル>
git commit -m "fix(config): fix deployment error in production"
```

コミットメッセージは Conventional Commits 形式（英語・命令形・小文字・末尾ピリオドなし）に従います。

### 3. リモートにプッシュし、PR を 2 つ作成する

```bash
git push origin hotfix/60-fix-deploy-error
```

PR は以下の **2 つ** を作成します。

| PR | マージ先 | マージ方法 | 目的 |
|----|---------|-----------|------|
| PR-A | `main` | Merge commit | 本番への即時反映 |
| PR-B | `develop` | Merge commit | 開発ブランチへの修正取り込み |

### 4. main へのマージ後にタグを打つ（推奨）

```bash
git checkout main
git pull origin main
git tag -a v<バージョン> -m "hotfix: fix deploy error (#60)"
git push origin v<バージョン>
```

---

## 禁止事項

- `main` および `develop` への直接コミット・force push は **絶対禁止**
- `develop` からではなく **必ず `main` から分岐**すること

---

## まとめ

| 項目 | 値 |
|------|----|
| ブランチ名 | `hotfix/60-fix-deploy-error` |
| ベースブランチ | `main` |
| マージ先 | `main` **および** `develop` |
| マージ方法 | Merge commit |
