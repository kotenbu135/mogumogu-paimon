---
name: suggest-claude-code-templates
description: 'claude-code-templatesリポジトリからリポジトリのコンテキストとチャット履歴に基づいて関連するコマンド・エージェント・スキル・フック・MCP・設定・プラグインをClaude Code用に提案します。既存コンテンツとの重複を避け、プロジェクトに最適なテンプレートを特定します。'
disable-model-invocation: true
---

# Claude Code Templates の提案

現在のリポジトリコンテキストを分析し、[claude-code-templatesリポジトリ](https://github.com/davila7/claude-code-templates)からこのリポジトリに未導入の関連コマンド・エージェント・スキル・フック・MCP・設定・プラグインを提案します。

## 手順

### Phase 1: データ収集（並列実行）

**ローカルコンテンツのスキャン**と**リモートテンプレート取得**を同時に行う。

#### 1a. ローカルコンテンツのスキャン

Globツールで以下を探索し、Readツールで各ファイルのフロントマター（`name`、`description`）を読み取る:
- `.claude/commands/` — 既存のカスタムコマンド
- `.claude/agents/` — 既存のエージェント定義
- `.claude/skills/` — 既存のスキル（`.claude/skills/<スキル名>/SKILL.md`）
- `.claude/hooks/` — 既存のフックスクリプト
- `.claude/settings.json` — フック設定・モデル設定
- `.claude/mcp.json` — 既存のMCPサーバー設定

#### 1b. リモートテンプレートの並列取得

Agentツール（`context: fork`）を使用し、以下の **7つのサブエージェントを同時に起動** してリモートデータを取得する。各サブエージェントは担当カテゴリのインデックスページと全コンテンツを取得し、結果を構造化テキストで返す。

**サブエージェント1 — コマンド**:
WebFetchで `https://github.com/davila7/claude-code-templates/tree/main/.claude/commands` を取得し、ファイル名一覧を収集する。次に各コマンドの raw URL (`https://raw.githubusercontent.com/davila7/claude-code-templates/main/.claude/commands/<ファイル名>.md`) からフロントマターの `description` を取得する。結果をJSON形式で返す: `{ "commands": [{ "name": "<ファイル名>", "description": "...", "url": "..." }] }`

**サブエージェント2 — エージェント**:
WebFetchで `https://github.com/davila7/claude-code-templates/tree/main/.claude/agents` を取得し、ファイル名一覧を収集する。次に各エージェントの raw URL (`https://raw.githubusercontent.com/davila7/claude-code-templates/main/.claude/agents/<ファイル名>.md`) からフロントマターの `name`・`description` を取得する。結果をJSON形式で返す: `{ "agents": [{ "name": "...", "description": "...", "file": "<ファイル名>", "url": "..." }] }`

**サブエージェント3 — スキル**:
WebFetchで `https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/skills` を取得し、カテゴリ一覧を収集する。次に各カテゴリページ (`https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/skills/<カテゴリ>`) を取得してスキル名を収集する。各スキルの raw URL (`https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/skills/<カテゴリ>/<スキル名>/SKILL.md`) からフロントマターを取得する。結果をJSON形式で返す: `{ "skills": [{ "name": "...", "category": "...", "description": "...", "url": "..." }] }`

**サブエージェント4 — フック**:
WebFetchで `https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/hooks` を取得し、カテゴリ一覧を収集する。次に各カテゴリページを取得してフック名を収集する。各フックの JSON raw URL (`https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/hooks/<カテゴリ>/<フック名>.json`) を取得して `description` を抽出する。結果をJSON形式で返す: `{ "hooks": [{ "name": "...", "category": "...", "description": "...", "url": "..." }] }`

**サブエージェント5 — MCP**:
WebFetchで `https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/mcps` を取得し、カテゴリ一覧を収集する。次に各カテゴリページを取得してMCP名を収集する。各MCP JSON raw URL (`https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/mcps/<カテゴリ>/<MCP名>.json`) を取得して `description` を抽出する。結果をJSON形式で返す: `{ "mcps": [{ "name": "...", "category": "...", "description": "...", "url": "..." }] }`

**サブエージェント6 — 設定**:
WebFetchで `https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/settings` を取得し、カテゴリ一覧を収集する。次に各カテゴリページを取得して設定ファイル名を収集する。各設定 JSON raw URL (`https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/settings/<カテゴリ>/<設定名>.json`) を取得して内容を抽出する。結果をJSON形式で返す: `{ "settings": [{ "name": "...", "category": "...", "description": "...", "url": "..." }] }`

**サブエージェント7 — プラグイン**:
WebFetchで `https://raw.githubusercontent.com/davila7/claude-code-templates/main/.claude-plugin/marketplace.json` を取得し、全プラグイン情報（名前・説明・含まれるコマンド数・エージェント数）を抽出する。結果をJSON形式で返す: `{ "plugins": [{ "name": "...", "description": "...", "commandCount": 0, "agentCount": 0, "url": "..." }] }`

### Phase 2: バージョン比較（並列実行）

1aで収集したローカルコンテンツについて、1bのリモートデータと同名のものをAgentツール（`context: fork`）でカテゴリ別に並列比較する。各サブエージェントは担当カテゴリのローカルファイルとリモートコンテンツを比較し、差異を返す:
- **フロントマターの変更**（name、description）
- **指示の更新**（ガイドライン、例、ベストプラクティス）
- **JSONの変更**（フック設定、MCPサーバー設定、設定値）

### Phase 3: 分析・提案

1. **コンテキストの分析**: チャット履歴・リポジトリファイル・現在のプロジェクトニーズをレビューする
2. **既存コンテンツとの照合**: Phase 1aで収集したローカルコンテンツと照合する
3. **関連性のマッチング**: 利用可能なテンプレートとプロジェクトのパターン・要件を比較する
4. **選択肢の提示**: 構造化テーブルを出力する（詳細は「出力フォーマット」参照）
5. **検証**: 提案するテンプレートが既存コンテンツでカバーされていない価値を追加できることを確認する
6. **待機** — ユーザーが特定のテンプレートのインストールまたは更新を指示するまで待つこと。**指示なしにインストール・更新を実行してはならない。**

### Phase 4: アセットのダウンロード/更新

ユーザーの指示を受けてから、要求されたテンプレートについて以下を自動的に実行する:
- **コマンド**: `.claude/commands/<ファイル名>.md` として保存する
- **エージェント**: `.claude/agents/<ファイル名>.md` として保存する
- **スキル**: `.claude/skills/<スキル名>/SKILL.md` としてフォルダ構造を維持して保存する。スキルフォルダ内に同梱アセット（スクリプト、テンプレート等）があれば一緒にダウンロードする
- **フック**: スクリプトファイル（`.py`、`.sh` など）を `.claude/hooks/<フック名>.<拡張子>` として保存する。JSONの `hooks` 配列エントリを `.claude/settings.json` の `hooks` セクションにマージする（既存エントリと重複しないよう確認する）
- **MCP**: JSONの `mcpServers` エントリを `.claude/mcp.json` の `mcpServers` セクションにマージする（既存エントリと重複しないよう確認する）
- **設定**: JSONの設定値を `.claude/settings.json` の該当セクションにマージする（既存値を上書きしないよう確認する）
- **プラグイン**: `marketplace.json` のコンテンツから各コマンド・エージェントを上記のパスに展開する
- ファイルの内容を調整しないこと
- WebFetchツールでコンテンツを取得し、WriteまたはEditツールでファイルを保存・マージする
- TodoWriteツールで進捗を管理する

## コンテキスト分析基準

**リポジトリパターン**:
- 使用されているプログラミング言語（.ts、.js、.py など）
- フレームワークの指標（Next.js、React、Supabase、Vercel など）
- プロジェクトの種類（Webアプリ、API、ライブラリ、ツール）
- 開発ワークフロー要件（テスト、CI/CD、デプロイ）
- データベースやクラウドサービス（Supabase、Firebase、AWS など）

**チャット履歴コンテキスト**:
- 最近の議論と課題
- 機能リクエストや実装ニーズ
- 繰り返し行っている操作（テスト実行、lint、デプロイなど）
- 専門タスクのニーズ（ドキュメント生成、セキュリティ監査など）

## 出力フォーマット

コマンド・エージェント・スキル・フック・MCP・設定・プラグインの7つのカテゴリ別に構造化テーブルを表示する:

### コマンド

| テンプレート名 | 説明 | インストール済み | 提案理由 |
|----------------|------|-----------------|---------|
| [lint](https://github.com/davila7/claude-code-templates/blob/main/.claude/commands/lint.md) | コード品質チェック | ❌ 未導入 | リポジトリでlintを頻繁に実行しているため |
| [test](https://github.com/davila7/claude-code-templates/blob/main/.claude/commands/test.md) | テスト実行自動化 | ✅ 導入済み | - |

### エージェント

| テンプレート名 | 説明 | インストール済み | 提案理由 |
|----------------|------|-----------------|---------|
| [frontend-developer](https://github.com/davila7/claude-code-templates/blob/main/.claude/agents/frontend-developer.md) | フロントエンド開発専門家 | ❌ 未導入 | Next.js/Reactプロジェクトに有用 |

### スキル

| スキル名 | カテゴリ | 説明 | インストール済み | 提案理由 |
|---------|---------|------|-----------------|---------|
| [commit-smart](https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/skills/git/commit-smart) | git | セマンティックなConventional Commitsを生成 | ❌ 未導入 | git規約に従ったコミット管理に有用 |
| [nextjs-app-router](https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/skills/development/nextjs-app-router) | development | Next.js App Router開発ガイド | ⚠️ 古い | 既存スキルと差異あり — 更新を推奨 |

### フック

| フック名 | カテゴリ | 説明 | インストール済み | 提案理由 |
|---------|---------|------|-----------------|---------|
| [conventional-commits](https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/hooks/git) | git | Conventional Commits形式を強制するPreToolUseフック | ❌ 未導入 | git規約を自動チェックするために有用 |

### MCP（Model Context Protocol）サーバー

| MCP名 | カテゴリ | 説明 | インストール済み | 提案理由 |
|------|---------|------|-----------------|---------|
| [supabase](https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/mcps/database) | database | Supabaseデータベース接続 | ❌ 未導入 | Supabaseを使用するプロジェクトに有用 |

### 設定

| 設定名 | カテゴリ | 説明 | インストール済み | 提案理由 |
|------|---------|------|-----------------|---------|
| [git-commit-settings](https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/settings/global) | global | コミット時のCo-authored-by設定 | ❌ 未導入 | git規約に合わせた設定管理に有用 |

### プラグイン（複数テンプレートのバンドル）

| プラグイン名 | 含まれるコマンド数 | 含まれるエージェント数 | 説明 | 提案理由 |
|------------|-----------------|---------------------|------|---------|
| [testing-suite](https://github.com/davila7/claude-code-templates/tree/main/.claude-plugin) | 5 | 2 | 総合テストツールキット | Vitestを使用しているため |

## アイコン凡例

- ✅ インストール済みかつ最新
- ⚠️ インストール済みだが古い（更新あり）
- ❌ リポジトリに未導入

## 更新処理

古いコンテンツが特定された場合:
1. ⚠️ステータスで出力テーブルに含める
2. 「提案理由」列に具体的な差異を記載する
3. 主要な変更点を示した更新推奨を提供する
4. ユーザーが更新を要求した場合、ローカルファイルをリモートバージョンで置き換える
5. 各コンテンツタイプのファイルパスを維持する:
   - コマンド: `.claude/commands/`
   - エージェント: `.claude/agents/`
   - スキル: `.claude/skills/<スキル名>/`（フォルダ構造ごと置き換え）
   - フック: `.claude/hooks/<フック名>.<拡張子>` + `.claude/settings.json` の `hooks` セクション更新
   - MCP: `.claude/mcp.json` の `mcpServers` セクション更新
   - 設定: `.claude/settings.json` の該当セクション更新
