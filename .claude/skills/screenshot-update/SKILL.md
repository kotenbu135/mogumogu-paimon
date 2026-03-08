---
name: screenshot-update
description: 'docs/screenshot/ のスクリーンショットを Playwright で撮影・更新するスキル。/screenshot-update を実行してスクリーンショットの更新を行う。UIに影響する変更を行った開発タスクの完了時に使用する。また、.tsx/.css ファイルの見た目の変更、Tailwind クラスやスタイルの修正、アニメーション・トランジションの追加、レイアウト変更（flexbox/grid）、レスポンシブ対応、新ページ追加、コンポーネントのデザイン修正、色・フォント・画像の差し替え、ホバーエフェクトやインタラクションの実装など、ブラウザの見た目が変わる変更を行った場合にも必ず使用する。「スクリーンショットを更新して」「スクショを撮って」「画面キャプチャして」などの依頼にも対応する。ロジックのみの変更・型定義のみの追加・テストやドキュメントのみの修正など、画面表示に影響しない変更では使用しない。'
---

# スクリーンショット更新スキル

`webapp/e2e/screenshot.spec.ts` を実行して `docs/screenshot/` のスクリーンショット画像を最新状態に更新します。

## 前提知識

- **スクリーンショット設定**: `webapp/playwright.screenshot.config.ts`（ビューポート 1600×1600、`screenshot.spec.ts` のみ対象）
- **実行コマンド**: `cd webapp && npm run screenshot`（dev サーバーが自動起動）
- **出力先**: `docs/screenshot/*.png`（`screenshot.spec.ts` の `OUT_DIR` 参照）
- **依存**: Playwright + Chromium が必要（`npx playwright install chromium` でインストール）

## 実行フロー

---

### ステップ 1: dev サーバーの確認と Playwright のセットアップ

Playwright ブラウザが未インストールの場合は先にインストールする:

```bash
cd webapp && npx playwright install chromium
```

---

### ステップ 2: スクリーンショットの撮影・更新

```bash
cd webapp && npm run screenshot
```

このコマンドは `playwright.screenshot.config.ts` を使用し、`screenshot.spec.ts` 内の全テストを実行して `docs/screenshot/` 以下のすべての PNG を上書き更新する。

**失敗した場合の対処:**

- `Error: net::ERR_CONNECTION_REFUSED` → dev サーバーの起動を待ってリトライ（config の `reuseExistingServer: true` で自動再利用）
- セレクタが見つからない → `screenshot.spec.ts` または対象コンポーネントに変更がないか確認する
- タイムアウト → ネットワークや重いビルドが原因の場合が多い。`timeout` を上げるか再実行する

---

### ステップ 3: 更新されたファイルの確認とコミット

更新されたスクリーンショットを確認する:

```bash
git diff --stat docs/screenshot/
```

変更があれば commit-smart スキルを使ってコミットメッセージを生成し、コミットする:

```bash
git add docs/screenshot/
git commit -m "docs(screenshot): update screenshots"
```

---

## 完了後の報告

以下を報告すること:
- 実行したテスト数と成功/失敗数
- 更新されたスクリーンショットファイルの一覧
- コミットハッシュ（コミットした場合）
- 失敗があれば原因と対処方法
