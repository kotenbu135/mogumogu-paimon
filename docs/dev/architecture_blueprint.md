# もぐもぐパイモン — アーキテクチャブループリント

> 最終更新: 2026-03-06

---

## 1. プロジェクト概要

**もぐもぐパイモン**は、原神の聖遺物スコアを GOOD フォーマット JSON から計算・ランキング表示する静的 Web アプリです。GitHub Pages にデプロイされ、サーバーサイド処理は一切なく、すべての計算はクライアント側で完結します。

### 目的
- GOOD フォーマット（ゲーム外ツールが出力する聖遺物データ標準フォーマット）をアップロードするだけで即座にスコア確認
- 複数スコアタイプ（CV・攻撃型・HP型など）でのランキング・フィルタリング
- 再構築シミュレーション（強化ロールの再割り振り成功率算出）

---

## 2. 技術スタック

| カテゴリ | 技術 | バージョン |
|---|---|---|
| フレームワーク | Next.js (App Router) | 16.1.6 |
| UI ライブラリ | React | 19.2.3 |
| 言語 | TypeScript | ^5 |
| スタイリング | Tailwind CSS | ^4 |
| テスト | Vitest | ^4.0.18 |
| ランタイム | Node.js | 25 |
| デプロイ | GitHub Pages (静的エクスポート) | — |

---

## 3. アーキテクチャ概要

本アプリは **クライアントサイドのみ動作する SPA（シングルページアプリケーション）** です。
Next.js の `output: "export"` により静的ファイルとしてビルドされ、サーバーは不要です。

```
┌─────────────────────────────────────────────────────────┐
│                     ブラウザ（ユーザー）                  │
│                                                          │
│  ┌──────────────┐    ┌─────────────────────────────┐    │
│  │  FileUpload  │───>│         page.tsx             │    │
│  │  (JSON投入)  │    │   (状態管理・フィルタ制御)   │    │
│  └──────────────┘    └──────────┬──────────────────┘    │
│                                  │                        │
│                    ┌─────────────▼──────────┐            │
│                    │      lib/ (ロジック層)  │            │
│                    │  scoring.ts            │            │
│                    │  reconstruction.ts     │            │
│                    │  constants.ts          │            │
│                    └─────────────┬──────────┘            │
│                                  │                        │
│                    ┌─────────────▼──────────┐            │
│                    │   ArtifactCard × N     │            │
│                    │   (スコア・サブステ表示) │            │
│                    └────────────────────────┘            │
└─────────────────────────────────────────────────────────┘
          ↕ (build time / deploy)
┌─────────────────────────────────────────────────────────┐
│            GitHub Pages (静的ファイルホスティング)        │
│            basePath: /mogumogu-paimon                    │
└─────────────────────────────────────────────────────────┘
```

---

## 4. ディレクトリ構造

```
mogumogu-paimon/
├── webapp/                          # メイン実装（Next.js アプリ）
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── layout.tsx           # 共通レイアウト（Sidebar 含む）
│   │   │   ├── page.tsx             # メインページ（全状態管理の中枢）
│   │   │   ├── about-score/         # スコア説明ページ
│   │   │   ├── about-reconstruction/ # 再構築説明ページ
│   │   │   ├── how-to-use/          # 使い方ページ
│   │   │   ├── faq/                 # FAQ ページ
│   │   │   └── disclaimer/          # 免責事項ページ
│   │   ├── components/              # React コンポーネント
│   │   │   ├── ArtifactCard.tsx     # 聖遺物カード（スコア・サブステ表示）
│   │   │   ├── FileUpload.tsx       # GOOD JSON 取り込み UI
│   │   │   ├── Sidebar.tsx          # ナビゲーション
│   │   │   └── ContextMenu.tsx      # 右クリック/クリックメニュー
│   │   └── lib/                     # ビジネスロジック層
│   │       ├── types.ts             # 全型定義（GOOD フォーマット準拠）
│   │       ├── scoring.ts           # スコア計算（中核ロジック）
│   │       ├── reconstruction.ts    # 再構築成功率計算
│   │       ├── constants.ts         # 日本語マッピング・定数テーブル
│   │       ├── contextMenu.ts       # コンテキストメニュー生成
│   │       ├── sidebarItems.ts      # サイドバー項目定義
│   │       └── __tests__/           # Vitest テスト（TDD）
│   ├── public/
│   │   ├── artifacts/               # 聖遺物セット別アイコン（部位ごと PNG）
│   │   └── chars/                   # キャラクターアイコン画像
│   ├── next.config.ts               # 静的エクスポート・basePath 設定
│   └── package.json
├── docs/                            # ドキュメント群
│   ├── dev/                         # 開発者向け（本ファイル含む）
│   ├── GOOD_Format_Specification.md
│   ├── Artifact_Specification.md
│   ├── Artifact_Enhancement.md
│   ├── Substat_Rolls_Calculation.md
│   └── VALIDATION_REPORT.md
├── sample/                          # Python サンプルスクリプト・サンプルデータ
├── .claude/                         # Claude Code 設定（スキル・規約）
├── .github/workflows/
│   ├── deploy.yml                   # GitHub Pages 自動デプロイ
│   └── claude.yml                   # Claude Code 自動化
└── CLAUDE.md                        # プロジェクトガイドライン
```

---

## 5. レイヤー設計

本アプリは以下の 3 層に分かれています。

```
┌───────────────────────────────────────┐
│  プレゼンテーション層（components/）   │
│  ArtifactCard / FileUpload /          │
│  Sidebar / ContextMenu               │
├───────────────────────────────────────┤
│  ページ層（app/page.tsx）             │
│  全状態管理・フィルタ・ソートロジック  │
├───────────────────────────────────────┤
│  ロジック層（lib/）                   │
│  scoring / reconstruction /          │
│  constants / types                   │
└───────────────────────────────────────┘
```

### 各層の責務

| 層 | 責務 | 主要ファイル |
|---|---|---|
| プレゼンテーション | UI 表示・ユーザー操作受付 | `components/*.tsx` |
| ページ | 状態保持・フィルタ・ソート | `app/page.tsx` |
| ロジック | 計算・型・定数 | `lib/*.ts` |

---

## 6. コンポーネント設計

### コンポーネント関係図

```
layout.tsx
├── Sidebar
│   └── sidebarItems.ts（項目定義）
└── {children} = page.tsx
    ├── FileUpload
    │   └── GOOD JSON 読み込み → handleLoad()
    ├── [コントロールバー]
    │   ├── スコアタイプ選択
    │   ├── セットフィルタ（ContextMenu）
    │   ├── 部位フィルタ
    │   ├── メインステフィルタ
    │   ├── サブステフィルタ（ContextMenu）
    │   └── 再構築設定
    └── ArtifactCard × N（グリッド表示）
        └── ContextMenu（クリック時）
```

### 主要コンポーネント詳細

#### `ArtifactCard.tsx`
- 聖遺物 1 件の情報をカード形式で表示
- スコア・各サブステ値・強化ロール数・再構築成功率を表示
- スコア色分け:
  - `>= 55` → 赤 (`text-red-400`)
  - `>= 45` → オレンジ (`text-orange-400`)
  - `>= 35` → 黄 (`text-yellow-400`)
  - それ以下 → 白
- 聖遺物画像クリック → セット・部位フィルタ用 `ContextMenu` 表示
- キャラアイコンクリック → 装備セットフィルタ用 `ContextMenu` 表示

#### `FileUpload.tsx`
- ドラッグ＆ドロップまたはファイル選択で GOOD JSON を受け付ける
- `compact` prop で再アップロード用の小型表示に切替可能
- JSON パース → `GoodFile` 型バリデーション → `onLoad` コールバック呼出

#### `ContextMenu.tsx`
- 汎用クリックポップアップメニュー
- `createPortal` で `document.body` に描画（z-index 問題を回避）
- 項目生成ロジックは `lib/contextMenu.ts` に分離

---

## 7. データフロー

```
ユーザー操作（JSONアップロード）
        │
        ▼
FileUpload.onLoad(GoodFile)
        │
        ▼
buildRankedList(data: GoodFile): RankedArtifact[]
  ├── artifacts.filter(rarity === 5)  ← ★5のみ抽出
  ├── calculateScores()               ← CV・最良スコア算出
  ├── calculateAllScores()            ← 全タイプのスコア算出
  └── estimateRollCounts()            ← 強化ロール数推定
        │
        ▼
[状態: allRanked]
        │
        ▼
useMemo: フィルタ + ソート（displayed）
  ├── セットフィルタ（filterSets）
  ├── 部位フィルタ（filterSlot）
  ├── メインステフィルタ（filterMainStat）
  ├── サブステフィルタ（filterSubStats, AND条件）
  ├── 初期OPフィルタ（filterInitialOp）
  └── ソート（スコア順 / サブステ値順 / 再構築成功率順）
        │
        ▼
ArtifactCard × N（グリッド描画）
```

---

## 8. スコア計算システム

実装: `webapp/src/lib/scoring.ts`

### スコアタイプ一覧

| タイプ | 計算式 |
|---|---|
| CV | 会心率 × 2 + 会心ダメージ |
| 攻撃型 | CV + 攻撃力% × 1.0 |
| HP型 | CV + HP% × 1.0 |
| 防御型 | CV + 防御力% × 0.8 |
| 熟知型 | CV + 元素熟知 × 0.25 |
| チャージ型 | CV + 元素チャージ効率 × 0.9 |
| 最良型 | 上記 6 タイプの最高値 |

### 主要関数

| 関数 | 説明 |
|---|---|
| `calculateScores()` | CV スコアと最良スコア（型名付き）を返す |
| `calculateAllScores()` | 全スコアタイプのスコアをまとめて返す |
| `estimateRollCounts()` | 強化ロール数を推定（バックトラッキング → フォールバック平均値） |
| `decomposeRolls()` | サブステの値をティア値の和として分解する |

---

## 9. 再構築成功率システム

実装: `webapp/src/lib/reconstruction.ts`

再構築によりスコアが向上する確率を多項分布ベースで算出します。

### 計算フロー

```
強化 N 回を 4 サブステに振り分ける全パターン列挙（多項分布）
        │
        ▼
保証条件フィルタ（選択2サブステへの合計ロール数 >= 閾値）
        │
        ▼
各パターンの再構築後スコアを期待値ベースで算出
        │
        ▼
現在スコアを上回るパターンの正規化確率を合計 → 成功率（%）
```

### 再構築種別と保証閾値

| 種別 | 保証閾値 |
|---|---|
| 通常再構築 | 合計 2 回以上 |
| 上級再構築 | 合計 3 回以上 |
| 絶対再構築 | 合計 4 回以上 |

### 成功率の表示色（ArtifactCard）

| 成功率 | 色 |
|---|---|
| 70% 以上 | 赤 |
| 50% 以上 | オレンジ |
| 50% 未満 | グレー |

---

## 10. 型システム

実装: `webapp/src/lib/types.ts`

### 主要型定義

```typescript
// GOOD フォーマット準拠の聖遺物データ
interface Artifact {
  setKey: string          // 聖遺物セット名（英語キー）
  slotKey: ArtifactSlotKey // 部位: flower / plume / sands / goblet / circlet
  level: number           // 強化レベル (0-20)
  rarity: number          // レアリティ (1-5)
  mainStatKey: string     // メインステータスキー
  location: string        // 装備キャラクター名
  lock: boolean           // ロック状態
  substats: Substat[]     // サブステータス配列
  totalRolls: number      // 総強化ロール数
}

// ランキング表示用（計算結果付き）
interface RankedArtifact {
  artifact: Artifact
  cvScore: number
  bestScore: number
  bestType: string
  allScores: Record<ScoreTypeName, number>
  rollCounts: number[]    // 各サブステの強化ロール数
}
```

---

## 11. 状態管理

`app/page.tsx` で React の `useState` / `useMemo` を使ったシンプルなローカル状態管理を採用しています。
外部状態管理ライブラリ（Redux・Zustand 等）は使用しません。

### 状態一覧

| 状態 | 型 | 説明 |
|---|---|---|
| `allRanked` | `RankedArtifact[] \| null` | アップロード済み聖遺物の全スコア計算結果 |
| `scoreType` | `ScoreTypeName` | 選択中のスコアタイプ |
| `filterSets` | `string[]` | セットフィルタ（複数選択可） |
| `filterSlot` | `ArtifactSlotKey \| ''` | 部位フィルタ |
| `filterMainStat` | `string` | メインステフィルタ |
| `filterSubStats` | `StatKey[]` | サブステフィルタ（AND 条件） |
| `filterInitialOp` | `'' \| '3' \| '4'` | 初期 OP 数フィルタ |
| `subStatSort` | `StatKey \| ''` | サブステソートキー |
| `reconType` | `ReconstructionType` | 再構築種別 |
| `reconSort` | `boolean` | 再構築成功率順ソート |

### 派生値（useMemo）

| 派生値 | 説明 |
|---|---|
| `setOptionGroups` | セットフィルタ用グループ化オプション |
| `mainStatOptions` | データに存在するメインステ一覧 |
| `equippedSetsMap` | キャラ名 → 装備セットキーのマップ |
| `reconRates` | 各聖遺物の再構築成功率マップ |
| `displayed` | フィルタ・ソート済み表示リスト |

---

## 12. スタイリング戦略

- **Tailwind CSS 4** を使用したユーティリティファーストのスタイリング
- カスタムクラス名（`main-container`・`card-grid` 等）は `app/globals.css` で定義
- ダークテーマベース（背景: ダークグレー系、テキスト: ホワイト系）
- レスポンシブグリッドレイアウト（`card-grid`）
- 画像パスは必ず `process.env.BASE_PATH` を先頭に付与（GitHub Pages の basePath 対応）

---

## 13. テスト戦略

- **フレームワーク**: Vitest 4
- **配置**: `webapp/src/lib/__tests__/`
- **方針**: TDD — 新ロジック追加時はテストを先に書く
- UI コンポーネントのテストは現在対象外（ロジック層を重点的にテスト）

### テストファイル一覧

| ファイル | テスト対象 |
|---|---|
| `scoringFormulas.test.ts` | スコア計算式の正確性 |
| `calculateAllScores.test.ts` | 全スコアタイプの計算 |
| `reconstruction.test.ts` | 再構築成功率計算 |
| `contextMenu.test.ts` | コンテキストメニュー項目生成 |
| `sidebarItems.test.ts` | サイドバー項目定義 |
| `groupSetOptions.test.ts` | セットオプションのグループ化 |
| `getEffectiveStats.test.ts` | 有効ステータス取得 |
| `mainStat.test.ts` | メインステータス計算 |

---

## 14. CI/CD パイプライン

実装: `.github/workflows/deploy.yml`

```
git push → main
     │
     ▼
GitHub Actions: build ジョブ
  ├── actions/checkout
  ├── actions/setup-node (Node.js 25)
  ├── npm ci (webapp/)
  └── npm run build → webapp/out/
     │
     ▼
GitHub Actions: deploy ジョブ
  └── actions/deploy-pages → GitHub Pages
```

### 品質ゲート（ローカル、コミット前）

```bash
cd webapp
npm run lint -- --fix    # ESLint
npm run typecheck        # TypeScript 型チェック
npm test                 # Vitest
```

---

## 15. 静的エクスポート設定

実装: `webapp/next.config.ts`

```typescript
const nextConfig: NextConfig = {
  output: "export",              // 静的 HTML/CSS/JS 出力
  basePath: "/mogumogu-paimon",  // GitHub Pages サブパス対応
  env: {
    BASE_PATH: "/mogumogu-paimon", // 画像パス生成用環境変数
  },
}
```

**重要**: 静的エクスポートのため、以下の Next.js 機能は使用不可
- サーバーサイドレンダリング (`getServerSideProps`)
- API Routes
- Image Optimization（`<Image>` の `unoptimized` が必要）

---

## 16. セキュリティ

- **XSS 対策**: JSON データは直接 DOM に挿入せず、React の仮想 DOM 経由で描画
- **外部通信なし**: すべての処理はクライアントサイドで完結。ユーザーデータはサーバーに送信されない
- **CSP**: GitHub Pages のデフォルト設定を使用
- **依存関係**: `npm audit` で定期的なセキュリティチェックを推奨

---

## 17. 拡張性と今後の設計指針

### 新しいスコアタイプの追加
1. `lib/types.ts` の `ScoreTypeName` に型を追加
2. `lib/scoring.ts` の計算式を追加
3. `lib/constants.ts` の `SCORE_TYPE_FORMULAS` にラベル・式文字列を追加
4. テスト追加

### 新しいフィルタの追加
1. `app/page.tsx` に `useState` で状態追加
2. `displayed` の `useMemo` にフィルタ条件追加
3. コントロールバーに UI 追加

### 新しいページの追加
1. `app/[page-name]/page.tsx` を作成（App Router の規約に従う）
2. `lib/sidebarItems.ts` にナビゲーション項目を追加

---

## 関連ドキュメント

| ドキュメント | 内容 |
|---|---|
| `docs/GOOD_Format_Specification.md` | GOOD フォーマット仕様 |
| `docs/Artifact_Specification.md` | 聖遺物仕様 |
| `docs/Artifact_Enhancement.md` | 強化ロール計算の仕様 |
| `docs/Substat_Rolls_Calculation.md` | サブステロール数計算ロジック |
| `docs/VALIDATION_REPORT.md` | 計算ロジック検証レポート |
| `docs/dev/repository_structure.md` | リポジトリ構成 |
| `docs/dev/component_design.md` | コンポーネント設計 |
| `docs/dev/scoring.md` | スコア計算方式 |
| `.claude/git-conventions.md` | Git 規約 |
