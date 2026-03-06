---
name: git-flow
description: 'Git-Flowブランチ戦略に従ったブランチ作成・コミット・PRの手順をガイドするスキル'
---

# Git-Flow ワークフロースキル

`.claude/git-conventions.md` の規約に従い、Git-Flow ブランチ戦略でコードを管理します。

> **コンテキスト最適化**: 規約の要点はこのスキル内にインライン化済み。
> 詳細・エッジケースが必要な場合のみ、サブエージェントで該当セクションを動的読み込みすること。
> 全文読み込みは不要。

## ステップ 1: 現在の状態を把握する

```bash
git branch --show-current          # 現在のブランチ確認
git status                         # 作業ツリーの状態確認
git log --oneline -5               # 直近のコミット確認
```

- `develop` ブランチが存在しない場合は作業開始前にユーザーに確認する
- `main` または `develop` 上で直接作業していないか確認する

## ステップ 2: 適切なブランチを作成する

命名規則: `<type>/<issue-number>-<kebab-case-description>`（全て小文字・ハイフン区切り）

| type | ベース | マージ先 | 用途 |
|------|--------|----------|------|
| `feature` | `develop` | `develop` | 新機能 |
| `bugfix` | `develop` | `develop` | バグ修正 |
| `chore` | `develop` | `develop` | 依存関係・設定 |
| `docs` | `develop` | `develop` | ドキュメント |
| `refactor` | `develop` | `develop` | リファクタリング |
| `hotfix` | `main` | `main` + `develop` | 緊急修正 |
| `release` | `develop` | `main` + `develop` | リリース準備 |

```bash
# develop ベース（feature/bugfix/chore/docs/refactor）
git checkout develop && git pull origin develop
git checkout -b <type>/<issue-number>-<description>

# hotfix（main ベース）
git checkout main && git pull origin main
git checkout -b hotfix/<issue-number>-<description>

# release
git checkout develop && git pull origin develop
git checkout -b release/<major>.<minor>.<patch>
```

> 詳細なブランチ戦略: `.claude/git-conventions.md` の「ブランチ戦略」セクション参照

## ステップ 3: 品質ゲートを通過させる

コミット前に必ず以下を実行:

```bash
cd webapp && npm run lint -- --fix && npm run typecheck && npm test
```

> 品質ゲートコマンドの詳細設定: `.claude/workflow-config.json` の `qualityGate` セクション参照
> （追加チェックや設定変更が必要な場合のみ読み込む）

## ステップ 4: コミットメッセージを作成する

フォーマット: `<type>(<scope>): <description>`

**ルール:** 英語・命令形・小文字・末尾ピリオドなし・72文字以内

**type:** `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore` / `ci` / `perf` / `revert`

**scope（任意）:** `scoring` / `ui` / `data` / `config` / `deps` / `ci`

**例:**
```
feat(scoring): add critical damage rate substat support
fix(ui): correct score color threshold for S rank
docs: add git-flow conventions and AI harness docs
```

> type/scope の完全な定義: `.claude/git-conventions.md` の「コミットメッセージ規約」セクション参照
> （判断に迷う場合のみサブエージェントで読み込む）

## ステップ 5: ファイルをステージ・コミットする

```bash
git add <specific-files>   # 関係するファイルのみ（git add -A は避ける）
git commit -m "<type>(<scope>): <description>"
```

## ステップ 6: プッシュして PR を作成する

```bash
git push origin <branch-name>
```

PR ターゲット: `feature/*` / `bugfix/*` / `chore/*` / `docs/*` / `refactor/*` → `develop` / `hotfix/*` / `release/*` → `main`

> PR テンプレート・マージ戦略の詳細: `.claude/git-conventions.md` の「プルリクエスト規約」セクション参照

## 禁止事項

- `main` または `develop` への直接コミット・force push 絶対禁止
- 品質ゲート未通過でのコミット禁止
- `git add -A` / `git add .` の使用は注意（不要ファイルを含む可能性）
- `.env` など秘密情報ファイルのコミット禁止

## develop ブランチが存在しない場合

```bash
git checkout main
git checkout -b develop
git push -u origin develop
```

## 動的読み込みガイド（サブエージェント活用）

以下の場合のみ、サブエージェントで該当ファイルの必要セクションを読み込む:

| 状況 | 読み込み対象 |
|------|-------------|
| ブランチ命名の正規表現パターンを確認したい | `.claude/workflow-config.json` の `gitFlow.branchPattern` |
| PR マージ戦略（squash/merge）を確認したい | `.claude/workflow-config.json` の `pr.mergeStrategy` |
| PR 本文テンプレートが必要 | `.claude/git-conventions.md` の「プルリクエスト規約」セクション |
| 破壊的変更（BREAKING CHANGE）の書き方 | `.claude/git-conventions.md` の「ルール」セクション |
| TDD ワークフロー設定を確認したい | `.claude/workflow-config.json` の `tdd` セクション |
