---
name: git-flow
description: 'Git-Flowブランチ戦略に従ったブランチ作成・コミット・PRの手順をガイドするスキル'
---

# Git-Flow ワークフロースキル

`.claude/git-conventions.md` の規約に従い、Git-Flow ブランチ戦略でコードを管理します。

## 前提: 規約ドキュメントの確認

このスキルを使用する前に必ず `.claude/git-conventions.md` と `.claude/workflow-config.json` を読み込むこと。

## ステップ 1: 現在の状態を把握する

```bash
git branch --show-current          # 現在のブランチ確認
git status                         # 作業ツリーの状態確認
git log --oneline -5               # 直近のコミット確認
```

- `develop` ブランチが存在しない場合は作業開始前にユーザーに確認する
- `main` または `develop` 上で直接作業していないか確認する

## ステップ 2: 適切なブランチを作成する

### 機能開発・バグ修正・その他（develop ベース）

```bash
git checkout develop
git pull origin develop
git checkout -b <type>/<issue-number>-<kebab-case-description>
```

**type の選択:**
- 新機能 → `feature`
- バグ修正（develop） → `bugfix`
- ドキュメント変更 → `docs`
- 依存関係・設定 → `chore`
- リファクタリング → `refactor`

### 緊急修正（main ベース）

```bash
git checkout main
git pull origin main
git checkout -b hotfix/<issue-number>-<kebab-case-description>
```

### リリース準備

```bash
git checkout develop
git pull origin develop
git checkout -b release/<major>.<minor>.<patch>
```

## ステップ 3: 品質ゲートを通過させる

コミット前に必ず以下を実行:

```bash
cd webapp && npm run lint -- --fix && npm run typecheck && npm test
```

- lint エラー → 修正してから再実行
- 型エラー → 修正してから再実行
- テスト失敗 → 修正してから再実行
- 全て通過したらコミットへ進む

## ステップ 4: コミットメッセージを作成する

フォーマット: `<type>(<scope>): <description>`

**チェックリスト:**
- [ ] 英語で記述
- [ ] 命令形（"add" 〇、"added" ×、"adds" ×）
- [ ] 小文字始まり
- [ ] 末尾ピリオドなし
- [ ] 72 文字以内
- [ ] Conventional Commits 形式に準拠

**type 選択:**
`feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore` / `ci` / `perf` / `revert`

**scope（任意）:**
`scoring` / `ui` / `data` / `config` / `deps` / `ci`

**例:**
```
feat(scoring): add critical damage rate substat support
fix(ui): correct score color threshold for S rank
docs: add git-flow conventions and AI harness docs
test(scoring): add edge cases for zero-roll substats
chore(deps): update next.js to 16.1.0
```

## ステップ 5: ファイルをステージ・コミットする

```bash
git add <specific-files>   # 関係するファイルのみ追加（git add -A は避ける）
git commit -m "<type>(<scope>): <description>"
```

## ステップ 6: プッシュして PR を作成する

```bash
git push origin <branch-name>
```

PR のターゲットブランチ:
- `feature/*` / `bugfix/*` / `chore/*` / `docs/*` / `refactor/*` → `develop`
- `hotfix/*` / `release/*` → `main`（かつ `develop` にも）

## 禁止事項

- `main` または `develop` への直接コミット禁止
- `main` または `develop` への force push 絶対禁止
- 品質ゲート未通過でのコミット禁止
- `git add -A` / `git add .` の使用は注意（不要ファイルを含む可能性）
- `.env` など秘密情報ファイルのコミット禁止

## develop ブランチが存在しない場合

既存プロジェクトで `develop` ブランチがない場合、ユーザーに確認してから以下を実行:

```bash
git checkout main
git checkout -b develop
git push -u origin develop
```
