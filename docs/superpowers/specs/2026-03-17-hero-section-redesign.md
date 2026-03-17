# ヒーローセクション リデザイン — 紋章フレーム型

## 概要

ホームページのヒーローセクションを「高級感・重厚感」のある原神ファンタジー世界観に合わせてリデザインする。装飾的なコーナーオーナメント＋ゴールドボーダーで額縁のような格式を演出し、視線を中央に集約する「紋章フレーム」スタイルを採用する。

## 動機

現在のヒーローセクションはシンプルなテキスト＋アップロードエリア＋スコアカードの構成で機能的だが、原神の世界観を感じさせる視覚的な格式や没入感が不足している。ツールの第一印象を決めるヒーロー部分の質を上げることで、ユーザー体験全体の印象を向上させる。

## スコープ

### 対象ファイル

| ファイル | 変更内容 |
|---|---|
| `webapp/src/components/HeroSection.tsx` | 装飾要素のマークアップ追加 |
| `webapp/src/app/globals.css` | 新規CSSクラス追加・既存スタイル更新 |

### スコープ外

- 聖遺物カード（ArtifactCard）のデザイン変更（ヒーロー内のスコアフォーミュラカードは対象）
- コントロールバーの変更
- サイドバーの変更
- 情報ページ（スコアについて等）の変更
- モバイルレイアウトの大幅な変更（レスポンシブ対応は既存のブレークポイントに合わせる）

## デザイン仕様

### 1. ゴールドトップボーダー

ヒーローセクション上端に3pxの水平グラデーションボーダーを追加する。

```css
.hero-border-top {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 5%, #c8a35a 30%, #e8c880 50%, #c8a35a 70%, transparent 95%);
}
```

### 2. ボトムサブトルボーダー

下端に1pxの控えめなゴールドライン。

```css
.hero-border-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200,163,90,0.25), transparent);
}
```

### 3. コーナーオーナメント

四隅にL字型のゴールド装飾（幅32px、線幅2px、opacity 0.6）。原神のウィンドウUIを彷彿とさせるモチーフ。

- 位置: 各コーナーから12pxのオフセット
- 4つの `div.hero-corner` 要素を配置し、各要素の `::before`（水平線）と `::after`（垂直線）でL字を描画

### 4. アイブロウテキスト

タイトル上に小さなレタリング「✦ Artifact Score ✦」を追加。

```css
.hero-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 5px;
  color: var(--gold);
}
```

### 5. タイトル分離

現在の `もぐもぐパイモン - 聖遺物スコア -` を分離:
- **タイトル**: `もぐもぐパイモン`（ゴールドグラデーション、font-size: 2rem、font-weight: 700）
- **サブタイトル**: `原神の聖遺物スコアを一括評価`（既存のまま）

タイトルにはゴールドグラデーション（`linear-gradient(135deg, #c8a35a, #e8c880, #c8a35a)`）の `background-clip: text` を適用。

※ 現在の `t.siteTitle` は `'もぐもぐパイモン - 聖遺物スコア -'` だが、アイブロウに `✦ Artifact Score ✦` を配置するため、タイトルはブランド名「もぐもぐパイモン」のみとする。ブランド名は言語によらず固定のためハードコードする。

### 6. 中央グローの強化

既存の `::before` 疑似要素のグロー（`rgba(200,163,90,0.07)`）を `0.10` に強化し、サイズを維持（700px × 320px）。

### 7. アップロードエリアの強化

- ボーダー色: `rgba(200,163,90,0.12)` → `rgba(200,163,90,0.2)`
- ホバー時: `border-color: rgba(200,163,90,0.4)` + `box-shadow: 0 0 30px rgba(200,163,90,0.08)`
- `backdrop-filter: blur(6px)` を追加（既存になければ）

### 8. ダイヤモンド区切り線

アップロードエリアとスコアカードセクションの間にディバイダーを追加。

- 中央に6px×6pxの◇（45度回転した正方形、ゴールド色）
- 左右に最大120pxのグラデーションライン
- ◇に `box-shadow: 0 0 8px rgba(200,163,90,0.3)` のグロー

### 9. スコアフォーミュラカード（`.score-formula-card`）の強化

※ ArtifactCard（聖遺物カード）とは別のコンポーネント。ここではヒーロー内のスコア計算式カードのみ対象。

- ボーダー色: `var(--border)` → `rgba(200,163,90,0.12)`
- ホバー時: `translateY(-2px)` のリフトエフェクト追加
- 背景: `rgba(26,27,46,0.7)` で微妙に透過

### 10. フェードインアニメーション

ヒーロー内の子要素に順番にフェードインするアニメーションを追加。

```css
@keyframes heroFadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```

- duration: 500ms
- easing: ease-out
- 各要素に50msずつ遅延

## コンポーネント構造（After）

```tsx
<div className="hero-section">
  {/* 装飾要素 */}
  <div className="hero-border-top" />
  <div className="hero-border-bottom" />
  <div className="hero-corner hero-corner-tl" />
  <div className="hero-corner hero-corner-tr" />
  <div className="hero-corner hero-corner-bl" />
  <div className="hero-corner hero-corner-br" />

  {/* アイブロウ */}
  <p className="hero-eyebrow">✦ Artifact Score ✦</p>

  {/* タイトル（ゴールドグラデーション、ブランド名固定） */}
  <h1 className="hero-title">もぐもぐパイモン</h1>

  {/* サブタイトル（ハードコード維持、現状と同じ） */}
  <p className="hero-subtitle">原神の聖遺物スコアを一括評価</p>

  {/* アップロード */}
  <FileUpload onLoad={onLoad} />

  {/* ディバイダー */}
  <div className="hero-divider">
    <div className="hero-divider-diamond" />
  </div>

  {/* スコアカード */}
  <div className="score-card-section">
    <p className="score-card-title">{t.pages.aboutScore.formulaList.heading}</p>
    <div className="score-card-grid">
      {scoreTypeOptions.map((type) => (
        <button key={type} className="score-formula-card" ...>
          ...
        </button>
      ))}
    </div>
  </div>
</div>
```

## レスポンシブ対応

- コーナーオーナメントは768px以下で非表示（`display: none`）
- アイブロウテキストのletter-spacingを狭める
- それ以外は既存のレスポンシブ対応を維持

## テスト方針

- 既存のE2Eテスト（Playwright）のスクリーンショットを更新
- ビジュアルリグレッションの確認
- ホバーエフェクトの動作確認

## 参考モックアップ

Before / After の比較モックアップ: `.superpowers/brainstorm/17252-1773750399/hero-detail-v1.html`
