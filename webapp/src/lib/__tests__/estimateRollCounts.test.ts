/**
 * estimateRollCounts のユニットテスト
 *
 * 各サブステの強化ロール数（初期ロールを除く）を推定する関数のテスト。
 * バックトラッキングで完全一致を試み、失敗時は平均値ベースのフォールバックを使用する。
 */

import { describe, it, expect } from 'vitest'
import type { Artifact } from '@/lib/types'
import { estimateRollCounts } from '@/lib/scoring'

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
    substats: [],
    totalRolls: 9,
    ...overrides,
  }
}

// ── 正常系: バックトラッキング成功 ──────────────────────────

describe('estimateRollCounts - バックトラッキング成功', () => {
  it('4OP (totalRolls=9) の典型的な聖遺物で正しいロール数を返す', () => {
    // critRate_=11.7 → 強化ロール範囲 [2,3]
    // critDMG_=14.0  → 強化ロール範囲 [1,1]
    // atk_=9.9       → 強化ロール範囲 [1,1]
    // def=16.0       → 強化ロール範囲 [0,0]
    // upgradeTarget = 9 - 4 = 5 → [3,1,1,0] が一致
    const artifact = makeArtifact({
      substats: [
        { key: 'critRate_', value: 11.7 },
        { key: 'critDMG_', value: 14.0 },
        { key: 'atk_', value: 9.9 },
        { key: 'def', value: 16.0 },
      ],
      totalRolls: 9,
    })

    const result = estimateRollCounts(artifact)

    expect(result).toEqual([3, 1, 1, 0])
  })

  it('3OP (totalRolls=8) の聖遺物で正しいロール数を返す', () => {
    // critRate_=15.6 → 強化ロール範囲 [3,4]
    // critDMG_=14.0  → 強化ロール範囲 [1,1]
    // atk=16.0       → 強化ロール範囲 [0,0]
    // upgradeTarget = 8 - 3 = 5 → [4,1,0] が一致
    const artifact = makeArtifact({
      substats: [
        { key: 'critRate_', value: 15.6 },
        { key: 'critDMG_', value: 14.0 },
        { key: 'atk', value: 16.0 },
      ],
      totalRolls: 8,
    })

    const result = estimateRollCounts(artifact)

    expect(result).toEqual([4, 1, 0])
  })

  it('1OP (totalRolls=6) の境界ケースで正しいロール数を返す', () => {
    // critDMG_=39.0 → 強化ロール範囲 [4,6]
    // upgradeTarget = 6 - 1 = 5 → [5] が一致
    const artifact = makeArtifact({
      substats: [{ key: 'critDMG_', value: 39.0 }],
      totalRolls: 6,
    })

    const result = estimateRollCounts(artifact)

    expect(result).toEqual([5])
  })
})

// ── 正常系: ロール数の合計検証 ──────────────────────────

describe('estimateRollCounts - ロール数合計の検証', () => {
  it('バックトラッキング成功時、ロール数の合計が totalRolls - substats.length と一致する', () => {
    const artifact = makeArtifact({
      substats: [
        { key: 'critRate_', value: 11.7 },
        { key: 'critDMG_', value: 14.0 },
        { key: 'atk_', value: 9.9 },
        { key: 'def', value: 16.0 },
      ],
      totalRolls: 9,
    })

    const result = estimateRollCounts(artifact)
    const upgradeTarget = artifact.totalRolls - artifact.substats.length

    expect(result.reduce((a, b) => a + b, 0)).toBe(upgradeTarget)
  })

  it('各要素が 0 以上の整数である', () => {
    const artifact = makeArtifact({
      substats: [
        { key: 'critRate_', value: 11.7 },
        { key: 'critDMG_', value: 14.0 },
        { key: 'atk_', value: 9.9 },
        { key: 'def', value: 16.0 },
      ],
      totalRolls: 9,
    })

    const result = estimateRollCounts(artifact)

    for (const r of result) {
      expect(r).toBeGreaterThanOrEqual(0)
      expect(Number.isInteger(r)).toBe(true)
    }
  })

  it('戻り値の長さがサブステ数と一致する', () => {
    const artifact = makeArtifact({
      substats: [
        { key: 'critRate_', value: 11.7 },
        { key: 'critDMG_', value: 14.0 },
        { key: 'atk_', value: 9.9 },
        { key: 'def', value: 16.0 },
      ],
      totalRolls: 9,
    })

    const result = estimateRollCounts(artifact)

    expect(result).toHaveLength(artifact.substats.length)
  })
})

// ── 正常系: フォールバック（平均値ベース） ──────────────────────────

describe('estimateRollCounts - フォールバック（平均値ベース推定）', () => {
  it('バックトラッキング失敗時に平均値ベースのフォールバックが機能する', () => {
    // 各サブステのロール範囲合計 max = 3 < upgradeTarget(5) のためバックトラッキング失敗
    // critRate_=9.7  → ロール範囲 [2,2]
    // critDMG_=13.4  → ロール範囲 [1,1]
    // atk_=4.7       → ロール範囲 [0,0]
    // upgradeTarget = 8 - 3 = 5 → フォールバック後 [2,2,1]
    const artifact = makeArtifact({
      substats: [
        { key: 'critRate_', value: 9.7 },
        { key: 'critDMG_', value: 13.4 },
        { key: 'atk_', value: 4.7 },
      ],
      totalRolls: 8,
    })

    const result = estimateRollCounts(artifact)

    expect(result).toEqual([2, 2, 1])
  })

  it('フォールバック時も各要素が 0 以上の整数である', () => {
    const artifact = makeArtifact({
      substats: [
        { key: 'critRate_', value: 9.7 },
        { key: 'critDMG_', value: 13.4 },
        { key: 'atk_', value: 4.7 },
      ],
      totalRolls: 8,
    })

    const result = estimateRollCounts(artifact)

    for (const r of result) {
      expect(r).toBeGreaterThanOrEqual(0)
      expect(Number.isInteger(r)).toBe(true)
    }
  })

  it('フォールバック時も戻り値の長さがサブステ数と一致する', () => {
    const artifact = makeArtifact({
      substats: [
        { key: 'critRate_', value: 9.7 },
        { key: 'critDMG_', value: 13.4 },
        { key: 'atk_', value: 4.7 },
      ],
      totalRolls: 8,
    })

    const result = estimateRollCounts(artifact)

    expect(result).toHaveLength(artifact.substats.length)
  })
})

// ── 境界系 ──────────────────────────

describe('estimateRollCounts - 境界系', () => {
  it('2OP (totalRolls=7) の聖遺物でサブステ数と同じ長さの配列を返す', () => {
    const artifact = makeArtifact({
      substats: [
        { key: 'critRate_', value: 9.7 },
        { key: 'critDMG_', value: 21.6 },
      ],
      totalRolls: 7,
    })

    const result = estimateRollCounts(artifact)

    expect(result).toHaveLength(2)
    for (const r of result) {
      expect(r).toBeGreaterThanOrEqual(0)
      expect(Number.isInteger(r)).toBe(true)
    }
  })

  it('全サブステが最小ティア値（強化なし相当）でも非負整数配列を返す', () => {
    // 各値が1回分の最小ティア値 → upgradeTarget=5 との不整合でフォールバック発動
    const artifact = makeArtifact({
      substats: [
        { key: 'critRate_', value: 2.7 },
        { key: 'critDMG_', value: 5.4 },
        { key: 'atk_', value: 4.1 },
        { key: 'hp_', value: 4.1 },
      ],
      totalRolls: 9,
    })

    const result = estimateRollCounts(artifact)

    expect(result).toHaveLength(4)
    for (const r of result) {
      expect(r).toBeGreaterThanOrEqual(0)
      expect(Number.isInteger(r)).toBe(true)
    }
  })

  it('フォールバック時に remainder > substats.length の場合、Math.min で上限を守る', () => {
    // critRate_=2.7 と critDMG_=5.4 は共に raw≈0 → floorRolls=[0,0]
    // upgradeTarget = 7-2 = 5, remainder=5 > frac.length=2
    // Math.min(5,2)=2 → 各サブステに1ずつ加算 → [1,1]
    const artifact = makeArtifact({
      substats: [
        { key: 'critRate_', value: 2.7 },
        { key: 'critDMG_', value: 5.4 },
      ],
      totalRolls: 7,
    })

    const result = estimateRollCounts(artifact)

    expect(result).toHaveLength(2)
    expect(result).toEqual([1, 1])
    for (const r of result) {
      expect(r).toBeGreaterThanOrEqual(0)
      expect(Number.isInteger(r)).toBe(true)
    }
  })
})
