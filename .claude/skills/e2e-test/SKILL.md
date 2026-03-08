---
name: e2e-test
description: '指定した画面・コンポーネントの Playwright E2E テストシナリオを生成・更新するスキル。/e2e-test を実行してテスト自動生成を行う。新機能追加・バグ修正後のリグレッションテスト作成時に使用する。また、UIの改修・コンポーネント変更・スタイル修正によって既存のPlaywrightテストが失敗・破損した場合や、テストコードの修正・メンテナンスが必要な場合にも必ず使用する。「E2Eテストが壊れた」「Playwrightのテストを直して」「テストを更新して」「e2eが通らない」などの依頼にも対応する。また、.tsx/.css ファイルの見た目の変更、Tailwind クラスやスタイルの修正、アニメーション・トランジションの追加、レイアウト変更（flexbox/grid）、レスポンシブ対応、新ページ追加、コンポーネントのデザイン修正、色・フォント・画像の差し替え、ホバーエフェクトやインタラクションの実装など、ブラウザの見た目が変わる変更を行った場合にも必ず使用する。「スクリーンショットを更新して」「スクショを撮って」「画面キャプチャして」などの依頼にも対応する。ロジックのみの変更・型定義のみの追加・テストやドキュメントのみの修正など、画面表示に影響しない変更では使用しない。'
---

# E2E テスト生成スキル

指定した画面・コンポーネントの Playwright E2E テストシナリオを生成し、テスト実行時にスクリーンショットも取得します。

## プロジェクト設定（事前知識）

- **テストディレクトリ**: `webapp/e2e/`（`playwright.config.ts` の `testDir: './e2e'` に対応）
- **baseURL**: `http://localhost:3000/mogumogu-paimon`（設定済み）→ テストでは `page.goto('/')` と書けばよい
- **実行コマンド**: `cd webapp && npm run test:e2e`
- **スナップショット更新**: `cd webapp && npm run test:e2e:update`
- **スクリーンショット更新**: `cd webapp && npm run screenshot`（`playwright.screenshot.config.ts` を使用）
- **スクリーンショット出力先**: `docs/screenshot/`
- **ビューポート**: 3種類（900px・1280px・1920px）で並列実行される

## 実行フロー

---

## ステップ 1: 対象の特定とコード読み込み

対象ページ/コンポーネントが引数で指定されていない場合は `AskUserQuestion` でユーザーに確認する。

確認する内容:
- テスト対象ページ/コンポーネント（例: トップページ、ArtifactCard、ControlsBar）
- テストしたい主な操作・シナリオ（例: フィルター操作、ファイルアップロード、スコア表示）

対象が決まったら Agent ツールで以下を実行する（`context: fork`）:

```
以下の情報を収集してください。

1. 対象コンポーネント/ページのソースを読み込む:
   - webapp/src/app/ 配下の対象ページ
   - webapp/src/components/ 配下の対象コンポーネント
2. 以下を分析・一覧化する:
   - ユーザーインタラクション（クリック・入力・ドラッグ等）
   - 表示される UI 要素（ボタン・カード・フィルター・スコア等）
   - data-testid 属性の有無（なければ追加提案リストを作成）
3. webapp/e2e/ 配下の既存テストファイルを確認し、重複を避ける

完了後、以下を報告してください:
- 対象ファイルパス一覧
- 検出したインタラクション一覧
- data-testid が不足している要素の一覧（なければ「なし」）
- テストシナリオ案（箇条書き）
```

---

## ステップ 2: E2E テストファイルの生成

ステップ 1 の分析結果をもとに `webapp/e2e/` に `*.spec.ts` を生成する。

### テストファイル命名規則

```
webapp/e2e/<対象コンポーネント名>.spec.ts
```

例: `artifact-card.spec.ts`, `controls-bar.spec.ts`, `home.spec.ts`

### テストの書き方

各テストでは操作後に `page.screenshot()` を呼び出してスクリーンショットを取得する。baseURL は playwright.config.ts で設定済みなので、`page.goto('/')` のみでよい。

```typescript
import path from 'path';
import { test, expect } from '@playwright/test';

const SCREENSHOT_DIR = path.join(__dirname, '..', '..', 'docs', 'screenshot');

test.describe('対象コンポーネント名', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('シナリオ名', async ({ page }) => {
    // Arrange: 前提条件の設定
    // Act: ユーザー操作
    // Assert: 期待する結果の確認

    // スクリーンショットを取得
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '<コンポーネント名>_<シナリオ名>.png'),
    });
  });
});
```

### data-testid の活用

```typescript
// data-testid が付与されている場合（優先）
await page.getByTestId('filter-button').click();

// なければロールやテキストで代替
await page.getByRole('button', { name: 'フィルター' }).click();
```

### 主要シナリオ（このプロジェクト固有）

- フィルター操作: 部位・セット・ステータスのフィルタリングが正常に動作するか
- スコア表示: 聖遺物カードにスコアと色分けが正しく表示されるか
- 聖遺物カード: カード一覧が表示され、各情報が正しくレンダリングされるか
- ファイルアップロード: GOOD 形式ファイルをアップロードして聖遺物が表示されるか

---

## ステップ 3: data-testid の追加と実行確認

### data-testid が不足している場合

ステップ 1 で不足が検出された場合、対象コンポーネントに `data-testid` 属性を追加する。

```typescript
// 例: ArtifactCard コンポーネント
<div data-testid="artifact-card">
  <span data-testid="artifact-score">{score}</span>
  <span data-testid="artifact-set-name">{setName}</span>
</div>
```

### テスト実行確認

```bash
cd webapp && npm run test:e2e
```

---

## ステップ 4: docs/screenshot/ のスクリーンショット更新

UIに影響する変更を行った場合、または「スクリーンショットを更新して」「スクショを撮って」などの依頼を受けた場合は、`screenshot.spec.ts` を実行して `docs/screenshot/` のスクリーンショットを更新する。

### Playwright ブラウザのセットアップ

未インストールの場合は先にインストールする:

```bash
cd webapp && npx playwright install chromium
```

### スクリーンショットの撮影・更新

```bash
cd webapp && npm run screenshot
```

このコマンドは `playwright.screenshot.config.ts` を使用し、`screenshot.spec.ts` 内の全テストを実行して `docs/screenshot/` 以下のすべての PNG を上書き更新する。

**失敗した場合の対処:**

- `Error: net::ERR_CONNECTION_REFUSED` → dev サーバーの起動を待ってリトライ（config の `reuseExistingServer: true` で自動再利用）
- セレクタが見つからない → `screenshot.spec.ts` または対象コンポーネントに変更がないか確認する
- タイムアウト → ネットワークや重いビルドが原因の場合が多い。`timeout` を上げるか再実行する

### 更新されたファイルの確認とコミット

```bash
git diff --stat docs/screenshot/
git add docs/screenshot/
git commit -m "docs(screenshot): update screenshots"
```

---

## 完了後の報告

以下を報告すること:
- 生成したテストファイルのパス
- テストケース一覧（シナリオ名）
- 追加した `data-testid` 属性の一覧（あれば）
- テスト実行結果（または未実行の場合はその理由）
- 更新されたスクリーンショットファイルの一覧（スクリーンショット更新を実行した場合）
