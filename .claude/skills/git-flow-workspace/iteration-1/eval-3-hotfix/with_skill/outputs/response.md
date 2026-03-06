# issue #60 緊急修正 — Git-Flow 対応手順

本番環境でデプロイエラーが発生しているため、Git-Flow の `hotfix` ブランチで対応します。

---

## ステップ 1: 現在の状態を把握する

```bash
git branch --show-current          # 現在のブランチ確認
git status                         # 作業ツリーの状態確認
git log --oneline -5               # 直近のコミット確認
```

- `develop` ブランチが存在しない場合は作業開始前に確認すること
- `main` または `develop` 上で直接作業していないか確認する

---

## ステップ 2: hotfix ブランチを作成する

`hotfix` は **`main` をベース**に作成します。修正後は **`main` と `develop` の両方**にマージされます。

```bash
git checkout main && git pull origin main
git checkout -b hotfix/60-fix-deploy-error
```

**ブランチ名:** `hotfix/60-fix-deploy-error`

---

## ステップ 3: 修正を実施し、品質ゲートを通過させる

本番エラーの原因を特定・修正した後、コミット前に必ず以下を実行します:

```bash
cd webapp && npm run lint -- --fix && npm run typecheck && npm test
```

品質ゲートが全て通過することを確認してください。

---

## ステップ 4: コミットする

```bash
git add <修正したファイル>   # 関係するファイルのみ（git add -A は避ける）
git commit -m "fix: resolve deploy error in production"
```

コミットメッセージのルール: 英語・命令形・小文字・末尾ピリオドなし・72文字以内

---

## ステップ 5: プッシュして PR を作成する

```bash
git push origin hotfix/60-fix-deploy-error
```

PR のターゲットブランチは **`main`** です。

---

## ステップ 6: develop へのバックマージを行う

`hotfix` ブランチは `main` にマージされた後、**`develop` にもマージ**して修正内容を取り込む必要があります。

```bash
# main へのマージ（PR 経由）
# main マージ後、develop へもバックマージ
git checkout develop && git pull origin develop
git merge --no-ff hotfix/60-fix-deploy-error
git push origin develop
```

---

## 禁止事項（注意）

- `main` または `develop` への直接コミット・force push 絶対禁止
- 品質ゲート未通過でのコミット禁止
- `.env` など秘密情報ファイルのコミット禁止
