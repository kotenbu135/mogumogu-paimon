---
name: next-intl-add-language
description: 'Next.js + next-intl アプリケーションに新言語を追加'
---

# Next.js に新言語を追加

このガイドは、next-intl を使用して Next.js プロジェクトに新しい言語を追加する方法を説明します。

## 概要

- i18n は next-intl を使用しています
- すべての翻訳は `./messages` ディレクトリに配置されます
- UI コンポーネント：`src/components/language-toggle.tsx`
- ルーティングとミドルウェア設定：
  - `src/i18n/routing.ts`
  - `src/middleware.ts`

## 新言語を追加する手順

### 1. 翻訳ファイルを作成

`./messages` ディレクトリ内で `en.json` のすべてのコンテンツを新しい言語に翻訳します。

**目標**: 新言語用 JSON ファイル内のすべてのエントリーが完全に翻訳されていることを確認します。

```bash
# 例：日本語の場合
cp ./messages/en.json ./messages/ja.json
# ja.json のすべての値を日本語に翻訳
```

### 2. ルーティング設定を更新

`src/i18n/routing.ts` に新しい言語のパスを追加します。

```typescript
export const locales = ['en', 'ja', 'de']; // 新言語を追加
```

### 3. ミドルウェア設定を更新

`src/middleware.ts` で新しい言語をサポートするよう設定を更新します。

### 4. 言語切り替えコンポーネントを更新

`src/components/language-toggle.tsx` に新しい言語を追加します。

```typescript
const languages = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'de', label: 'Deutsch' }
];
```

## ベストプラクティス

- 翻訳の完全性を確認してからリリースします
- 各言語ファイルのキーの順序は統一を保ちます
- 言語固有の形式（日時、数値など）を考慮します
