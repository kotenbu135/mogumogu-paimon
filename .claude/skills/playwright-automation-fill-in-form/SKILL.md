---
name: playwright-automation-fill-in-form
description: 'Playwright MCP を使用してフォーム入力を自動化'
---

# Playwright を使用したフォーム入力の自動化

Playwright MCP を使用してフォーム入力プロセスを自動化します。

## 概要

このスキルは、Web フォームの自動入力・検証・テストを効率化するための Playwright 活用方法を提供します。

## 基本的なアプローチ

### 1. 対象フォームの確認

- ターゲット URL を確認
- フォーム要素（input、select、textarea など）を特定
- フォーム送信前に検証ロジックを設計

### 2. Playwright スクリプト作成

フォーム入力の自動化スクリプト例：

```typescript
import { test } from '@playwright/test';

test('フォーム入力の自動化', async ({ page }) => {
  await page.goto('https://example.com/form');

  // テキスト入力
  await page.fill('input[name="name"]', 'テスト');

  // ドロップダウン選択
  await page.selectOption('select[name="category"]', 'option-value');

  // チェックボックス
  await page.check('input[type="checkbox"]');

  // ファイルアップロード
  await page.setInputFiles('input[type="file"]', '/path/to/file.png');

  // フォーム検証
  await page.waitForSelector('.success-message');
});
```

### 3. フォーム検証前のレビュー

**重要**: フォーム送信前に必ず検証を行います：

- 入力値が正しく反映されているか確認
- 必須フィールドが埋まっているか確認
- エラーメッセージが表示されないか確認
- UI レイアウトが崩れていないか確認

## 推奨される実装パターン

**Playwright MCP** を推奨実装として使用：
- ナビゲーション機能
- DOM スナップショット
- スクリーンショット撮影
- インタラクション実行

## テスト時の注意点

- サンドボックス環境で最初にテスト実行
- 実データを使用する場合は機密情報を保護
- レスポンシブデザイン対応（複数ビューポートでテスト）
- アクセシビリティも考慮（タブオーダー、ARIA ラベルなど）
