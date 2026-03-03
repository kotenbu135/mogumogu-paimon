# Git 規約

このファイルはプロジェクトの Git 命名規約における唯一の信頼できる情報源（SSoT）です。

## ブランチ命名

### フォーマット

```
<type>/<issue-number>-<description>
```

### タイプのプレフィックス

| タイプ | プレフィックス | 用途 |
|------|--------|-------|
| 機能追加 | `feat/` | 新機能の実装 |
| バグ修正 | `fix/` | バグの修正 |
| リファクタリング | `refactor/` | コードの整理・改善 |
| ドキュメント | `docs/` | ドキュメントの追加・編集 |
| テスト | `test/` | テストの追加・編集 |
| 雑務 | `chore/` | 設定変更・依存関係の更新など |

### Issue 番号

- ゼロパディングなし: `123`（正）、`001`（誤）
- Issue がない場合は省略可: `feat/add-logging`

### 説明

- 英語で記述
- ハイフン区切り（kebab-case）
- 2〜4 語で簡潔に表現
- 小文字のみ

### 例

```
feat/123-add-user-authentication
fix/456-fix-login-error
refactor/789-cleanup-api-client
docs/101-update-readme
test/111-add-e2e-tests
chore/222-update-dependencies
```

### ブランチタイプの自動判定（start-issue 用）

Issue からブランチタイプを自動判定するためのマッピング:

**GitHub ラベル → プレフィックス:**

| ラベル | プレフィックス |
|-------|--------|
| `enhancement`, `feature` | `feat/` |
| `bug` | `fix/` |
| `refactoring`, `refactor` | `refactor/` |
| `documentation`, `docs` | `docs/` |
| `test` | `test/` |
| `chore` | `chore/` |

**キーワード → プレフィックス（ラベルがない場合のフォールバック）:**

| キーワード | プレフィックス |
|----------|--------|
| `bug`, `fix`, `error`, `issue` | `fix/` |
| `refactor`, `cleanup`, `improve`, `reorganize` | `refactor/` |
| `doc`, `readme`, `documentation` | `docs/` |
| `test`, `testing` | `test/` |
| `chore`, `config`, `setup`, `dependency` | `chore/` |
| `add`, `feature`, `implement`, `create`, `new` | `feat/` |

**デフォルト:** `feat/`

## コミットメッセージ

### フォーマット

[Conventional Commits](https://www.conventionalcommits.org/) 形式に従う:

```
<type>(<scope>): <description>

[本文（任意）]

[フッター（任意）]
```

### タイプ

ブランチのプレフィックスと同一:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `refactor`: リファクタリング
- `test`: テスト
- `chore`: その他

### スコープ（任意）

- Issue 番号: `feat(#123): add login feature`
- モジュール名: `fix(api): handle timeout error`

### 説明

- 英語で記述
- 命令形を使用: "added" ではなく "add"
- 小文字で始める
- 末尾にピリオドをつけない

### 例

```
feat(#123): add user authentication

fix(api): handle session expiration correctly

docs: update installation guide

refactor(#456): extract common validation logic

chore: update dependencies to latest versions
```

## Git Worktree

### フォーマット

```
../<project-name>-<branch-name>
```

### ルール

- 配置場所: メインリポジトリの親ディレクトリ
- プロジェクト名: リポジトリのディレクトリ名を使用（例: `my-project`）
- ブランチ名: `/` を `-` に置き換える

### 例

| ブランチ | Worktree ディレクトリ |
|--------|-------------------|
| `feat/123-add-auth` | `../${PROJECT_NAME}-feat-123-add-auth` |
| `fix/456-fix-login` | `../${PROJECT_NAME}-fix-456-fix-login` |
| `refactor/789-cleanup` | `../${PROJECT_NAME}-refactor-789-cleanup` |

### コマンド

```bash
# 既存ブランチの worktree を作成
git worktree add ../${PROJECT_NAME}-feat-123-add-auth feat/123-add-auth

# 新しいブランチと worktree を同時に作成
git worktree add -b feat/123-add-auth ../${PROJECT_NAME}-feat-123-add-auth

# worktree の一覧表示
git worktree list

# worktree の削除
git worktree remove ../${PROJECT_NAME}-feat-123-add-auth
```
