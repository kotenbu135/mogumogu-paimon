---
name: suggest-claude-code-templates
description: 'claude-code-templatesリポジトリからリポジトリのコンテキストとチャット履歴に基づいて関連するコマンド・エージェント・スキル・フック・MCP・設定・プラグインをClaude Code用に提案します。既存コンテンツとの重複を避け、プロジェクトに最適なテンプレートを特定します。'
---

# Claude Code Templates の提案

現在のリポジトリコンテキストを分析し、[claude-code-templatesリポジトリ](https://github.com/davila7/claude-code-templates)からこのリポジトリに未導入の関連コマンド・エージェント・スキル・フック・MCP・設定・プラグインを提案します。

## 手順

1. **利用可能なテンプレートの取得**: 以下のURLからコンテンツを取得する。WebFetchツールを使用すること。
   - コマンド一覧: `https://github.com/davila7/claude-code-templates/tree/main/.claude/commands`
   - エージェント一覧: `https://github.com/davila7/claude-code-templates/tree/main/.claude/agents`
   - プラグイン一覧: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/.claude-plugin/marketplace.json`
   - `cli-tool/components/` 以下の全コンテンツタイプ一覧: `https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components`
   - スキルカテゴリ一覧: `https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/skills`
   - フックカテゴリ一覧: `https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/hooks`
   - MCPカテゴリ一覧: `https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/mcps`
   - 設定カテゴリ一覧: `https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/settings`
   - 各カテゴリページを取得し、カテゴリ内のファイル/フォルダ名を収集する

2. **ローカルコンテンツのスキャン**: 以下のディレクトリ・ファイルを探索する。Globツールを使用すること。
   - `.claude/commands/` — 既存のカスタムコマンド
   - `.claude/agents/` — 既存のエージェント定義
   - `.claude/skills/` — 既存のスキル（各スキルはフォルダ構造: `.claude/skills/<スキル名>/SKILL.md`）
   - `.claude/hooks/` — 既存のフックスクリプト（`.py`、`.sh` など）
   - `.claude/settings.json` — フック設定・モデル設定など
   - `.claude/mcp.json` — 既存のMCPサーバー設定

3. **ローカルメタデータの抽出**: 各ローカルファイルの以下を読み取る。Readツールを使用すること。
   - フロントマターの `name` と `description`
   - ファイルが存在するかどうか（パス確認）

4. **コンテンツの取得**: 各カテゴリのファイルを以下のrawURLパターンで取得する:
   - コマンド: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/.claude/commands/<ファイル名>.md`
   - エージェント: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/.claude/agents/<ファイル名>.md`
   - スキル: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/skills/<カテゴリ>/<スキル名>/SKILL.md`
   - フック: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/hooks/<カテゴリ>/<フック名>.json`（設定）と `<フック名>.py`（スクリプト）
   - MCP: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/mcps/<カテゴリ>/<MCP名>.json`
   - 設定: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/settings/<カテゴリ>/<設定名>.json`

5. **バージョンの比較**: ローカルにすでに同名・同機能のファイルがある場合:
   - コンテンツを比較し、最新・古い・未導入を判定する
   - スキルの場合: ローカルの `.claude/skills/<スキル名>/SKILL.md` とリモートを比較する
   - 主要な差異を記録する

6. **コンテキストの分析**: チャット履歴・リポジトリファイル・現在のプロジェクトニーズをレビューする。

7. **既存コンテンツとの照合**: このリポジトリに既に存在するコンテンツと照合する。

8. **関連性のマッチング**: 利用可能なテンプレートとプロジェクトのパターン・要件を比較する。

9. **選択肢の提示**: 関連するテンプレートを説明・根拠・可用性ステータスと共に表示する。

10. **検証**: 提案するテンプレートが既存コンテンツでカバーされていない価値を追加できることを確認する。

11. **出力**: 提案・説明・リポジトリリンク・類似ローカルコンテンツへのリンクを含む構造化テーブルを提供する。
    **待機** — ユーザーが特定のテンプレートのインストールまたは更新を指示するまで待つこと。**指示なしにインストール・更新を実行してはならない。**

12. **アセットのダウンロード/更新**: 要求されたテンプレートについて、以下を自動的に実行する:
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

## ローカルコンテンツ探索プロセス

1. `.claude/commands/`、`.claude/agents/`、`.claude/skills/`、`.claude/hooks/` を一覧表示する
2. 各ファイルのフロントマターを読み取り、`name` と `description` を抽出する
3. ファイルが存在するかどうかに基づいてインストール状況を判定する
4. 既存コンテンツと機能の包括的なインベントリを構築する
5. このインベントリを使用して重複の提案を避ける

## バージョン比較プロセス

1. 各ローカルファイルについて、リモートのrawURLを構築する:
   - コマンドパターン: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/.claude/commands/<ファイル名>.md`
   - エージェントパターン: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/.claude/agents/<ファイル名>.md`
   - スキルパターン: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/skills/<カテゴリ>/<スキル名>/SKILL.md`
     - スキルのカテゴリは `cli-tool/components/skills/` 以下のディレクトリ名（例: `git`、`development`、`security` など）
   - フックパターン: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/hooks/<カテゴリ>/<フック名>.json`
   - MCPパターン: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/mcps/<カテゴリ>/<MCP名>.json`
   - 設定パターン: `https://raw.githubusercontent.com/davila7/claude-code-templates/main/cli-tool/components/settings/<カテゴリ>/<設定名>.json`
2. WebFetchツールでリモートバージョンを取得する
3. ファイル全体のコンテンツを比較する（JSONの場合はキー・値を比較）
4. 具体的な差異を特定する:
   - **フロントマターの変更**（name、description）
   - **指示の更新**（ガイドライン、例、ベストプラクティス）
   - **JSONの変更**（フック設定、MCPサーバー設定、設定値）
5. 古いコンテンツの主要な差異を文書化する

## テンプレート構造要件

**コマンド** (`.claude/commands/<name>.md`):
- フロントマター: `description`（コマンドの目的）
- 本文: コマンドの実行手順・指示
- ファイル名がコマンド名となる（例: `lint.md` → `/lint`）

**エージェント** (`.claude/agents/<name>.md`):
- フロントマター: `name`、`description`、`color`（任意）
- 本文: エージェントの役割・専門知識・動作定義

**スキル** (`.claude/skills/<スキル名>/SKILL.md`):
- フォルダ構造: `.claude/skills/<スキル名>/` にフォルダを作成し、その中に `SKILL.md` を配置する
- フロントマター: `name`（フォルダ名と一致）、`description`
- 本文: スキルの詳細な指示・手順
- 同梱アセット: スキルフォルダ内に存在するスクリプト・テンプレート等のファイルも一緒にダウンロードする
- リモートのスキルカテゴリは `cli-tool/components/skills/<カテゴリ>/<スキル名>/` のパスにある

**フック** (`.claude/hooks/<フック名>.<拡張子>` + `.claude/settings.json`):
- スクリプトファイル（`.py`、`.sh` など）を `.claude/hooks/` に保存する
- JSON設定ファイルの `hooks` 配列エントリを `.claude/settings.json` の `hooks` セクションにマージする
- リモートのフックは `cli-tool/components/hooks/<カテゴリ>/` のパスにある（JSONとスクリプトのペア）

**MCP** (`.claude/mcp.json`):
- JSONファイルの `mcpServers` オブジェクトを `.claude/mcp.json` の `mcpServers` セクションにマージする
- リモートのMCPは `cli-tool/components/mcps/<カテゴリ>/<MCP名>.json` のパスにある

**設定** (`.claude/settings.json`):
- JSONファイルの設定値を `.claude/settings.json` の該当セクションにマージする
- リモートの設定は `cli-tool/components/settings/<カテゴリ>/<設定名>.json` のパスにある

## 要件

- WebFetchツールを使ってclaude-code-templatesリポジトリからコンテンツを取得する
- Globツールを使って`.claude/`ディレクトリ内の既存コンテンツをスキャンする
- ReadツールでローカルファイルのYAMLフロントマターを読み取り、名前と説明を抽出する
- ローカルコンテンツとリモートバージョンを比較して古いファイルを検出する
- 重複を避けるためにリポジトリの既存コンテンツと比較する
- 現在のコンテンツライブラリのカバレッジのギャップに焦点を当てる
- 提案するテンプレートがリポジトリの目的と技術スタックに合致することを検証する
- 各提案に明確な根拠を提供する
- テンプレートと類似ローカルコンテンツの両方へのリンクを含める
- 古いコンテンツを明確に特定し、具体的な差異を記載する
- テーブルと分析以外の追加情報やコンテキストは提供しない

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
