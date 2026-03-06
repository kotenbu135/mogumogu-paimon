---
name: commit-smart
description: 'git diff を解析して Conventional Commits 形式のコミットメッセージを自動生成するスキル。コミット前に /commit-smart を実行する。'
---

# Commit Smart スキル

`git diff` を解析し、プロジェクトの規約に従った Conventional Commits 形式のコミットメッセージを自動生成します。

## 使い方

コミットしたい変更をステージングした後、このスキルを実行します。

## 手順

### ステップ 1: 変更内容をサブエージェントで分析する

Agent ツール（`context: fork`）を使ってサブエージェントに diff 分析を委譲します。
メインコンテキストを汚染せずに大きな diff を処理できます。

サブエージェントへの指示:

```
以下の git diff を分析し、Conventional Commits 形式のコミットメッセージ候補を提案してください。
規約の詳細は .claude/git-conventions.md を参照してください。

$(git diff --staged || git diff HEAD)

出力形式:
- 推奨メッセージ: <type>(<scope>): <description>
- 理由: （type と scope を選んだ根拠）
- 代替案: （あれば）
```

### ステップ 2: コミットメッセージを確定する

サブエージェントの提案を元に最終メッセージを決定します。

**フォーマット:** `<type>(<scope>): <description>`

type / scope の定義は `.claude/git-conventions.md`（Conventional Commits セクション）を参照してください。

**description のルール:**
- 英語・命令形（"add" 〇、"added" / "adds" ×）
- 小文字始まり
- 末尾ピリオドなし
- 72 文字以内

### ステップ 3: コミットを実行する

```bash
git commit -m "<生成したメッセージ>"
```

複数の独立した変更がある場合は複数コミットに分割することを推奨。

## 生成例

```
feat(scoring): add substat roll count calculation
fix(ui): correct artifact score color for S rank threshold
docs: add GOOD format specification reference
test(scoring): add edge cases for zero-value substats
chore(deps): update next.js from 16.0.0 to 16.1.0
refactor(scoring): extract stat weight lookup to separate function
```

## 注意事項

- コミット前に品質ゲートを必ず通過させること: `cd webapp && npm run lint -- --fix && npm run typecheck && npm test`
- `git add -A` / `git add .` は避け、関連ファイルのみをステージングすること
- `.env` 等の秘密情報ファイルをコミットしないこと
