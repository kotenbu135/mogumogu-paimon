---
name: perf-audit
description: '静的エクスポートのバンドルサイズを分析し、Next.js パフォーマンス最適化ポイントを提示する。'
---

# Perf Audit スキル

`npm run build` で生成した静的エクスポート（`out/`）のバンドルサイズを分析し、最適化ポイントをレポートします。

## 手順

### ステップ 1: ビルドを実行する

Agent ツール（`context: fork`）を使ってビルドを実行する:

```
以下のコマンドを実行してビルド出力を取得してください。

cd webapp && npm run build 2>&1

出力から以下を抽出してください:
- ビルドが成功したか否か
- 各ページのサイズ（First Load JS）
- 警告メッセージ（large page size 等）
```

ビルドが失敗した場合はエラー内容を報告し、修正提案を行う。

### ステップ 2: 出力ファイルのサイズを集計する

```bash
find webapp/out -name "*.js" -o -name "*.css" | xargs ls -la | sort -k5 -rn | head -20
```

50KB を超えるファイルを「大きなバンドル」として優先分析対象とする。

### ステップ 3: 大きなバンドルの原因を特定する

Agent ツール（`context: fork`）を使って大きなバンドルの原因を分析する:

```
以下の大きなバンドルファイル（50KB 超）について、原因コンポーネントを特定してください。

対象ファイル: {{大きなバンドルのパス}}

分析観点:
- webapp/src/ のどのコンポーネント・ライブラリが主な原因か
- "use client" が不必要に付与されているコンポーネントはあるか
- 動的インポート（next/dynamic）で遅延ロード可能なコンポーネントはあるか
- 未使用の import はあるか
- next/image を使わずに <img> タグを直接使っている箇所はあるか
```

### ステップ 4: 最適化提案を出力する

以下の形式でレポートを出力する:

```markdown
## パフォーマンス監査レポート

### ビルドサマリー
| ページ | サイズ | 評価 |
|--------|--------|------|
| /      | XXkB   | 良好 |
| /artifact | XXXkB | 要改善 |

### 大きなバンドル（50KB 超）
| ファイル | サイズ | 主な原因 |
|----------|--------|----------|
| chunk-xxx.js | XXXkB | ComponentA, LibraryB |

### 最適化提案

#### 動的インポート候補
初期表示に不要なコンポーネントは `next/dynamic` で遅延ロードする:

```ts
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

#### "use client" 境界の見直し
以下のコンポーネントはサーバーコンポーネントに変更可能:
- `src/components/xxx.tsx` — 状態・イベントハンドラ不使用

#### 未使用 import の削除
- `src/lib/xxx.ts` の import { unusedFunc } を削除する

#### 画像の最適化
- `<img>` タグを `next/image` に置き換える
- `src` には必ず `process.env.BASE_PATH` を先頭に付与すること

### 改善見込み
上記の対応により、想定 XX% のバンドルサイズ削減が見込まれる。
```

## 注意事項

- ビルド対象: `webapp/` （`output: "export"` + `basePath: "/mogumogu-paimon"`）
- ビルド出力先: `webapp/out/`
- 画像パスには必ず `process.env.BASE_PATH` を先頭に付与すること（`webapp/next.config.ts` 参照）
- `next/image` を使用する場合は静的エクスポートとの互換性（`unoptimized: true`）を確認すること
