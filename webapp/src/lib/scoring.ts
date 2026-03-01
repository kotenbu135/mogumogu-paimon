/**
 * スコア計算ロジック（score_artifacts.py の TypeScript 移植）
 *
 * スコアリング基準:
 *   CVスコア    = 会心率 × 2 + 会心ダメージ
 *   HP型        = CV + HP%
 *   攻撃型      = CV + 攻撃力%
 *   防御型      = CV + 防御力% × 0.8
 *   熟知型      = CV + 元素熟知 × 0.25
 *   チャージ型  = CV + 元素チャージ × 0.9
 */

import type { Artifact, ScoreResult, ScoreTypeName, StatKey } from './types'
import { PERCENT_STATS } from './constants'

// サブステの4段階ティア値（低/中/高/最高）
const SUBSTAT_TIERS: Record<StatKey, number[]> = {
  hp: [209, 239, 269, 299],
  atk: [14, 16, 18, 19],
  def: [16, 19, 21, 23],
  hp_: [4.1, 4.7, 5.3, 5.8],
  atk_: [4.1, 4.7, 5.3, 5.8],
  def_: [5.1, 5.8, 6.6, 7.3],
  enerRech_: [4.5, 5.2, 5.8, 6.5],
  eleMas: [16, 19, 21, 23],
  critRate_: [2.7, 3.1, 3.5, 3.9],
  critDMG_: [5.4, 6.2, 7.0, 7.8],
}

// 平均強化幅
export const AVG_INCREMENT: Record<StatKey, number> = {
  hp: 254,
  atk: 16.75,
  def: 19.75,
  hp_: 4.975,
  atk_: 4.975,
  def_: 6.2,
  enerRech_: 5.5,
  eleMas: 19.75,
  critRate_: 3.3,
  critDMG_: 6.6,
}

// スコア種別の定義: [ScoreTypeName, サブステkey, 係数]
const SCORE_TYPE_DEFS: [ScoreTypeName, StatKey, number][] = [
  ['HP型', 'hp_', 1.0],
  ['攻撃型', 'atk_', 1.0],
  ['防御型', 'def_', 0.8],
  ['熟知型', 'eleMas', 0.25],
  ['チャージ型', 'enerRech_', 0.9],
]

/** 浮動小数点回避用スケール係数 */
function getScale(key: StatKey): number {
  return PERCENT_STATS.has(key) ? 10 : 1
}

/** バックトラッキングで total_value を num_rolls 個のティア値の和として分解する */
function backtrack(
  tiers: number[],
  target: number,
  remaining: number,
  minIdx: number,
  current: number[]
): boolean {
  if (remaining === 0) return target === 0
  if (target < tiers[0] * remaining) return false
  if (target > tiers[tiers.length - 1] * remaining) return false

  for (let i = minIdx; i < tiers.length; i++) {
    current.push(tiers[i])
    if (backtrack(tiers, target - tiers[i], remaining - 1, i, current)) return true
    current.pop()
  }
  return false
}

/** サブステの値を numRolls 個のティア値の和として分解する */
export function decomposeRolls(
  key: StatKey,
  totalValue: number,
  numRolls: number
): number[] | null {
  const tiers = SUBSTAT_TIERS[key]
  if (!tiers || numRolls <= 0) return null

  const scale = getScale(key)
  const target = Math.round(totalValue * scale)
  const scaledTiers = [...tiers.map((t) => Math.round(t * scale))].sort((a, b) => a - b)

  const result: number[] = []
  if (backtrack(scaledTiers, target, numRolls, 0, result)) {
    return result.map((v) => v / scale)
  }

  // 誤差 ±1 で再試行
  for (const delta of [1, -1]) {
    const r: number[] = []
    if (backtrack(scaledTiers, target + delta, numRolls, 0, r)) {
      return r.map((v) => v / scale)
    }
  }
  return null
}

/**
 * サブステの値から強化ロール数の範囲を返す（初期ロールを除く）
 * 強化ロール = 全ロール - 1（初期分）
 */
function getUpgradeRollRange(key: StatKey, value: number): [number, number] {
  const tiers = SUBSTAT_TIERS[key]
  if (!tiers || value <= 0) return [0, 0]

  const scale = getScale(key)
  const sv = Math.round(value * scale)
  const tMax = Math.round(Math.max(...tiers) * scale)
  const tMin = Math.round(Math.min(...tiers) * scale)

  // 全ロール数の範囲から初期ロール1を引く
  const totalLo = Math.max(1, Math.ceil(sv / tMax))
  const totalHi = Math.max(1, Math.floor(sv / tMin))
  const lo = Math.max(0, totalLo - 1)
  const hi = Math.max(0, totalHi - 1)
  return [lo, hi]
}

/**
 * 各サブステの強化ロール数を推定する（初期ロールを除いた強化回数）
 * 合計 = totalRolls - substats.length（3OPなら4、4OPなら5）
 */
export function estimateRollCounts(artifact: Artifact): number[] {
  const substats = artifact.substats
  const n = substats.length
  // 強化ロールの合計 = 全ロール - 初期ロール数（サブステ数と同じ）
  const upgradeTarget = artifact.totalRolls - n

  const ranges = substats.map((s) => getUpgradeRollRange(s.key, s.value))
  const result = new Array<number>(n).fill(0)

  function search(idx: number, remaining: number): boolean {
    if (idx === n) return remaining === 0

    const restRanges = ranges.slice(idx + 1)
    const restMin = restRanges.reduce((sum, r) => sum + r[0], 0)
    const restMax = restRanges.reduce((sum, r) => sum + r[1], 0)

    const [lo, hi] = ranges[idx]
    for (let r = lo; r <= hi; r++) {
      const left = remaining - r
      if (left < restMin || left > restMax) continue
      result[idx] = r
      if (search(idx + 1, left)) return true
      result[idx] = 0
    }
    return false
  }

  if (search(0, upgradeTarget)) return result

  // フォールバック: 平均値ベースの推定（強化ロールのみ）
  const raw = substats.map((s) => {
    const avg = AVG_INCREMENT[s.key] ?? 1
    // 全ロール数推定から1を引いて強化回数へ
    return Math.max(0, s.value / avg - 1)
  })
  const floorRolls = raw.map((r) => Math.max(0, Math.floor(r)))
  let remainder = upgradeTarget - floorRolls.reduce((a, b) => a + b, 0)

  if (remainder > 0) {
    const frac = raw
      .map((r, i) => [i, r - Math.floor(r)] as [number, number])
      .sort((a, b) => b[1] - a[1])
    for (let j = 0; j < Math.min(remainder, frac.length); j++) {
      floorRolls[frac[j][0]]++
    }
  }
  return floorRolls
}

/** CVスコアと最高スコア（型名付き）を返す */
export function calculateScores(artifact: Artifact): ScoreResult {
  const subMap: Partial<Record<StatKey, number>> = {}
  for (const s of artifact.substats) {
    subMap[s.key] = s.value
  }

  const critRate = subMap['critRate_'] ?? 0
  const critDmg = subMap['critDMG_'] ?? 0
  const cv = critRate * 2 + critDmg

  let bestScore = cv
  let bestType = 'CV'

  for (const [name, key, coeff] of SCORE_TYPE_DEFS) {
    const score = cv + (subMap[key] ?? 0) * coeff
    if (score > bestScore) {
      bestScore = score
      bestType = name
    }
  }

  return { cvScore: cv, bestScore, bestType }
}

/** 全スコアタイプのスコアを一度に返す */
export function calculateAllScores(artifact: Artifact): Record<ScoreTypeName, number> {
  const subMap: Partial<Record<StatKey, number>> = {}
  for (const s of artifact.substats) {
    subMap[s.key] = s.value
  }

  const cv = (subMap['critRate_'] ?? 0) * 2 + (subMap['critDMG_'] ?? 0)

  const baseScores = {
    'CV': cv,
    'HP型': cv + (subMap['hp_'] ?? 0) * 1.0,
    '攻撃型': cv + (subMap['atk_'] ?? 0) * 1.0,
    '防御型': cv + (subMap['def_'] ?? 0) * 0.8,
    '熟知型': cv + (subMap['eleMas'] ?? 0) * 0.25,
    'チャージ型': cv + (subMap['enerRech_'] ?? 0) * 0.9,
  }
  const scores: Record<ScoreTypeName, number> = {
    ...baseScores,
    '最良型': Math.max(...Object.values(baseScores)),
  }
  return scores
}
