/**
 * 再構築成功率計算モジュール
 *
 * 再構築でスコアが向上する確率を多項分布ベースで算出する。
 * 手順:
 *   1. 強化N回を4サブステに振り分ける全パターンを列挙
 *   2. 保証条件（選択2サブステへの合計 >= 閾値）でフィルタ
 *   3. 各パターンの再構築後スコアを期待値ベースで算出
 *   4. 現在スコアを上回るパターンの正規化確率を合計
 */

import type { Artifact, MainStatKey, ReconstructionType, ScoreTypeName, StatKey } from './types'
import { AVG_INCREMENT } from './scoring'
import { SCORE_TYPE_DEFS, TYPED_MAIN_STATS } from './constants'

/** 再構築種別ごとの保証閾値（選択2サブステへの合計ロール数） */
const GUARANTEE_THRESHOLDS: Record<ReconstructionType, number> = {
  normal: 2,
  advanced: 3,
  absolute: 4,
}

/**
 * スコアタイプと聖遺物に応じた保証サブステ候補ペアを返す
 *
 * 基本: critRate_ + critDMG_
 * 理の冠でメインステが会心系の場合:
 *   - メインステと同じサブステは出現しないため、代わりにスコアタイプ固有ステを使用
 *   - CV型: 固有ステがないため空配列（= 計算不可）
 *   - 最良型: 全固有ステを候補に
 */
function getGuaranteedPairs(
  scoreType: ScoreTypeName,
  artifact: Artifact,
): [StatKey, StatKey][] {
  const mainStat = artifact.mainStatKey
  const critRateBlocked = mainStat === 'critRate_'
  const critDMGBlocked = mainStat === 'critDMG_'

  // メインステが会心系でない場合は全スコアタイプ共通で critRate_ + critDMG_
  if (!critRateBlocked && !critDMGBlocked) {
    return [['critRate_', 'critDMG_']]
  }

  // メインステが会心系の場合、残った会心ステとスコアタイプ固有ステのペア
  const remainingCrit: StatKey = critRateBlocked ? 'critDMG_' : 'critRate_'

  // CV型は固有ステがないため計算不可
  if (scoreType === 'CV') return []

  // 最良型は全固有ステを候補に
  if (scoreType === '最良型') {
    return SCORE_TYPE_DEFS.map(([, key]) => [remainingCrit, key])
  }

  // その他: スコアタイプ固有ステとペア
  const extra = SCORE_TYPE_DEFS.find(([name]) => name === scoreType)
  if (!extra) return []
  return [[remainingCrit, extra[1]]]
}

// ── 数学ユーティリティ ──────────────────────────

function factorial(n: number): number {
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

/**
 * 多項分布の確率を計算
 * P(r0,r1,...) = n! / (r0!×r1!×...) × (1/k)^n
 */
export function multinomialProb(pattern: number[]): number {
  const n = pattern.reduce((a, b) => a + b, 0)
  const k = pattern.length
  let denom = 1
  for (const r of pattern) denom *= factorial(r)
  return (factorial(n) / denom) * Math.pow(1 / k, n)
}

/**
 * boxes 個の箱に total 個を分配する全パターンを列挙
 * 戻り値: 各パターンは長さ boxes の配列で合計が total
 */
export function enumeratePatterns(boxes: number, total: number): number[][] {
  const results: number[][] = []
  const current = new Array(boxes).fill(0)

  function generate(idx: number, remaining: number) {
    if (idx === boxes - 1) {
      current[idx] = remaining
      results.push([...current])
      return
    }
    for (let r = 0; r <= remaining; r++) {
      current[idx] = r
      generate(idx + 1, remaining - r)
    }
  }

  generate(0, total)
  return results
}

/**
 * スコアタイプと聖遺物に応じた保証サブステのインデックスペアを返す
 * 候補ペアの中で最初に両方揃っているものを採用
 * @returns [indexA, indexB] または null（揃わない場合）
 */
export function getGuaranteedIndices(
  scoreType: ScoreTypeName,
  artifact: Artifact,
): [number, number] | null {
  const pairs = getGuaranteedPairs(scoreType, artifact)

  for (const [keyA, keyB] of pairs) {
    const idxA = artifact.substats.findIndex((s) => s.key === keyA)
    const idxB = artifact.substats.findIndex((s) => s.key === keyB)
    if (idxA !== -1 && idxB !== -1) return [idxA, idxB]
  }
  return null
}

/** サブステ値マップから指定スコアタイプのスコアを計算 */
function calcScore(
  subMap: Partial<Record<StatKey, number>>,
  scoreType: ScoreTypeName,
  mainStatKey: MainStatKey,
): number {
  const cv = (subMap['critRate_'] ?? 0) * 2 + (subMap['critDMG_'] ?? 0)

  if (scoreType === 'CV') return cv

  if (scoreType === '最良型') {
    let best = cv
    for (const [, key, coeff] of SCORE_TYPE_DEFS) {
      if (TYPED_MAIN_STATS.has(mainStatKey) && mainStatKey !== key) continue
      const s = cv + (subMap[key] ?? 0) * coeff
      if (s > best) best = s
    }
    return best
  }

  const extra = SCORE_TYPE_DEFS.find(([name]) => name === scoreType)
  if (!extra) return cv
  if (TYPED_MAIN_STATS.has(mainStatKey) && mainStatKey !== extra[1]) return 0
  return cv + (subMap[extra[1]] ?? 0) * extra[2]
}

/**
 * 再構築成功率を計算する
 *
 * @param artifact    対象聖遺物
 * @param rollCounts  各サブステの強化ロール数（初期ロール除く）
 * @param scoreType   スコアタイプ
 * @param reconType   再構築種別
 * @returns 成功率（0〜100）。対象外の場合は null
 */
export function calculateReconstructionRate(
  artifact: Artifact,
  rollCounts: number[],
  scoreType: ScoreTypeName,
  reconType: ReconstructionType,
): number | null {
  // ★5 Lv.20 以外は対象外
  if (artifact.rarity !== 5 || artifact.level !== 20) return null

  // totalRolls 上限チェック（DoS 防止: enumeratePatterns の計算量爆発を防ぐ）
  if (artifact.totalRolls > 20) return null

  const { substats } = artifact
  if (substats.length !== 4) return null

  // 強化ロール合計
  const enhTotal = rollCounts.reduce((a, b) => a + b, 0)
  if (enhTotal <= 0) return null

  // 全候補ペアを試し、最大の成功率を返す
  const pairs = getGuaranteedPairs(scoreType, artifact)

  let bestRate: number | null = null
  for (const [keyA, keyB] of pairs) {
    const idxA = substats.findIndex((s) => s.key === keyA)
    const idxB = substats.findIndex((s) => s.key === keyB)
    if (idxA === -1 || idxB === -1) continue

    const rate = calcRateForPair(substats, rollCounts, enhTotal, scoreType, reconType, idxA, idxB, artifact.mainStatKey)
    if (rate !== null && (bestRate === null || rate > bestRate)) {
      bestRate = rate
    }
  }
  return bestRate
}

/** 特定の保証ペアに対する成功率を計算 */
function calcRateForPair(
  substats: Artifact['substats'],
  rollCounts: number[],
  enhTotal: number,
  scoreType: ScoreTypeName,
  reconType: ReconstructionType,
  idxA: number,
  idxB: number,
  mainStatKey: MainStatKey,
): number | null {
  const threshold = GUARANTEE_THRESHOLDS[reconType]

  // 現在のスコア
  const currentSubMap: Partial<Record<StatKey, number>> = {}
  for (const s of substats) currentSubMap[s.key] = s.value
  const currentScore = calcScore(currentSubMap, scoreType, mainStatKey)

  // 初期ロール値を推定: 現在値 - 平均強化幅 × 強化ロール数（負にならないようクリッピング）
  const initialValues = substats.map((s, i) =>
    Math.max(0, s.value - AVG_INCREMENT[s.key] * rollCounts[i])
  )

  // 全パターンを列挙して保証フィルタ → スコア比較
  const patterns = enumeratePatterns(4, enhTotal)
  let totalFilteredProb = 0
  let successProb = 0

  for (const pattern of patterns) {
    if (pattern[idxA] + pattern[idxB] < threshold) continue

    const prob = multinomialProb(pattern)
    totalFilteredProb += prob

    // 再構築後のスコアを期待値ベースで算出
    const newSubMap: Partial<Record<StatKey, number>> = {}
    for (let i = 0; i < substats.length; i++) {
      newSubMap[substats[i].key] = initialValues[i] + AVG_INCREMENT[substats[i].key] * pattern[i]
    }
    if (calcScore(newSubMap, scoreType, mainStatKey) > currentScore) {
      successProb += prob
    }
  }

  if (totalFilteredProb === 0) return null
  return (successProb / totalFilteredProb) * 100
}
