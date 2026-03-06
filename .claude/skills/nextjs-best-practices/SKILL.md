---
name: nextjs-best-practices
description: 'Next.js App Router のベストプラクティスを適用するスキル。Server/Client Components の分離・データフェッチ・ルーティングの最適化を行う。'
---

# Next.js Best Practices スキル

Next.js 16 App Router のベストプラクティスをコードベースに適用します。

## 手順

### 1. コンポーネント分析（サブエージェント）

Agentツールを `context: fork` で起動し、以下の分析を委譲する:

```
以下のファイルを読み込み、Next.js ベストプラクティス違反を一覧化してください。

分析対象: webapp/src/app/ および webapp/src/components/ 配下の全 .tsx/.ts ファイル

確認項目:
1. "use client" ディレクティブの有無と場所（不要な Client Component がないか）
2. データフェッチが Server Component で行われているか（useState + useEffect でのフェッチは避ける）
3. <img> タグの直接使用箇所（next/image に置き換え対象）
4. <a> タグの直接使用箇所（next/link に置き換え対象）
5. 画像パスに process.env.BASE_PATH が付与されているか
6. next/headers / getServerSideProps など Static Export 非対応 API の使用
7. メタデータが metadata オブジェクトまたは generateMetadata で定義されているか

参照: CLAUDE.md（basePath, output: "export" の設定）、docs/dev/component_design.md
```

### 2. チェックリストの適用

サブエージェントの分析結果をもとに下記チェックリストを確認し、問題点を報告・修正する。

## チェックリスト

- [ ] `"use client"` は最小限か（必要な場合のみ）
- [ ] データフェッチは Server Component で行われているか
- [ ] `BASE_PATH` を画像パスに付与しているか
- [ ] Static Export と互換性のある API を使用しているか
- [ ] `next/image` を使用しているか（`<img>` タグより優先）
- [ ] `next/link` を使用しているか（`<a>` タグより優先）
- [ ] メタデータは `metadata` オブジェクトまたは `generateMetadata` で定義しているか
