# ヒーローセクション リデザイン（紋章フレーム型）実装計画

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ヒーローセクションに紋章フレーム装飾（ゴールドボーダー、コーナーオーナメント、ダイヤモンドディバイダー）を追加し、原神ファンタジー世界観の高級感・重厚感を演出する。

**Architecture:** HeroSection.tsx に装飾用DOM要素を追加し、globals.css に新規CSSクラスを追加する。既存のコンポーネント構造とCSSクラス名は維持し、装飾レイヤーを上乗せする形で実装する。

**Tech Stack:** Next.js 16 (App Router) / React 19 / CSS (globals.css、CSS変数活用)

**Spec:** `docs/superpowers/specs/2026-03-17-hero-section-redesign.md`

---

## ファイル構成

| ファイル | 操作 | 責務 |
|---|---|---|
| `webapp/src/app/globals.css:342-383` | 修正 | ヒーローセクションの既存スタイル更新＋新規装飾CSSクラス追加 |
| `webapp/src/app/globals.css:1137-1171` | 修正 | スコアフォーミュラカードのスタイル更新 |
| `webapp/src/components/HeroSection.tsx` | 修正 | 装飾DOM要素＋アイブロウ＋タイトル＋ディバイダーのマークアップ追加 |
| `webapp/e2e/home.spec.ts` | 修正 | 新規装飾要素のE2Eテスト追加 |

---

### Task 1: 装飾フレームのCSS追加（ボーダー＋コーナーオーナメント）

**Files:**
- Modify: `webapp/src/app/globals.css:342-368`

- [ ] **Step 1: `.hero-section` の既存スタイルにグロー強化を適用**

`webapp/src/app/globals.css` のヒーローセクション `::before` のグロー値を変更する:

```css
/* 既存（360行目）を変更 */
/* before: rgba(200, 163, 90, 0.07) */
/* after:  rgba(200, 163, 90, 0.10) */
```

globals.css:360 の `0.07` を `0.10` に変更する。

- [ ] **Step 2: ゴールドトップボーダー・ボトムボーダーのCSSを追加**

`.hero-section` ブロックの直後（globals.css 369行目付近、`.hero-img` の前）に追加:

```css
/* ── ヒーロー装飾: ゴールドボーダー ────── */
.hero-border-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 5%, var(--gold) 30%, var(--gold-light) 50%, var(--gold) 70%, transparent 95%);
  z-index: 2;
}

.hero-border-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 163, 90, 0.25), transparent);
  z-index: 2;
}
```

- [ ] **Step 3: コーナーオーナメントのCSSを追加**

ボーダーCSSの直後に追加:

```css
/* ── ヒーロー装飾: コーナーオーナメント ── */
.hero-corner {
  position: absolute;
  width: 32px;
  height: 32px;
  opacity: 0.6;
  z-index: 2;
  pointer-events: none;
}

.hero-corner::before,
.hero-corner::after {
  content: '';
  position: absolute;
  background: var(--gold);
}

.hero-corner-tl { top: 12px; left: 12px; }
.hero-corner-tl::before { top: 0; left: 0; width: 100%; height: 2px; }
.hero-corner-tl::after  { top: 0; left: 0; width: 2px; height: 100%; }

.hero-corner-tr { top: 12px; right: 12px; }
.hero-corner-tr::before { top: 0; left: 0; width: 100%; height: 2px; }
.hero-corner-tr::after  { top: 0; right: 0; width: 2px; height: 100%; }

.hero-corner-bl { bottom: 12px; left: 12px; }
.hero-corner-bl::before { bottom: 0; left: 0; width: 100%; height: 2px; }
.hero-corner-bl::after  { bottom: 0; left: 0; width: 2px; height: 100%; }

.hero-corner-br { bottom: 12px; right: 12px; }
.hero-corner-br::before { bottom: 0; left: 0; width: 100%; height: 2px; }
.hero-corner-br::after  { bottom: 0; right: 0; width: 2px; height: 100%; }
```

- [ ] **Step 4: ビルド確認**

Run: `cd webapp && npm run typecheck && npm run lint -- --fix`
Expected: エラーなし（CSSのみの変更なので型チェックは影響なし）

- [ ] **Step 5: コミット**

```bash
cd webapp && git add src/app/globals.css
git commit -m "style: add hero frame decoration CSS (borders + corner ornaments)"
```

---

### Task 2: アイブロウ・タイトル・ディバイダーのCSS追加

**Files:**
- Modify: `webapp/src/app/globals.css`

- [ ] **Step 1: アイブロウテキストのCSSを追加**

コーナーオーナメントCSSの直後に追加:

```css
/* ── ヒーロー装飾: アイブロウ ────────── */
.hero-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 5px;
  color: var(--gold);
  text-align: center;
}
```

- [ ] **Step 2: タイトルのCSSを追加**

```css
/* ── ヒーロー装飾: タイトル ──────────── */
.hero-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: -0.5rem;
}
```

- [ ] **Step 3: ダイヤモンドディバイダーのCSSを追加**

```css
/* ── ヒーロー装飾: ダイヤモンドディバイダー ── */
.hero-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
}

.hero-divider::before,
.hero-divider::after {
  content: '';
  flex: 1;
  max-width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 163, 90, 0.3));
}

.hero-divider::after {
  background: linear-gradient(270deg, transparent, rgba(200, 163, 90, 0.3));
}

.hero-divider-diamond {
  width: 6px;
  height: 6px;
  background: var(--gold);
  transform: rotate(45deg);
  opacity: 0.6;
  box-shadow: 0 0 8px rgba(200, 163, 90, 0.3);
}
```

- [ ] **Step 4: ビルド確認**

Run: `cd webapp && npm run lint -- --fix`
Expected: エラーなし

- [ ] **Step 5: コミット**

```bash
cd webapp && git add src/app/globals.css
git commit -m "style: add hero eyebrow, title, and diamond divider CSS"
```

---

### Task 3: スコアフォーミュラカードとアップロードエリアのCSS更新

**Files:**
- Modify: `webapp/src/app/globals.css:1060-1076` (upload-zone)
- Modify: `webapp/src/app/globals.css:1137-1171` (score-formula-card)

- [ ] **Step 1: アップロードゾーンのCSS更新**

globals.css の `.upload-zone` (1060行目付近) に `backdrop-filter` を追加:

```css
/* 1069行目 background の後に追加 */
backdrop-filter: blur(6px);
```

`.upload-zone` のボーダー色を更新（1064行目）:
```css
/* before: border: 2px dashed var(--border); */
/* after:  border: 2px dashed rgba(200, 163, 90, 0.2); */
```

`.upload-zone:hover` のスタイルを更新（1072-1076行目）:
```css
.upload-zone:hover {
  border-color: rgba(200, 163, 90, 0.4);
  background: var(--bg-card-hover);
  box-shadow: 0 0 30px rgba(200, 163, 90, 0.08);
}
```

- [ ] **Step 2: スコアフォーミュラカードのCSS更新**

`.score-formula-card` (1137行目) のスタイルを更新:

```css
.score-formula-card {
  background: rgba(26, 27, 46, 0.7);
  border: 1px solid rgba(200, 163, 90, 0.12);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
```

`.score-formula-card:hover` (1150行目) にリフトエフェクト追加:

```css
.score-formula-card:hover {
  border-color: var(--gold);
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}
```

- [ ] **Step 3: ビルド確認**

Run: `cd webapp && npm run lint -- --fix`
Expected: エラーなし

- [ ] **Step 4: コミット**

```bash
cd webapp && git add src/app/globals.css
git commit -m "style: enhance upload zone and score formula card styles"
```

---

### Task 4: フェードインアニメーションCSS追加

**Files:**
- Modify: `webapp/src/app/globals.css`

- [ ] **Step 1: キーフレームとアニメーションCSSを追加**

ヒーロー装飾CSSブロックの末尾に追加:

まず、既存の `.hero-section > *` ルール（globals.css:365-368）を削除する。これは Task 4 で統合版に置き換えるため。

```css
/* 削除対象（globals.css:365-368） */
/* .hero-section > * {
  position: relative;
  z-index: 1;
} */
```

次に、ヒーロー装飾CSSブロックの末尾に以下を追加:

```css
/* ── ヒーロー装飾: フェードインアニメーション ── */
@keyframes heroFadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 装飾要素（子1-6: ボーダー＋コーナー）はアニメーション対象外 */
.hero-section > * {
  position: relative;
  z-index: 1;
}

/* コンテンツ要素（子7以降）にのみフェードインを適用 */
.hero-section > :nth-child(n+7) {
  animation: heroFadeInUp 500ms ease-out both;
}

.hero-section > :nth-child(7)  { animation-delay: 0ms; }
.hero-section > :nth-child(8)  { animation-delay: 50ms; }
.hero-section > :nth-child(9)  { animation-delay: 100ms; }
.hero-section > :nth-child(10) { animation-delay: 150ms; }
.hero-section > :nth-child(11) { animation-delay: 200ms; }
.hero-section > :nth-child(12) { animation-delay: 250ms; }

@media (prefers-reduced-motion: reduce) {
  .hero-section > :nth-child(n+7) {
    animation: none;
  }
}
```

注: 子要素1-6は装飾要素（ボーダー＋コーナー）で `opacity: 0.6` 等の固定値を持つため、`heroFadeInUp` の `opacity: 1` で上書きしないよう `:nth-child(n+7)` でコンテンツ要素のみにアニメーションを適用する。

- [ ] **Step 2: レスポンシブ対応 — コーナーオーナメント非表示**

フェードインCSSの後に追加:

```css
/* ── ヒーロー装飾: レスポンシブ ──────── */
@media (max-width: 768px) {
  .hero-corner {
    display: none;
  }

  .hero-eyebrow {
    letter-spacing: 3px;
  }
}
```

- [ ] **Step 3: ビルド確認**

Run: `cd webapp && npm run lint -- --fix`
Expected: エラーなし

- [ ] **Step 4: コミット**

```bash
cd webapp && git add src/app/globals.css
git commit -m "style: add hero fade-in animation and responsive rules"
```

---

### Task 5: HeroSection.tsx マークアップ更新

**Files:**
- Modify: `webapp/src/components/HeroSection.tsx`

- [ ] **Step 1: 装飾要素・アイブロウ・タイトル・ディバイダーをマークアップに追加**

`webapp/src/components/HeroSection.tsx` 全体を以下に更新:

```tsx
'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import type { GoodFile, ScoreTypeName } from '@/lib/types'
import type { Translations } from '@/lib/i18n/types'

interface HeroSectionProps {
  onLoad: (data: GoodFile) => void
  t: Translations
  scoreTypeOptions: ScoreTypeName[]
}

/** アップロード画面（空状態）の Hero セクション */
export default function HeroSection({ onLoad, t, scoreTypeOptions }: HeroSectionProps) {
  const [selectedType, setSelectedType] = useState<ScoreTypeName | null>(null)

  return (
    <div className="hero-section">
      {/* 装飾フレーム */}
      <div className="hero-border-top" />
      <div className="hero-border-bottom" />
      <div className="hero-corner hero-corner-tl" />
      <div className="hero-corner hero-corner-tr" />
      <div className="hero-corner hero-corner-bl" />
      <div className="hero-corner hero-corner-br" />

      {/* アイブロウ */}
      <p className="hero-eyebrow">✦ Artifact Score ✦</p>

      {/* タイトル */}
      <h1 className="hero-title">もぐもぐパイモン</h1>

      {/* サブタイトル */}
      <p className="hero-subtitle">原神の聖遺物スコアを一括評価</p>

      {/* アップロードゾーン */}
      <FileUpload onLoad={onLoad} />

      {/* ダイヤモンドディバイダー */}
      <div className="hero-divider">
        <div className="hero-divider-diamond" />
      </div>

      {/* スコア式カードグリッド */}
      <div className="score-card-section">
        <p className="score-card-title">{t.pages.aboutScore.formulaList.heading}</p>
        <div className="score-card-grid">
          {scoreTypeOptions.map((type) => (
            <button
              key={type}
              className={`score-formula-card ${selectedType === type ? 'score-formula-card-active' : ''}`}
              onClick={() => setSelectedType(selectedType === type ? null : type)}
            >
              <span className="score-formula-card-label">{t.scoreFormulas[type].label}</span>
              <span className="score-formula-card-formula">{t.scoreFormulas[type].formula}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 型チェック＋lint確認**

Run: `cd webapp && npm run typecheck && npm run lint -- --fix`
Expected: エラーなし

- [ ] **Step 3: 既存テスト実行**

Run: `cd webapp && npm test`
Expected: 全テストパス

- [ ] **Step 4: コミット**

```bash
cd webapp && git add src/components/HeroSection.tsx
git commit -m "feat: add emblem frame decorations to hero section"
```

---

### Task 6: E2Eテスト更新＋スクリーンショット更新

**Files:**
- Modify: `webapp/e2e/home.spec.ts`

- [ ] **Step 1: 新規装飾要素のテストを追加**

`webapp/e2e/home.spec.ts` の「ヒーローセクションが表示される」テストの後に追加:

```typescript
test('ヒーロー装飾要素が表示される', async ({ page }) => {
  await expect(page.locator('.hero-border-top')).toBeAttached()
  await expect(page.locator('.hero-eyebrow')).toBeVisible()
  await expect(page.locator('.hero-eyebrow')).toHaveText('✦ Artifact Score ✦')
  await expect(page.locator('.hero-title')).toBeVisible()
  await expect(page.locator('.hero-title')).toHaveText('もぐもぐパイモン')
  await expect(page.locator('.hero-divider')).toBeVisible()
})
```

- [ ] **Step 2: E2Eテスト実行**

Run: `cd webapp && npx playwright test e2e/home.spec.ts --reporter=list`
Expected: 全テストパス（装飾テスト含む）

- [ ] **Step 3: スクリーンショット更新**

Run: `cd webapp && npx playwright test e2e/screenshot.spec.ts --update-snapshots`
Expected: スクリーンショット更新（初期ページのスクショが新デザインに更新される）

- [ ] **Step 4: コミット**

```bash
cd webapp && git add e2e/home.spec.ts
git add -A docs/screenshot/  # 更新されたスクリーンショット
git commit -m "test: add hero decoration E2E tests and update screenshots"
```

---

### Task 7: 最終検証

- [ ] **Step 1: フルビルド確認**

Run: `cd webapp && npm run build`
Expected: ビルド成功、`out/` に静的ファイル出力

- [ ] **Step 2: フルテストスイート実行**

Run: `cd webapp && npm run typecheck && npm run lint -- --fix && npm test`
Expected: 全パス

- [ ] **Step 3: 開発サーバーで目視確認**

Run: `cd webapp && npm run dev`
確認項目:
- ゴールドトップボーダーが表示される
- 四隅にコーナーオーナメントが表示される
- 「✦ Artifact Score ✦」アイブロウが表示される
- 「もぐもぐパイモン」タイトルがゴールドグラデーションで表示される
- ダイヤモンドディバイダーが表示される
- アップロードエリアのホバーエフェクトが動作する
- スコアカードのホバーリフトが動作する
- フェードインアニメーションが動作する
- 768px以下でコーナーオーナメントが非表示になる
