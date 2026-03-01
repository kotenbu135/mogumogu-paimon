# もぐもぐパイモン — CLAUDE.md

## 言語設定
- **基本的な受け答えは全て日本語で行うこと**
- コメント・ドキュメント・エラーメッセージ: 日本語
- 変数名・関数名: 英語

## プロジェクト概要
原神の聖遺物スコアを GOOD フォーマット JSON から計算・ランキング表示する静的 Web アプリ。
GitHub Pages にデプロイされる。

## 技術スタック
Next.js 16（App Router）/ TypeScript 5 / React 19 / Tailwind CSS 4 / Vitest 4 / Node.js 25

## クイックスタート
すべてのコマンドは `webapp/` で実行する。
```bash
cd webapp
npm run dev          # 開発サーバー
npm run typecheck    # 型チェック
npm run lint -- --fix  # Lint
npm test             # テスト
npm run build        # 本番ビルド（out/ に生成）
```

## 品質ゲート（コミット前に必須）
```bash
cd webapp && npm run lint -- --fix && npm run typecheck && npm test
```

## 重要な設定
- `output: "export"` + `basePath: "/mogumogu-paimon"` — `webapp/next.config.ts:1-13`
- 画像パスは必ず `process.env.BASE_PATH` を先頭に付与すること

## Git 規約
`.claude/git-conventions.md` を参照（SSoT）。
- ブランチ: `<type>/<issue-number>-<description>`
- コミット: Conventional Commits 形式 `<type>(<scope>): <description>`（英語・命令形・小文字・ピリオドなし）

## テスト方針
- テストは `webapp/src/lib/__tests__/` に配置（Vitest）
- TDD 必須 — 新ロジック追加時は先にテストを書く

## 詳細ドキュメント
タスクに関連するファイルを作業開始前に読み込むこと。

| ファイル | 内容 |
|---|---|
| `docs/dev/repository_structure.md` | リポジトリ構成・ディレクトリ役割 |
| `docs/dev/component_design.md` | コンポーネント設計・フィルタ・スコア色分け |
| `docs/dev/scoring.md` | スコア計算方式・主要関数の仕様 |
| `.claude/git-conventions.md` | ブランチ命名・コミットメッセージ規約 |
| `.claude/workflow-config.json` | TDD・品質ゲート・自動報告の設定 |
| `docs/GOOD_Format_Specification.md` | GOOD フォーマット仕様 |
| `docs/Artifact_Specification.md` | 聖遺物仕様 |
| `docs/Artifact_Enhancement.md` | 強化ロール計算の仕様 |
| `docs/Substat_Rolls_Calculation.md` | サブステロール数計算ロジック |
| `docs/VALIDATION_REPORT.md` | 計算ロジック検証レポート |
| `.github/workflows/deploy.yml` | GitHub Pages デプロイ（main push で自動実行） |
