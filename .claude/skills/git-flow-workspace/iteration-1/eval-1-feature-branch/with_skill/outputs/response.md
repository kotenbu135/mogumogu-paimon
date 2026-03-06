# Git-Flow に従ったブランチ作成手順（issue #42 アーティファクトフィルター機能）

以下の手順で Git-Flow に従ってブランチを作成します。

---

## ステップ 1: 現在の状態を把握する

まず現在のブランチ・作業ツリーの状態を確認します。

```bash
git branch --show-current          # 現在のブランチ確認
git status                         # 作業ツリーの状態確認
git log --oneline -5               # 直近のコミット確認
```

現在 `main` ブランチにいることを確認済みとのことです。

> **注意:** `develop` ブランチが存在しない場合は、先に作成が必要です（後述）。

---

## ステップ 2: 適切なブランチを作成する

「アーティファクトフィルター機能を追加」は新機能追加なので、ブランチタイプは `feature` を使います。

| 項目 | 値 |
|------|-----|
| type | `feature` |
| ベースブランチ | `develop` |
| マージ先 | `develop` |
| ブランチ名 | `feature/42-artifact-filter` |

### develop ブランチが存在する場合

```bash
git checkout develop && git pull origin develop
git checkout -b feature/42-artifact-filter
```

### develop ブランチが存在しない場合

先に `develop` を作成してから、フィーチャーブランチを切ります。

```bash
# develop ブランチを作成してプッシュ
git checkout main
git checkout -b develop
git push -u origin develop

# フィーチャーブランチを作成
git checkout -b feature/42-artifact-filter
```

---

## ステップ 3: 品質ゲートを通過させる（実装後に実行）

実装が完了したら、コミット前に以下を必ず実行してください。

```bash
cd webapp && npm run lint -- --fix && npm run typecheck && npm test
```

---

## ステップ 4: コミットメッセージの例

```
feat(ui): add artifact filter functionality
```

---

## ステップ 5: ファイルをステージ・コミットする

```bash
git add <変更した具体的なファイル>   # 関係するファイルのみ（git add -A は避ける）
git commit -m "feat(ui): add artifact filter functionality"
```

---

## ステップ 6: プッシュして PR を作成する

```bash
git push origin feature/42-artifact-filter
```

PR のターゲットブランチは `develop` です。

---

## まとめ

- **ブランチ名:** `feature/42-artifact-filter`
- **ベースブランチ:** `develop`
- **マージ先:** `develop`
- `main` への直接コミット・force push は絶対禁止です。
