---
name: nextjs-best-practices
description: 'Next.js App Router のベストプラクティスを適用するスキル。Server/Client Components の分離・データフェッチ・ルーティングの最適化を行う。'
---

# Next.js Best Practices スキル

Next.js 16 App Router のベストプラクティスをコードベースに適用します。

## 参照ドキュメント

- `CLAUDE.md` — プロジェクト設定（basePath, output: "export"）
- `docs/dev/component-design.md` — コンポーネント設計

## Server Components vs Client Components

### Server Components（デフォルト）
ファイルトップに `"use client"` がないコンポーネント。

**推奨用途:**
- データフェッチ
- 静的なレイアウト・UI
- ファイルシステムへのアクセス
- 機密情報（API キー等）を扱う処理

**このプロジェクトでの使用例:**
```tsx
// app/page.tsx - Server Component
import { loadArtifacts } from '@/lib/artifacts'

export default async function HomePage() {
  const artifacts = await loadArtifacts()
  return <ArtifactList artifacts={artifacts} />
}
```

### Client Components（`"use client"` 必要）

**推奨用途:**
- イベントハンドラ（onClick, onChange 等）
- `useState` / `useEffect` の使用
- ブラウザ API へのアクセス
- インタラクティブな UI

```tsx
"use client"
// フィルタコンポーネント等のインタラクティブ要素のみ
```

## Static Export 対応

このプロジェクトは `output: "export"` を使用。以下の制約に注意:

- `next/headers` は使用不可
- Route Handlers は限定的にしか使用できない
- `getServerSideProps` は使用不可（静的のみ）
- 画像パスは `process.env.BASE_PATH` を先頭に付与

```tsx
const basePath = process.env.BASE_PATH || ''
<img src={`${basePath}/images/artifact.png`} />
// または next/image の loader を使用
```

## データフェッチのベストプラクティス

```tsx
// ✅ Good: Server Component でのデータフェッチ
async function ArtifactPage() {
  const data = await fetchData() // サーバー側で実行
  return <ArtifactDisplay data={data} />
}

// ❌ Bad: Client Component での不必要なデータフェッチ
"use client"
function ArtifactPage() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetchData().then(setData) // 避けるべきパターン
  }, [])
}
```

## ルーティング構成

App Router のファイル規約:
- `app/page.tsx` — ページコンポーネント
- `app/layout.tsx` — レイアウト
- `app/error.tsx` — エラー境界
- `app/loading.tsx` — ローディング UI

## チェックリスト

コードレビュー時に確認:

- [ ] `"use client"` は最小限か（必要な場合のみ）
- [ ] データフェッチは Server Component で行われているか
- [ ] `BASE_PATH` を画像パスに付与しているか
- [ ] Static Export と互換性のある API を使用しているか
- [ ] `next/image` を使用しているか（`<img>` タグより優先）
- [ ] `next/link` を使用しているか（`<a>` タグより優先）
- [ ] メタデータは `metadata` オブジェクトまたは `generateMetadata` で定義しているか
