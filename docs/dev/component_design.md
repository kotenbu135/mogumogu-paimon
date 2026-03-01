# コンポーネント設計

## 画像パス
聖遺物・キャラクター画像は `webapp/public/` 配下にある。
パスは必ず `process.env.BASE_PATH` を先頭に付与すること。
- 実装例: `webapp/src/components/ArtifactCard.tsx:66-68`

## 主要コンポーネント

### ArtifactCard (`webapp/src/components/ArtifactCard.tsx`)
聖遺物1件のカード表示。スコア・サブステ・ロール数を表示する。
- 聖遺物画像クリック → `ContextMenu` でセット・部位フィルタ
- キャラアイコンクリック → `ContextMenu` で装備セットフィルタ
- `reconRate` prop: 再構築成功率（%）。指定時はカード右下に表示
  - 70%以上 → 赤、50%以上 → オレンジ、50%未満 → グレー
  - ★5 Lv.20以外・保証サブステ不在 → null で非表示

### FileUpload (`webapp/src/components/FileUpload.tsx`)
GOOD JSON のドラッグ＆ドロップまたはファイル選択。`compact` prop で再アップロード用の小型表示に切替。

### Sidebar (`webapp/src/components/Sidebar.tsx`)
サイドナビゲーション。項目定義は `webapp/src/lib/sidebarItems.ts`。

### ContextMenu (`webapp/src/components/ContextMenu.tsx`)
汎用クリックメニュー。項目生成ロジックは `webapp/src/lib/contextMenu.ts`。

## メインページのデータフロー (`webapp/src/app/page.tsx`)
1. `FileUpload` で GOOD JSON を読み込み
2. `buildRankedList()` で★5聖遺物をスコア計算・ランク付け
3. スコアタイプ・セット・部位・再構築種別でフィルタ＆ソート
4. 再構築種別選択時は `calculateReconstructionRate()` で成功率を算出
5. `ArtifactCard` グリッドで表示（成功率付き）

## スコア色分け
`webapp/src/components/ArtifactCard.tsx:20-25` の `scoreColor()` を参照。
- `>= 55` → `text-red-400`（非常に高い）
- `>= 45` → `text-orange-400`（高い）
- `>= 35` → `text-yellow-400`（普通）
- それ以下 → `text-white`
