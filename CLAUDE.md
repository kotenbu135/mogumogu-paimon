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

コミット前に必須: `cd webapp && npm run lint -- --fix && npm run typecheck && npm test`

## 重要な設定
- 静的エクスポート: `output: "export"` + `basePath: "/mogumogu-paimon"` — `webapp/next.config.ts`
- 画像パスは必ず `process.env.BASE_PATH` を先頭に付与すること

## Git 規約
- ブランチ: `<type>/<issue-number>-<description>`
- コミット: Conventional Commits 形式（英語・命令形・小文字・ピリオドなし）
- 詳細: `.claude/git-conventions.md`

## テスト方針
- `webapp/src/lib/__tests__/` に配置（Vitest）
- TDD 必須 — 新ロジック追加時は先にテストを書く

## ドキュメント（タスク開始前に関連ファイルを読み込むこと）

| ファイル | 内容 |
|---|---|
| `docs/dev/scoring.md` | スコア計算・再構築成功率の実装仕様 |
| `docs/dev/component-design.md` | コンポーネント設計・スコア色分け |
| `docs/spec/good-format.md` | GOOD フォーマット仕様 |
| `docs/spec/artifact.md` | 聖遺物仕様 |
| `docs/spec/enhancement.md` | 強化ロール計算仕様 |
| `docs/spec/substat-rolls.md` | サブステロール数計算ロジック |
