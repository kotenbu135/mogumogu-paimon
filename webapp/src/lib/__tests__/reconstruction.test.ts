/**
 * 再構築成功率計算のテスト
 */
import { describe, it, expect } from 'vitest'
import type { Artifact } from '@/lib/types'
import {
  enumeratePatterns,
  multinomialProb,
  getGuaranteedIndices,
  calculateReconstructionRate,
} from '@/lib/reconstruction'

// ── テスト用ヘルパー ──────────────────────────

/** テスト用聖遺物を作成 */
function makeArtifact(overrides: Partial<Artifact> = {}): Artifact {
  return {
    setKey: 'GladiatorsFinale',
    slotKey: 'sands',
    level: 20,
    rarity: 5,
    mainStatKey: 'atk_',
    location: '',
    lock: false,
    substats: [
      { key: 'critRate_', value: 10.5 },
      { key: 'critDMG_', value: 19.4 },
      { key: 'hp_', value: 9.9 },
      { key: 'atk', value: 33 },
    ],
    totalRolls: 9,
    ...overrides,
  }
}

// ── enumeratePatterns ──────────────────────────

describe('enumeratePatterns', () => {
  it('4箱に5個を分配するパターン数は56', () => {
    const patterns = enumeratePatterns(4, 5)
    expect(patterns).toHaveLength(56)
  })

  it('各パターンの要素合計が5になる', () => {
    const patterns = enumeratePatterns(4, 5)
    for (const p of patterns) {
      expect(p.reduce((a, b) => a + b, 0)).toBe(5)
      expect(p).toHaveLength(4)
    }
  })

  it('各要素は0以上', () => {
    const patterns = enumeratePatterns(4, 5)
    for (const p of patterns) {
      for (const r of p) {
        expect(r).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('重複パターンがない', () => {
    const patterns = enumeratePatterns(4, 5)
    const set = new Set(patterns.map((p) => p.join(',')))
    expect(set.size).toBe(56)
  })

  it('2箱に3個を分配するパターン数は4', () => {
    const patterns = enumeratePatterns(2, 3)
    expect(patterns).toHaveLength(4)
    // [0,3], [1,2], [2,1], [3,0]
  })
})

// ── multinomialProb ──────────────────────────

describe('multinomialProb', () => {
  it('[5,0,0,0] の確率は 1/1024', () => {
    const prob = multinomialProb([5, 0, 0, 0])
    expect(prob).toBeCloseTo(1 / 1024, 8)
  })

  it('[1,1,1,2] の確率は 60/1024', () => {
    // 5! / (1!1!1!2!) = 120/2 = 60
    const prob = multinomialProb([1, 1, 1, 2])
    expect(prob).toBeCloseTo(60 / 1024, 8)
  })

  it('[1,1,1,1,1] 5箱に1個ずつの確率は 5!/5^5 × 1', () => {
    // 5! / (1!^5) × (1/5)^5 = 120 / 3125
    const prob = multinomialProb([1, 1, 1, 1, 1])
    expect(prob).toBeCloseTo(120 / 3125, 8)
  })

  it('4箱5個の全パターン確率合計が1.0', () => {
    const patterns = enumeratePatterns(4, 5)
    const total = patterns.reduce((sum, p) => sum + multinomialProb(p), 0)
    expect(total).toBeCloseTo(1.0, 8)
  })
})

// ── getGuaranteedIndices ──────────────────────────

describe('getGuaranteedIndices', () => {
  it('全スコアタイプ共通: critRate_ と critDMG_ のインデックスを返す', () => {
    const art = makeArtifact()
    expect(getGuaranteedIndices('CV', art)).toEqual([0, 1])
    expect(getGuaranteedIndices('攻撃型', art)).toEqual([0, 1])
    expect(getGuaranteedIndices('HP型', art)).toEqual([0, 1])
    expect(getGuaranteedIndices('防御型', art)).toEqual([0, 1])
    expect(getGuaranteedIndices('最良型', art)).toEqual([0, 1])
  })

  it('理の冠・メインステ会心率・攻撃型: critDMG_ + atk_ を返す', () => {
    const art = makeArtifact({
      slotKey: 'circlet',
      mainStatKey: 'critRate_',
      substats: [
        { key: 'atk_', value: 10 },
        { key: 'critDMG_', value: 20 },
        { key: 'hp_', value: 5 },
        { key: 'atk', value: 30 },
      ],
    })
    expect(getGuaranteedIndices('攻撃型', art)).toEqual([1, 0])
  })

  it('理の冠・メインステ会心ダメ・攻撃型: critRate_ + atk_ を返す', () => {
    const art = makeArtifact({
      slotKey: 'circlet',
      mainStatKey: 'critDMG_',
      substats: [
        { key: 'critRate_', value: 10 },
        { key: 'atk_', value: 20 },
        { key: 'hp_', value: 5 },
        { key: 'atk', value: 30 },
      ],
    })
    expect(getGuaranteedIndices('攻撃型', art)).toEqual([0, 1])
  })

  it('理の冠・メインステ会心率・CV型: null を返す', () => {
    const art = makeArtifact({
      slotKey: 'circlet',
      mainStatKey: 'critRate_',
      substats: [
        { key: 'atk_', value: 10 },
        { key: 'critDMG_', value: 20 },
        { key: 'hp_', value: 5 },
        { key: 'atk', value: 30 },
      ],
    })
    expect(getGuaranteedIndices('CV', art)).toBeNull()
  })

  it('理の冠・メインステ会心率・最良型: critDMG_ + 固有ステで返す', () => {
    const art = makeArtifact({
      slotKey: 'circlet',
      mainStatKey: 'critRate_',
      substats: [
        { key: 'atk_', value: 10 },
        { key: 'critDMG_', value: 20 },
        { key: 'hp_', value: 5 },
        { key: 'atk', value: 30 },
      ],
    })
    const result = getGuaranteedIndices('最良型', art)
    expect(result).not.toBeNull()
    // critDMG_ は index 1
    expect(result![0]).toBe(1)
    // 固有ステ（atk_ or hp_）のいずれか
    expect([0, 2]).toContain(result![1])
  })

  it('保証サブステが揃わない場合は null', () => {
    const art = makeArtifact({
      substats: [
        { key: 'hp' as const, value: 200 },
        { key: 'atk' as const, value: 20 },
        { key: 'def' as const, value: 30 },
        { key: 'eleMas' as const, value: 40 },
      ],
    })
    expect(getGuaranteedIndices('CV', art)).toBeNull()
  })

  it('最良型（通常部位）: critRate_ + critDMG_ を返す', () => {
    const art = makeArtifact({
      substats: [
        { key: 'hp_' as const, value: 5 },
        { key: 'critRate_' as const, value: 10 },
        { key: 'critDMG_' as const, value: 20 },
        { key: 'atk' as const, value: 30 },
      ],
    })
    expect(getGuaranteedIndices('最良型', art)).toEqual([1, 2])
  })
})

// ── calculateReconstructionRate ──────────────────────────

describe('calculateReconstructionRate', () => {
  it('★5 Lv.20 以外は null を返す', () => {
    const art4star = makeArtifact({ rarity: 4 })
    expect(calculateReconstructionRate(art4star, [2, 1, 1, 1], 'CV', 'normal')).toBeNull()

    const artLv16 = makeArtifact({ level: 16 })
    expect(calculateReconstructionRate(artLv16, [2, 1, 1, 1], 'CV', 'normal')).toBeNull()
  })

  it('totalRolls > 20 の場合は null を返す（DoS 防止）', () => {
    const art = makeArtifact({ totalRolls: 21 })
    expect(calculateReconstructionRate(art, [2, 1, 1, 1], 'CV', 'normal')).toBeNull()

    const artExcessive = makeArtifact({ totalRolls: 1000 })
    expect(calculateReconstructionRate(artExcessive, [250, 250, 250, 250], 'CV', 'normal')).toBeNull()
  })

  it('保証サブステが揃わない場合は null', () => {
    const art = makeArtifact({
      substats: [
        { key: 'hp', value: 500 },
        { key: 'atk', value: 30 },
        { key: 'def', value: 40 },
        { key: 'eleMas', value: 50 },
      ],
    })
    expect(calculateReconstructionRate(art, [1, 1, 1, 2], 'CV', 'normal')).toBeNull()
  })

  it('結果は 0〜100 の範囲の数値', () => {
    const art = makeArtifact()
    const rate = calculateReconstructionRate(art, [2, 1, 1, 1], 'CV', 'normal')
    expect(rate).not.toBeNull()
    expect(rate!).toBeGreaterThanOrEqual(0)
    expect(rate!).toBeLessThanOrEqual(100)
  })

  it('絶対再構築は通常再構築より成功率が高い（保証サブステへのロールが集中するため）', () => {
    // 現在のロール配分が中程度（保証サブステに2ロール）
    const art = makeArtifact({
      substats: [
        { key: 'critRate_', value: 7.2 },   // 初期1+強化1 (3.9+3.3)
        { key: 'critDMG_', value: 14.0 },   // 初期1+強化1 (7.8+6.2 ≈ 14.0)
        { key: 'hp_', value: 14.9 },        // 初期1+強化2
        { key: 'atk', value: 33 },          // 初期1+強化1
      ],
      totalRolls: 9,
    })
    const rollCounts = [1, 1, 2, 1]
    const normalRate = calculateReconstructionRate(art, rollCounts, 'CV', 'normal')
    const absoluteRate = calculateReconstructionRate(art, rollCounts, 'CV', 'absolute')
    expect(normalRate).not.toBeNull()
    expect(absoluteRate).not.toBeNull()
    // 絶対再構築はcritへの保証が4回以上で、通常の2回以上より有利
    expect(absoluteRate!).toBeGreaterThanOrEqual(normalRate!)
  })

  it('既にスコアが高い聖遺物は成功率が低い', () => {
    // 高スコア聖遺物（会心にロールが集中）
    const highArt = makeArtifact({
      substats: [
        { key: 'critRate_', value: 13.2 },  // 初期1+強化3
        { key: 'critDMG_', value: 14.0 },   // 初期1+強化1
        { key: 'hp_', value: 4.7 },         // 初期1+強化0
        { key: 'atk', value: 33 },          // 初期1+強化1
      ],
      totalRolls: 9,
    })
    const highRolls = [3, 1, 0, 1]

    // 低スコア聖遺物（会心以外にロールが分散）
    const lowArt = makeArtifact({
      substats: [
        { key: 'critRate_', value: 3.9 },   // 初期1+強化0
        { key: 'critDMG_', value: 7.0 },    // 初期1+強化0
        { key: 'hp_', value: 14.9 },        // 初期1+強化2
        { key: 'atk', value: 51 },          // 初期1+強化3
      ],
      totalRolls: 9,
    })
    const lowRolls = [0, 0, 2, 3]

    const highRate = calculateReconstructionRate(highArt, highRolls, 'CV', 'normal')
    const lowRate = calculateReconstructionRate(lowArt, lowRolls, 'CV', 'normal')
    expect(highRate).not.toBeNull()
    expect(lowRate).not.toBeNull()
    expect(lowRate!).toBeGreaterThan(highRate!)
  })

  it('攻撃型でも会心率+会心ダメが保証ペアになる', () => {
    const art = makeArtifact({
      substats: [
        { key: 'critRate_', value: 3.9 },
        { key: 'critDMG_', value: 7.8 },
        { key: 'hp_', value: 4.7 },
        { key: 'atk', value: 51 },
      ],
      totalRolls: 9,
    })
    const rollCounts = [0, 0, 0, 5]
    const rate = calculateReconstructionRate(art, rollCounts, '攻撃型', 'normal')
    expect(rate).not.toBeNull()
    expect(rate!).toBeGreaterThan(0)
  })

  it('理の冠・メインステ会心率・攻撃型: critDMG_ + atk_ で計算可能', () => {
    const art = makeArtifact({
      slotKey: 'circlet',
      mainStatKey: 'critRate_',
      substats: [
        { key: 'atk_', value: 5.8 },
        { key: 'critDMG_', value: 7.8 },
        { key: 'hp_', value: 4.7 },
        { key: 'atk', value: 51 },
      ],
      totalRolls: 9,
    })
    const rollCounts = [0, 0, 0, 5]
    const rate = calculateReconstructionRate(art, rollCounts, '攻撃型', 'normal')
    expect(rate).not.toBeNull()
    expect(rate!).toBeGreaterThanOrEqual(0)
    expect(rate!).toBeLessThanOrEqual(100)
  })

  it('理の冠・メインステ会心率・CV型: null を返す', () => {
    const art = makeArtifact({
      slotKey: 'circlet',
      mainStatKey: 'critRate_',
      substats: [
        { key: 'atk_', value: 5.8 },
        { key: 'critDMG_', value: 7.8 },
        { key: 'hp_', value: 4.7 },
        { key: 'atk', value: 51 },
      ],
      totalRolls: 9,
    })
    const rollCounts = [0, 0, 0, 5]
    expect(calculateReconstructionRate(art, rollCounts, 'CV', 'normal')).toBeNull()
  })

  it('理の冠・メインステ会心率・最良型: 計算可能', () => {
    const art = makeArtifact({
      slotKey: 'circlet',
      mainStatKey: 'critRate_',
      substats: [
        { key: 'atk_', value: 5.8 },
        { key: 'critDMG_', value: 7.8 },
        { key: 'hp_', value: 4.7 },
        { key: 'atk', value: 51 },
      ],
      totalRolls: 9,
    })
    const rollCounts = [0, 0, 0, 5]
    const rate = calculateReconstructionRate(art, rollCounts, '最良型', 'normal')
    expect(rate).not.toBeNull()
    expect(rate!).toBeGreaterThanOrEqual(0)
    expect(rate!).toBeLessThanOrEqual(100)
  })

  it('3OPスタート（totalRolls=8）でも計算できる', () => {
    const art = makeArtifact({
      totalRolls: 8,
      substats: [
        { key: 'critRate_', value: 3.9 },
        { key: 'critDMG_', value: 7.8 },
        { key: 'hp_', value: 4.7 },
        { key: 'atk', value: 33 },
      ],
    })
    // 3OP: 強化4回（1回は4つ目のサブステ追加）
    const rollCounts = [0, 0, 0, 4]
    const rate = calculateReconstructionRate(art, rollCounts, 'CV', 'normal')
    expect(rate).not.toBeNull()
    expect(rate!).toBeGreaterThanOrEqual(0)
    expect(rate!).toBeLessThanOrEqual(100)
  })

  it('絶対再構築で enhTotal が少ない場合は null を返す（totalFilteredProb === 0）', () => {
    // enhTotal=1 で absolute（閾値=4）の場合、どのパターンも idxA+idxB >= 4 を満たさない
    const art = makeArtifact({
      substats: [
        { key: 'critRate_', value: 3.9 },
        { key: 'critDMG_', value: 7.8 },
        { key: 'hp_', value: 4.7 },
        { key: 'atk', value: 33 },
      ],
      totalRolls: 5, // substats.length=4 なので enhTotal=1
    })
    const rollCounts = [1, 0, 0, 0]
    const rate = calculateReconstructionRate(art, rollCounts, 'CV', 'absolute')
    expect(rate).toBeNull()
  })

  it('メインステ eleMas で攻撃型: オッズは0%を返す', () => {
    const art = makeArtifact({
      slotKey: 'sands',
      mainStatKey: 'eleMas',
      substats: [
        { key: 'atk', value: 58 },
        { key: 'critRate_', value: 7.0 },
        { key: 'def_', value: 10.9 },
        { key: 'critDMG_', value: 5.4 },
      ],
      totalRolls: 9,
    })
    const rollCounts = [3, 1, 1, 0]
    const rate = calculateReconstructionRate(art, rollCounts, '攻撃型', 'normal')
    // メインステが eleMas なので攻撃型スコアは必ず0 → オッズも0%
    expect(rate).toBe(0)
  })
})
