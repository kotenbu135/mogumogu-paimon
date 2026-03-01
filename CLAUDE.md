# リポジトリ運用ガイドライン

## 言語設定 (Language Configuration)
このプロジェクトは日本語環境での動作を前提とする。
基本的な受け答えは、全て日本語で行うこと。

- **コミュニケーション**: 日本語で対応
- **コメント**: コードコメントは日本語で記述
- **ドキュメント**: 技術文書は日本語で作成
- **エラーメッセージ**: 可能な限り日本語で表示
- **変数名・関数名**: 英語を使用（国際的な慣例に従う）

---

## プロジェクト概要

**もぐもぐパイモン** は、原神（Genshin Impact）の聖遺物スコアを GOOD フォーマットから計算・ランキング表示する Web アプリ。

- GOOD フォーマット（Genshin Optimizer Object Data）の JSON をドラッグ＆ドロップで読み込む
- ★5 聖遺物をスコア順にカードグリッドで表示する
- スコアタイプ・セット・部位によるフィルタ機能を持つ
- GitHub Pages へ静的ファイルとしてデプロイされる

---

## リポジトリ構成

```
mogumogu-paimon/
├── webapp/                    # Next.js フロントエンドアプリ（メイン実装）
│   ├── src/
│   │   ├── app/               # Next.js App Router ページ
│   │   │   ├── layout.tsx     # 共通レイアウト（サイドバー含む）
│   │   │   ├── page.tsx       # メインページ（ファイル読み込み・カードグリッド）
│   │   │   ├── about-score/   # スコアについて説明ページ
│   │   │   ├── how-to-use/    # 使い方ページ
│   │   │   ├── faq/           # よくある質問ページ
│   │   │   └── disclaimer/    # 免責事項ページ
│   │   ├── components/        # React コンポーネント
│   │   │   ├── ArtifactCard.tsx   # 聖遺物カード表示（スコア・サブステ・ロール数）
│   │   │   ├── FileUpload.tsx     # GOOD JSON ドラッグ＆ドロップ / ファイル選択
│   │   │   ├── Sidebar.tsx        # サイドナビゲーション
│   │   │   └── ContextMenu.tsx    # 右クリックフィルタメニュー
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
│   ├── next.config.ts         # Next.js 設定（output: export, basePath 設定）
│   └── package.json           # 依存関係・スクリプト定義
├── docs/                      # ドキュメント
│   ├── GOOD_Format_Specification.md  # GOOD フォーマット仕様書
│   ├── Artifact_Specification.md     # 聖遺物仕様書
│   ├── Artifact_Enhancement.md       # 強化ロール計算の仕様
│   ├── Substat_Rolls_Calculation.md  # サブステロール数計算ロジック
│   └── VALIDATION_REPORT.md          # 計算ロジック検証レポート
├── sample/
│   └── sample_code/
│       └── recommend_reroll_artifacts.py  # 再構築おすすめ分析（Python サンプル）
├── .claude/                   # Claude Code 設定
│   ├── git-conventions.md     # Git ブランチ・コミットメッセージ規約（SSoT）
│   ├── workflow-config.json   # ワークフロー設定（TDD・品質ゲート・自動報告）
│   ├── agents/                # AI エージェント定義
│   └── skills/                # カスタムスキル定義
├── .github/workflows/
│   └── deploy.yml             # GitHub Pages デプロイワークフロー
├── AGENTS.md                  # AI エージェント向け基本指示（CLAUDE.md と共有）
└── CLAUDE.md                  # このファイル
```

---

## 技術スタック

| 項目 | 詳細 |
|------|------|
| フレームワーク | Next.js 16（App Router） |
| 言語 | TypeScript 5 |
| UI | React 19 + Tailwind CSS 4 |
| テスト | Vitest 4 |
| デプロイ | GitHub Pages（静的エクスポート） |
| Node.js | 25（CI/CD） |

### 重要な設定

- **`output: "export"`**: 静的サイト出力（`npm run build` で `webapp/out/` に生成）
- **`basePath: "/mogumogu-paimon"`**: GitHub Pages のサブパス対応。画像 URL 等に `process.env.BASE_PATH` を使用
- **ESLint**: `next lint` を使用（`npm run lint`）
- **型チェック**: `tsc --noEmit`（`npm run typecheck`）

---

## スコア計算方式

スコア計算の中核は `webapp/src/lib/scoring.ts` に実装されている。

| スコアタイプ | 計算式 |
|---|---|
| **CVスコア** | 会心率×2 + 会心ダメージ |
| **HP型** | CV + HP%×1.0 |
| **攻撃型** | CV + 攻撃力%×1.0 |
| **防御型** | CV + 防御力%×0.8 |
| **熟知型** | CV + 元素熟知×0.25 |
| **チャージ型** | CV + 元素チャージ×0.9 |
| **最良型** | 上記6タイプのうち最高値 |

### 主要エクスポート関数

```ts
// CVスコアと最良スコア（型名付き）を返す
calculateScores(artifact: Artifact): ScoreResult

// 全スコアタイプのスコアをまとめて返す
calculateAllScores(artifact: Artifact): Record<ScoreTypeName, number>

// 強化ロール数を推定する（バックトラッキング → フォールバック平均値）
estimateRollCounts(artifact: Artifact): number[]

// サブステの値をティア値の和として分解する
decomposeRolls(key: StatKey, totalValue: number, numRolls: number): number[] | null
```

---

## 開発ワークフロー

### ローカル開発

すべてのコマンドは `webapp/` ディレクトリで実行する。

```bash
cd webapp

# 開発サーバー起動
npm run dev

# 型チェック
npm run typecheck

# Lint（自動修正あり）
npm run lint -- --fix

# テスト実行
npm test

# 本番ビルド（out/ に静的ファイル生成）
npm run build
```

### 品質ゲート

`.claude/workflow-config.json` の設定に従い、以下を必須とする。

- **TDD**: `tdd_required: true` — 実装前にテストを書く
- **品質ゲート**: `quality_gate_required: true` — コミット前に全チェックを通す
- **自動報告**: `auto_report: true` — GitHub Issues への進捗報告

コミット前に必ず以下を実行すること（`webapp/` ディレクトリで）:

```bash
npm run lint -- --fix && npm run typecheck && npm test
```

---

## Git 規約

詳細は `.claude/git-conventions.md` を参照（Single Source of Truth）。

### ブランチ命名

```
<type>/<issue-number>-<description>
```

| タイプ | プレフィックス | 用途 |
|--------|--------------|------|
| 機能追加 | `feat/` | 新機能実装 |
| バグ修正 | `fix/` | バグ修正 |
| リファクタ | `refactor/` | コード整理 |
| ドキュメント | `docs/` | ドキュメント更新 |
| テスト | `test/` | テスト追加・修正 |
| その他 | `chore/` | 設定変更・依存更新 |

**例**: `feat/123-add-user-authentication`、`fix/456-fix-login-error`

### コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) 形式:

```
<type>(<scope>): <description>
```

- description は **英語・命令形・小文字・ピリオドなし**
- 例: `feat(#123): add artifact filter by character`

### Git Worktree

```
../<project-name>-<branch-name>
```

ブランチ名の `/` は `-` に置換する。

---

## デプロイ

`.github/workflows/deploy.yml` による GitHub Pages への自動デプロイ。

- **トリガー**: `main` ブランチへの push または手動実行
- **ビルド**: `webapp/` で `npm ci && npm run build`
- **成果物**: `webapp/out/` を GitHub Pages に配置

---

## コンポーネント設計の注意点

### 画像パス

聖遺物・キャラクター画像は `public/` 配下にある。パスは必ず `process.env.BASE_PATH` を先頭に付与すること。

```ts
const bp = process.env.BASE_PATH ?? ''
const src = `${bp}/artifacts/${setKey}/${slotKey}.png`
```

### フィルタ機能

- 聖遺物画像クリック → セット・部位フィルタメニュー
- キャラアイコンクリック → そのキャラの装備セットでフィルタ

### スコア色分け

```ts
score >= 55 → text-red-400    // 非常に高い
score >= 45 → text-orange-400 // 高い
score >= 35 → text-yellow-400 // 普通
それ以下    → text-white
```

---

## テスト方針

テストファイルは `webapp/src/lib/__tests__/` 配下に置く（Vitest を使用）。

- `calculateAllScores.test.ts` — 全スコアタイプ計算
- `scoringFormulas.test.ts` — スコア計算式定数
- `mainStat.test.ts` — メインステータス値計算
- `contextMenu.test.ts` — コンテキストメニュー項目生成
- `sidebarItems.test.ts` — サイドバー項目定義

新しいロジックを追加する際は必ず対応するテストを `__tests__/` に追加すること。

---

## GOOD フォーマット

GOOD（**G**enshin **O**ptimizer **O**bject **D**ata）は、原神データを JSON 形式で交換するための標準フォーマット（Genshin Optimizer v6.0.0 以降）。

詳細仕様は `docs/GOOD_Format_Specification.md` を参照。

### 本アプリで利用する主要フィールド

```ts
interface Artifact {
  setKey: string         // 聖遺物セット識別子（英語 PascalCase）
  slotKey: ArtifactSlotKey  // 'flower' | 'plume' | 'sands' | 'goblet' | 'circlet'
  level: number          // 強化レベル（0-20）
  rarity: number         // レアリティ（3-5）★5のみスコア対象
  mainStatKey: string    // メインステータスキー
  location: string       // 装備キャラ名（未装備は空文字）
  lock: boolean          // ロック状態
  substats: Substat[]    // サブステータス配列（最大4個）
  totalRolls: number     // サブステロール総数
}
```

---

## `.claudeignore` 設定

以下はコンテキストから除外される（Claude Code が読まない）:

- `**/node_modules/` — 依存関係
- `**/dist/`, `**/build/`, `**/.next/` — ビルド成果物
- `**/*.log`, `**/.cache/` — ログ・キャッシュ
- `**/generated/`, `**/*.min.js`, `**/*.map` — 自動生成ファイル
- `**/.env*`, `**/secrets/` — 機密情報
