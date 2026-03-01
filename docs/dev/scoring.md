# スコア計算方式

実装: `webapp/src/lib/scoring.ts`

## スコアタイプ一覧

| スコアタイプ | 計算式 |
|---|---|
| CV | 会心率×2 + 会心ダメージ |
| HP型 | CV + HP%×1.0 |
| 攻撃型 | CV + 攻撃力%×1.0 |
| 防御型 | CV + 防御力%×0.8 |
| 熟知型 | CV + 元素熟知×0.25 |
| チャージ型 | CV + 元素チャージ×0.9 |
| 最良型 | 上記6タイプの最高値 |

定義: `webapp/src/lib/scoring.ts:45-51`

## 主要エクスポート関数

| 関数 | 説明 | 定義位置 |
|---|---|---|
| `calculateScores` | CVスコアと最良スコア（型名付き）を返す | `scoring.ts:181` |
| `calculateAllScores` | 全スコアタイプのスコアをまとめて返す | `scoring.ts:206` |
| `estimateRollCounts` | 強化ロール数を推定（バックトラッキング → フォールバック平均値） | `scoring.ts:131` |
| `decomposeRolls` | サブステの値をティア値の和として分解する | `scoring.ts:79` |

## 関連ドキュメント
- ロール数計算の詳細: `docs/Substat_Rolls_Calculation.md`
- 強化仕様: `docs/Artifact_Enhancement.md`
- 検証レポート: `docs/VALIDATION_REPORT.md`
