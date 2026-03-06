---
name: e2e-test
description: '指定した画面・コンポーネントの Playwright E2E テストシナリオを生成する。'
---

# E2E Test スキル

指定した画面またはコンポーネントの Playwright E2E テストシナリオを生成し、`webapp/tests/e2e/` に配置します。

## 手順

### ステップ 1: 対象を特定する

引数でページ・コンポーネントが指定されていない場合は AskUserQuestion で確認する。

確認事項:
- 対象ページまたはコンポーネント名
- テストしたい主要なユーザーインタラクション

### ステップ 2: Playwright 設定を確認する

`playwright.config.ts`（または `webapp/playwright.config.ts`）を読み込み、以下を確認する:
- `baseURL` の設定（`process.env.BASE_PATH` = `/mogumogu-paimon` を考慮する）
- テスト出力先ディレクトリ
- ブラウザ設定

設定ファイルが存在しない場合は以下の設定を提案する:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: `http://localhost:3000${process.env.BASE_PATH ?? ''}`,
  },
});
```

### ステップ 3: 対象コードを読み込む

Agent ツール（`context: fork`）を使って対象コードを分析する:

```
以下の対象コンポーネント・ページを読み込み、ユーザーインタラクションを分析してください。

対象: {{対象ページ/コンポーネントのパス}}

分析観点:
- ユーザーが操作できる UI 要素（ボタン・フィルター・入力欄等）
- 表示される主要なデータ（スコア・聖遺物カード等）
- data-testid 属性の有無（なければ追加が必要な要素を特定する）
- 状態変化（フィルター適用後の表示変化等）
```

### ステップ 4: E2E テストファイルを生成する

`webapp/tests/e2e/<対象名>.spec.ts` を生成する。

テスト生成のポイント:
- `page.goto()` には `process.env.BASE_PATH` を考慮したパスを使用する
- `data-testid` 属性でセレクターを指定する（なければ追加を提案する）
- フィルター操作・スコア表示・聖遺物カード等の主要 UI を網羅する
- 各テストは独立して実行可能にする（`beforeEach` でページ遷移する）

生成するテストの例:

```ts
import { test, expect } from '@playwright/test';

test.describe('聖遺物一覧ページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('聖遺物カードが表示される', async ({ page }) => {
    await expect(page.getByTestId('artifact-card')).toBeVisible();
  });

  test('フィルターを適用すると結果が絞り込まれる', async ({ page }) => {
    await page.getByTestId('filter-set').selectOption('花');
    await expect(page.getByTestId('artifact-card')).toHaveCount(/* 期待値 */);
  });
});
```

### ステップ 5: テストを実行して確認する

```bash
cd webapp && npm run test:e2e
```

`test:e2e` スクリプトが `package.json` に存在しない場合は以下を追加するよう提案する:

```json
"test:e2e": "playwright test"
```

## 注意事項

- E2E テストは `webapp/tests/e2e/` に配置すること
- `basePath` (`/mogumogu-paimon`) を考慮した URL 設定を行うこと
- `data-testid` 属性が不足している場合は対象コンポーネントへの追加を提案すること
- Playwright が未インストールの場合は `npm install -D @playwright/test && npx playwright install` を提案する
