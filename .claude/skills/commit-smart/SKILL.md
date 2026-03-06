---
name: commit-smart
description: 'git diff を解析して Conventional Commits 形式のコミットメッセージを自動生成するスキル。コミット前に /commit-smart を実行する。'
---

# Commit Smart スキル

`git diff` を解析し、プロジェクトの規約に従った Conventional Commits 形式のコミットメッセージを自動生成します。

## 使い方

コミットしたい変更をステージングした後、このスキルを実行します。

## 手順

### ステップ 1: 変更内容を把握する

```bash
git status
git diff --staged
```

ステージングされていない場合:
```bash
git diff HEAD
```

### ステップ 2: コミットメッセージを生成する

変更内容を分析して以下の規則に従いメッセージを生成:

**フォーマット:** `<type>(<scope>): <description>`

**type の選択基準:**
| type | 用途 |
|---|---|
| `feat` | 新機能の追加 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみの変更 |
| `style` | コードの意味に影響しない変更（フォーマット等） |
| `refactor` | バグ修正・機能追加を伴わないリファクタリング |
| `test` | テストの追加・修正 |
| `chore` | ビルドプロセス・補助ツールの変更 |
| `ci` | CI 設定ファイルの変更 |
| `perf` | パフォーマンス改善 |
| `revert` | コミットの取り消し |

**scope（このプロジェクト固有）:**
`scoring` / `ui` / `data` / `config` / `deps` / `ci`

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
