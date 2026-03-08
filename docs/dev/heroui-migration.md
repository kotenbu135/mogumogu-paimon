# HeroUI 導入手順

## 概要

[HeroUI](https://www.heroui.com/) は React + Tailwind CSS ベースの UI コンポーネントライブラリ。
アクセシビリティ（React Aria 準拠）・アニメーション（framer-motion）・ダークモード対応が標準搭載されている。

このドキュメントでは、もぐもぐパイモンへの HeroUI 導入手順と注意点をまとめる。

---

## 1. 前提確認と互換性

| 項目 | 現在の構成 | HeroUI 要件 | 互換性 |
|---|---|---|---|
| React | 19.x | 18+ | ✅ |
| Next.js | 16 (App Router) | 14+ (App Router 対応あり) | ✅ |
| Tailwind CSS | **v4** | v3 系（v4 対応は開発中） | ⚠️ **要注意** |
| TypeScript | 5.x | 5+ | ✅ |
| 静的エクスポート | `output: "export"` | SSR 不要コンポーネントなら可 | ⚠️ 要確認 |

### ⚠️ Tailwind CSS v4 の互換性問題

現在のプロジェクトは **Tailwind CSS v4** を使用しているが、HeroUI v2 は **Tailwind CSS v3** を前提としている。

対応方針として以下の選択肢がある：

**A) Tailwind CSS v4 のまま導入する（推奨・段階的移行）**
- HeroUI の `tailwind.config.js` プラグイン設定の代わりに、HeroUI の CSS 変数を手動でインポートする
- `globals.css` に HeroUI のテーマ CSS 変数を追加する
- 一部 HeroUI コンポーネントのスタイルが崩れる可能性があるため、都度確認しながら進める

**B) Tailwind CSS v3 にダウングレードする**
- HeroUI との完全な互換性が得られる
- `@tailwindcss/postcss` → `autoprefixer` + `postcss` に変更が必要
- 既存の v4 構文（`@import "tailwindcss/preflight"` 等）を v3 構文に書き直し必要

---

## 2. インストール手順

### 2-1. パッケージのインストール（`webapp/` ディレクトリで実行）

```bash
npm install @heroui/react framer-motion
```

> `framer-motion` はアニメーションに必要な peer dependency。

### 2-2. Tailwind CSS v4 環境での設定

Tailwind v4 では `tailwind.config.js` が存在しないため、HeroUI のプラグインを直接適用できない。
代わりに以下のアプローチをとる。

**`webapp/src/app/globals.css` に追記：**

```css
/* HeroUI コアスタイルのインポート（v4 対応の暫定対応） */
@import "@heroui/react/dist/index.css";
```

> ※ HeroUI の v4 対応が公式リリースされた場合は公式ドキュメントに従って更新する。

### 2-3. Tailwind CSS v3 へのダウングレードを選択した場合

```bash
npm uninstall tailwindcss @tailwindcss/postcss
npm install tailwindcss@^3 autoprefixer postcss
```

`postcss.config.js` を作成：
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

`tailwind.config.js` を作成（HeroUI プラグイン込み）：
```js
import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};
```

`globals.css` を v3 構文に変更：
```css
/* v4 の @import を v3 の @tailwind に変更 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 3. Provider の設定

### 3-1. `layout.tsx` への HeroUIProvider 追加

HeroUI はアプリ全体を `HeroUIProvider` でラップする必要がある。
Next.js App Router では Server Component から直接 Provider を使えないため、クライアントコンポーネントで包む。

**`webapp/src/components/HeroUIProviderWrapper.tsx` を新規作成：**

```tsx
'use client'

import { HeroUIProvider } from '@heroui/react'

export default function HeroUIProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  )
}
```

**`webapp/src/app/layout.tsx` を更新：**

```tsx
import HeroUIProviderWrapper from '@/components/HeroUIProviderWrapper'
// ... 既存のインポート

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={`dark ${notoSansJPRegular.variable} ${notoSansJPBold.variable}`}>
      {/* dark クラスを追加（HeroUI のダークモード有効化） */}
      <head>...</head>
      <body>
        <HeroUIProviderWrapper>
          <LanguageProvider>
            <div className="app-layout">
              <Sidebar />
              <div className="main-area">
                {children}
              </div>
            </div>
          </LanguageProvider>
        </HeroUIProviderWrapper>
      </body>
    </html>
  )
}
```

---

## 4. コンポーネント置き換えマッピング

既存のカスタムコンポーネントと HeroUI コンポーネントの対応表。

| 既存のカスタム実装 | HeroUI コンポーネント | 備考 |
|---|---|---|
| `<select className="ctrl-select">` | `<Select>` | フィルター・スコア種別選択 |
| `<button className="ctrl-btn">` | `<Button>` | 各種ボタン |
| `<input type="checkbox">` | `<Checkbox>` | サブステフィルター等 |
| カスタム DropdownPanel (createPortal) | `<Dropdown>` + `<DropdownMenu>` | セットフィルター、サブステフィルター |
| `<div className="artifact-card">` | `<Card>` + `<CardBody>` 等 | 聖遺物カード |
| `<nav className="sidebar">` | `<Navbar>` または `<Listbox>` | サイドバーナビ |
| カスタム言語切り替えボタン | `<ButtonGroup>` | JA/EN トグル |
| フィルターチップ | `<Chip>` + `onClose` | アクティブフィルター表示 |
| スコアバー | `<Progress>` | スコア視覚化 |

---

## 5. 静的エクスポート (`output: "export"`) での注意点

HeroUI の一部コンポーネントはクライアントサイドのみで動作するため、`output: "export"` との互換性は基本的に問題ない。

ただし以下に注意：
- `HeroUIProvider` を含む全コンポーネントは `'use client'` が必要（現在の構成と同様）
- `useRouter` を内部で使う HeroUI コンポーネント（`Link` など）は `basePath` の設定と合わせて動作確認が必要
- `next.config.ts` の `basePath: "/mogumogu-paimon"` と HeroUI の `Link` コンポーネントを組み合わせる場合、Next.js の `<Link>` を引き続き使用することを推奨

---

## 6. 段階的移行計画（推奨順序）

実際の実装は別 Issue で行う。以下は推奨する移行順序。

### Phase 1: 環境整備
1. パッケージインストール（`@heroui/react`, `framer-motion`）
2. Tailwind CSS の互換性確認・対応（v4 or v3 ダウングレード判断）
3. `HeroUIProvider` の追加
4. ビルド確認（`npm run build`）・既存テスト通過確認

### Phase 2: 基本コンポーネント置き換え
5. `<Button>` で既存ボタンを置き換え（`ctrl-btn`, `lang-btn` 等）
6. `<Select>` で `<select>` 要素を置き換え（コントロールバーの各セレクト）
7. `<Checkbox>` でチェックボックスを置き換え

### Phase 3: カード・レイアウト
8. `<Card>` で `ArtifactCard` を再構築
9. `<Chip>` でフィルターチップを置き換え
10. `<Progress>` でスコアバーを置き換え

### Phase 4: ナビゲーション・ドロップダウン
11. `<Dropdown>` でカスタムドロップダウン（createPortal実装）を置き換え
12. サイドバーを HeroUI コンポーネントで再構築

### Phase 5: テーマ調整
13. HeroUI のカスタムテーマで既存カラー変数（`--bg-main`, `--gold` 等）を統合
14. E2E テスト・スクリーンショットの更新

---

## 7. HeroUI テーマのカスタマイズ

既存のカラーパレットを HeroUI テーマに移植する例：

```js
// tailwind.config.js（v3 の場合）
import { heroui } from "@heroui/react";

export default {
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#0d0e1a",   // --bg-main
            foreground: "#e8e0d0",   // --text-main
            primary: {
              DEFAULT: "#c8a35a",    // --gold
              foreground: "#0d0e1a",
            },
            content1: "#1a1b2e",     // --bg-card
            content2: "#13142a",     // --bg-ctrl
            content3: "#22243a",     // --bg-card-hover
          },
        },
      },
    }),
  ],
};
```

---

## 8. 参考リンク

- [HeroUI 公式ドキュメント](https://www.heroui.com/docs/guide/introduction)
- [HeroUI × Next.js インストールガイド](https://www.heroui.com/docs/frameworks/nextjs)
- [HeroUI テーマカスタマイズ](https://www.heroui.com/docs/customization/theme)
- [HeroUI コンポーネント一覧](https://www.heroui.com/components)
