# もぐもぐパイモン — CLAUDE.md

## 言語設定
- **基本的な受け答えは全て日本語で行うこと**
- コメント・ドキュメント・エラーメッセージ: 日本語
- 変数名・関数名: 英語

## 技術スタック
Next.js 16（App Router）/ TypeScript 5 / React 19 / Tailwind CSS 4 / Vitest 4 / Node.js 25

## 開発コマンド（`webapp/` で実行）
```bash
npm run dev          # 開発サーバー
npm run typecheck    # 型チェック
npm run lint -- --fix
npm test
npm run build        # out/ に出力
```

### E2E テスト（`webapp/` で実行）
```bash
npm run test:e2e            # Playwright E2E テスト
npm run test:e2e:update     # スナップショット更新
npm run screenshot          # スクリーンショット撮影
```

コミット前に必須: `cd webapp && npm run lint -- --fix && npm run typecheck && npm test`

## ディレクトリ構造
```
webapp/src/
├── app/           # Next.js App Router ページ
├── components/    # UI コンポーネント（ArtifactCard, FileUpload 等）
├── hooks/         # カスタムフック（データ取得・フィルタ・表示制御）
├── lib/           # ビジネスロジック（スコア計算・バリデーション・定数）
│   └── __tests__/ # Vitest テスト
└── test-setup.ts  # テスト共通セットアップ
```

## 重要な設定
- 静的エクスポート: `output: "export"` + `basePath: "/mogumogu-paimon"` — `webapp/next.config.ts`
- 画像パスは必ず `process.env.BASE_PATH` を先頭に付与すること

## Git 規約
- ブランチ: `<type>/<issue-number>-<description>`
- コミット: Conventional Commits 形式（英語・命令形・小文字・ピリオドなし）
- 詳細: `.claude/git-conventions.md`

## CI/CD
- GitHub Actions: `.github/workflows/` に設定
- PR 作成時: lint・typecheck・test・E2E が自動実行
- `main` マージ時: GitHub Pages へ自動デプロイ
- prebuild で画像の WebP 変換が自動実行される

## テスト方針
- `webapp/src/lib/__tests__/` に配置（Vitest）
- TDD 必須 — 新ロジック追加時は先にテストを書く

## スキル・サブエージェント使用報告
- スキル（Skill ツール）またはサブエージェント（Agent ツール）を使用した場合、**応答の末尾に必ず使用一覧を報告すること**
- 複数使用した場合はすべて列挙する
- 報告形式（応答末尾に追記）:
  ```
  ---
  🛠️ 使用スキル: skill-name
  🤖 使用サブエージェント: agent-name
  ```

## ドキュメント（タスク開始前に関連ファイルを読み込むこと）

| ファイル | 内容 |
|---|---|
| `docs/dev/scoring.md` | スコア計算・再構築成功率の実装仕様 |
| `docs/dev/component-design.md` | コンポーネント設計・スコア色分け |
| `docs/spec/good-format.md` | GOOD フォーマット仕様 |
| `docs/spec/artifact.md` | 聖遺物仕様 |
| `docs/spec/enhancement.md` | 強化ロール計算仕様 |
| `docs/spec/substat-rolls.md` | サブステロール数計算ロジック |
