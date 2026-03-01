# リポジトリ構成

```
mogumogu-paimon/
├── webapp/                    # Next.js フロントエンドアプリ（メイン実装）
│   ├── src/
│   │   ├── app/               # Next.js App Router ページ
│   │   │   ├── layout.tsx     # 共通レイアウト（Sidebar 含む）
│   │   │   ├── page.tsx       # メインページ（ファイル読み込み・カードグリッド）
│   │   │   ├── about-score/   # スコアについて説明ページ
│   │   │   ├── how-to-use/    # 使い方ページ
│   │   │   ├── faq/           # よくある質問ページ
│   │   │   └── disclaimer/    # 免責事項ページ
│   │   ├── components/        # React コンポーネント
│   │   │   ├── ArtifactCard.tsx   # 聖遺物カード表示
│   │   │   ├── FileUpload.tsx     # GOOD JSON ドラッグ＆ドロップ / ファイル選択
│   │   │   ├── Sidebar.tsx        # サイドナビゲーション
│   │   │   └── ContextMenu.tsx    # クリックフィルタメニュー
│   │   └── lib/               # ロジック・ユーティリティ
│   │       ├── types.ts           # GOOD フォーマット型定義・アプリ内型定義
│   │       ├── scoring.ts         # スコア計算ロジック（中核）
│   │       ├── constants.ts       # 日本語マッピング・メインステ値テーブル
│   │       ├── contextMenu.ts     # コンテキストメニュー項目生成
│   │       ├── sidebarItems.ts    # サイドバー項目定義
│   │       └── __tests__/         # Vitest テストファイル
│   ├── public/
│   │   ├── artifacts/         # 聖遺物セット別アイコン画像（部位ごと PNG）
│   │   └── chars/             # キャラクターアイコン画像
│   ├── next.config.ts         # Next.js 設定（output: export, basePath）
│   └── package.json           # 依存関係・スクリプト定義
├── docs/                      # 仕様ドキュメント
│   ├── dev/                   # 開発者向けドキュメント（本ファイル含む）
│   ├── GOOD_Format_Specification.md
│   ├── Artifact_Specification.md
│   ├── Artifact_Enhancement.md
│   ├── Substat_Rolls_Calculation.md
│   └── VALIDATION_REPORT.md
├── sample/sample_code/        # Python サンプルスクリプト
├── .claude/                   # Claude Code 設定
│   ├── git-conventions.md     # Git 規約（SSoT）
│   ├── workflow-config.json   # ワークフロー設定
│   ├── agents/                # AI エージェント定義
│   └── skills/                # カスタムスキル定義
├── .github/workflows/deploy.yml  # GitHub Pages デプロイ
├── AGENTS.md                  # AI エージェント向け基本指示
└── CLAUDE.md                  # プロジェクトガイドライン（エントリポイント）
```
