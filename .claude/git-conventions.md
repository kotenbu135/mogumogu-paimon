# Git 規約 — もぐもぐパイモン

このファイルは `.claude/git-conventions.md` として管理される SSoT（Single Source of Truth）です。

---

## ブランチ戦略: Git-Flow

```
main
 └── develop
       ├── feature/<issue-number>-<description>
       ├── bugfix/<issue-number>-<description>
       └── release/<version>

main
 └── hotfix/<issue-number>-<description>
```

### ブランチ役割

| ブランチ | 役割 | マージ先 |
|---------|------|---------|
| `main` | 本番リリース済みコード | — |
| `develop` | 開発統合ブランチ（次期リリースの基点） | `main`（リリース時） |
| `feature/*` | 新機能開発 | `develop` |
| `bugfix/*` | バグ修正（開発中のもの） | `develop` |
| `release/*` | リリース準備・バージョン調整 | `main` + `develop` |
| `hotfix/*` | 本番緊急修正（`main` から分岐） | `main` + `develop` |

### ブランチ命名規則

```
<type>/<issue-number>-<kebab-case-description>
```

**type 一覧:**

| type | 用途 |
|------|------|
| `feature` | 新機能追加 |
| `bugfix` | バグ修正（develop ベース） |
| `hotfix` | 緊急修正（main ベース） |
| `release` | リリース準備 |
| `chore` | 依存関係更新・設定変更等 |
| `docs` | ドキュメントのみの変更 |
| `refactor` | 機能変更を伴わないリファクタリング |

**例:**
```
feature/42-add-artifact-filter
bugfix/55-fix-score-calculation
hotfix/60-fix-deploy-error
release/1.2.0
chore/61-update-dependencies
docs/33-add-git-conventions
```

**ルール:**
- 全て小文字
- 単語はハイフン `-` で区切る
- issue 番号を必ず含める（リリースブランチを除く）
- 英語で記述

---

## コミットメッセージ規約: Conventional Commits

```
<type>(<scope>): <description>

[body]

[footer]
```

### type 一覧

| type | 用途 |
|------|------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみ |
| `style` | フォーマット変更（ロジック変更なし） |
| `refactor` | リファクタリング |
| `test` | テスト追加・修正 |
| `chore` | ビルド・依存関係・設定 |
| `ci` | CI/CD 設定 |
| `perf` | パフォーマンス改善 |
| `revert` | コミットの revert |

### scope 一覧（任意）

| scope | 対象範囲 |
|-------|---------|
| `scoring` | スコア計算ロジック |
| `ui` | UI コンポーネント |
| `data` | データ処理・パース |
| `config` | 設定ファイル |
| `deps` | 依存関係 |
| `ci` | CI/CD |

### ルール

- **英語・命令形・小文字・末尾ピリオドなし**
- description は 72 文字以内
- 破壊的変更は `BREAKING CHANGE:` を footer に記述

### 例

```
feat(scoring): add critical damage rate substat support

fix(ui): correct artifact card score color threshold

docs: add git-flow conventions and AI harness docs

chore(deps): update next.js to 16.1.0

test(scoring): add edge cases for zero-roll substats
```

---

## プルリクエスト規約

### タイトル

コミットメッセージと同じ Conventional Commits 形式:

```
feat(scoring): add critical damage rate substat support
```

### 本文テンプレート

```markdown
## 概要
<!-- 変更内容を箇条書きで -->

## 関連 Issue
Closes #<issue-number>

## 変更種別
- [ ] 新機能 (feat)
- [ ] バグ修正 (fix)
- [ ] ドキュメント (docs)
- [ ] リファクタリング (refactor)
- [ ] テスト (test)
- [ ] その他 (chore/ci/style)

## テスト確認
- [ ] `npm run lint -- --fix` 通過
- [ ] `npm run typecheck` 通過
- [ ] `npm test` 通過
```

### マージルール

- `feature/*` → `develop`: Squash merge 推奨
- `release/*` → `main`: Merge commit
- `hotfix/*` → `main` かつ `develop`: Merge commit

---

## ワークフロー

### 機能開発フロー

```bash
# 1. develop から feature ブランチを作成
git checkout develop
git pull origin develop
git checkout -b feature/<issue-number>-<description>

# 2. 実装・コミット（品質ゲート通過後）
cd webapp && npm run lint -- --fix && npm run typecheck && npm test
git add <files>
git commit -m "feat(<scope>): <description>"

# 3. PR を develop に向けて作成
git push origin feature/<issue-number>-<description>
```

### 緊急修正フロー（Hotfix）

```bash
# 1. main から hotfix ブランチを作成
git checkout main
git pull origin main
git checkout -b hotfix/<issue-number>-<description>

# 2. 修正・コミット
git commit -m "fix(<scope>): <description>"

# 3. main と develop 両方に PR を作成
git push origin hotfix/<issue-number>-<description>
```

---

## AI エージェント向けチェックリスト

AIがコミット・ブランチ操作を行う前に確認すること:

1. **ブランチ確認**: 現在のブランチが適切か（`git branch --show-current`）
2. **ベースブランチ確認**: feature は `develop` から、hotfix は `main` から分岐しているか
3. **品質ゲート**: `npm run lint -- --fix && npm run typecheck && npm test` が全て通過しているか
4. **コミットメッセージ**: Conventional Commits 形式に準拠しているか
5. **ブランチ名**: 命名規則（`<type>/<issue-number>-<description>`）に準拠しているか
6. **force push 禁止**: `main` および `develop` への force push は絶対に行わない
7. **直接コミット禁止**: `main` および `develop` への直接コミットは行わない
