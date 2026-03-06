# Git-Flow でフィーチャーブランチを作成する手順

issue #42 のアーティファクトフィルター機能を追加するための、Git-Flow に従ったブランチ作成手順を説明します。

## ブランチ名

```
feature/42-artifact-filter
```

本プロジェクトの規約（`<type>/<issue-number>-<description>`）に従い、上記のブランチ名を推奨します。

---

## 手順

### 1. main ブランチを最新状態に更新する

Git-Flow では、フィーチャーブランチは `develop` ブランチから切るのが標準ですが、本プロジェクトでは `main` ブランチが基点となっている場合、まず `main` を最新化します。

```bash
git checkout main
git pull origin main
```

### 2. フィーチャーブランチを作成して切り替える

```bash
git checkout -b feature/42-artifact-filter
```

または、`git switch` を使う場合:

```bash
git switch -c feature/42-artifact-filter
```

### 3. ブランチが正しく作成されたか確認する

```bash
git branch
```

`* feature/42-artifact-filter` と表示されれば成功です。

### 4. リモートにプッシュする（任意・早めに共有したい場合）

```bash
git push -u origin feature/42-artifact-filter
```

---

## 作業完了後の流れ

1. 実装・テスト・コミットを行う
2. `main`（または `develop`）ブランチへのプルリクエストを作成する
3. レビュー・マージ後、フィーチャーブランチを削除する

```bash
git branch -d feature/42-artifact-filter
git push origin --delete feature/42-artifact-filter
```

---

## まとめ

| 項目 | 値 |
|---|---|
| ブランチ名 | `feature/42-artifact-filter` |
| 派生元ブランチ | `main` |
| 命名規則 | `feature/<issue-number>-<description>` |
