# コミットメッセージの提案

スコア計算ロジックに会心率サブステータスのサポートを追加した変更に対して、以下のコミットメッセージを推奨します。

## 推奨コミットメッセージ

```
feat: add crit rate substat support to score calculation logic
```

または、スコープを含める場合:

```
feat(scoring): add crit rate substat support to score calculation logic
```

## 理由

このプロジェクトのGit規約（`.claude/git-conventions.md`参照）に従い、Conventional Commits形式を使用しています。

- **type**: `feat` — 新機能（会心率サブステータスのサポート追加）
- **scope**: `scoring` — スコア計算に関する変更（省略可）
- **description**: 英語・命令形・小文字・ピリオドなし
  - `add` — 命令形
  - `crit rate substat` — 会心率サブステータス
  - `score calculation logic` — スコア計算ロジック
