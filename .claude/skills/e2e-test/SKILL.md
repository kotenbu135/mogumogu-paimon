---
name: e2e-test
description: '指定した画面・コンポーネントの Playwright E2E テストシナリオを生成するスキル。/e2e-test を実行してテスト自動生成を行う。'
---

# E2E テスト生成スキル

指定した画面・コンポーネントの Playwright E2E テストシナリオを生成します。

## 実行フロー

以下の3ステップを順番に実行すること。

---

## ステップ 1: 対象の特定とコード読み込み

対象ページ/コンポーネントが引数で指定されていない場合は `AskUserQuestion` でユーザーに確認する。

確認する内容:
- テスト対象ページ/コンポーネント（例: トップページ、ArtifactCard、ControlsBar）
- テストしたい主な操作・シナリオ（例: フィルター操作、ファイルアップロード、スコア表示）

対象が決まったら Agent ツールで以下を実行する（`context: fork`）:

```
以下の情報を収集してください。

1. CLAUDE.md を読み込み、プロジェクト設定（basePath, 開発コマンド等）を確認する
2. 対象コンポーネント/ページのソースを読み込む:
   - webapp/src/app/ 配下の対象ページ
   - webapp/src/components/ 配下の対象コンポーネント
3. 以下を分析・一覧化する:
   - ユーザーインタラクション（クリック・入力・ドラッグ等）
   - 表示される UI 要素（ボタン・カード・フィルター・スコア等）
   - data-testid 属性の有無（なければ追加提案リストを作成）
   - process.env.BASE_PATH を使用した URL 設定箇所

完了後、以下を報告してください:
- 対象ファイルパス一覧
- 検出したインタラクション一覧
- data-testid が不足している要素の一覧（なければ「なし」）
- テストシナリオ案（箇条書き）
```

---

## ステップ 2: E2E テストファイルの生成

ステップ 1 の分析結果をもとに `webapp/tests/e2e/` に `*.spec.ts` を生成する。

### テストファイル命名規則

```
webapp/tests/e2e/<対象コンポーネント名>.spec.ts
```

例: `artifact-card.spec.ts`, `controls-bar.spec.ts`, `home.spec.ts`

### テスト生成のポイント

**URL 設定:**
```typescript
const BASE_PATH = process.env.BASE_PATH ?? '';
await page.goto(`${BASE_PATH}/`);
```

**data-testid の活用:**
```typescript
// data-testid が付与されている場合
await page.getByTestId('filter-button').click();

// なければロールやテキストで代替
await page.getByRole('button', { name: 'フィルター' }).click();
```

**テスト構成（主要シナリオ）:**
- フィルター操作: 部位・セット・ステータスのフィルタリングが正常に動作するか
- スコア表示: 聖遺物カードにスコアと色分けが正しく表示されるか
- 聖遺物カード: カード一覧が表示され、各情報が正しくレンダリングされるか
- ファイルアップロード: GOOD 形式ファイルをアップロードして聖遺物が表示されるか

**テストの書き方:**
```typescript
import { test, expect } from '@playwright/test';

const BASE_PATH = process.env.BASE_PATH ?? '';

test.describe('対象コンポーネント名', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_PATH}/`);
  });

  test('シナリオ名', async ({ page }) => {
    // Arrange: 前提条件の設定
    // Act: ユーザー操作
    // Assert: 期待する結果の確認
  });
});
```

---

## ステップ 3: data-testid の追加提案と実行確認

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

`webapp/` ディレクトリで以下を実行して動作確認する:

```bash
npm run test:e2e
```

実行できない場合（Playwright 未設定等）は、セットアップ手順をユーザーに提示する:

```bash
# Playwright のインストール
npm install -D @playwright/test
npx playwright install

# package.json に追加するスクリプト
"test:e2e": "playwright test"
```

### playwright.config.ts の設定例

`webapp/playwright.config.ts` が存在しない場合は以下を参考に作成を提案する:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 完了後の報告

以下を報告すること:
- 生成したテストファイルのパス
- テストケース一覧（シナリオ名）
- 追加した `data-testid` 属性の一覧（あれば）
- テスト実行結果（または未実行の場合はその理由）
