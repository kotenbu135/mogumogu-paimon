/**
 * メインステータスとスコアタイプの不一致時のスコア0化テスト (Issue #76)
 *
 * メインステがスコアタイプと一致しない場合、そのスコアを0にする。
 * 例: mainStatKey = 'eleMas' のとき、防御型スコアは0
 */

import { describe, it, expect } from 'vitest'
import { calculateAllScores, calculateScores } from '@/lib/scoring'
import type { Artifact, MainStatKey } from '@/lib/types'

/** テスト用聖遺物を生成する */
function makeArtifact(mainStatKey: MainStatKey, substats: Artifact['substats']): Artifact {
  return {
    setKey: 'GladiatorsFinale',
    slotKey: 'sands',
    level: 20,
    rarity: 5,
    mainStatKey,
    location: '',
    lock: false,
    totalRolls: 9,
    substats,
  }
}

/** イシューの例に基づいた聖遺物（メインステ: 元素熟知） */
const eleMasArtifact = makeArtifact('eleMas', [
  { key: 'critRate_', value: 6.6 },
  { key: 'critDMG_', value: 17.9 },
  { key: 'def_', value: 7.3 },
  { key: 'atk', value: 53 },
])

describe('calculateAllScores: メインステと不一致のスコアタイプは0になる', () => {
  it('メインステが eleMas のとき、防御型スコアは0になる', () => {
    const scores = calculateAllScores(eleMasArtifact)
    expect(scores['防御型']).toBe(0)
  })

  it('メインステが eleMas のとき、HP型スコアは0になる', () => {
    const scores = calculateAllScores(eleMasArtifact)
    expect(scores['HP型']).toBe(0)
  })

  it('メインステが eleMas のとき、攻撃型スコアは0になる', () => {
    const scores = calculateAllScores(eleMasArtifact)
    expect(scores['攻撃型']).toBe(0)
  })

  it('メインステが eleMas のとき、チャージ型スコアは0になる', () => {
    const scores = calculateAllScores(eleMasArtifact)
    expect(scores['チャージ型']).toBe(0)
  })

  it('メインステが eleMas のとき、熟知型スコアはCVと等しい（熟知はサブステにないため）', () => {
    const scores = calculateAllScores(eleMasArtifact)
    // CV = 6.6 × 2 + 17.9 = 31.1、熟知型 = CV + 0 × 0.25 = 31.1
    expect(scores['熟知型']).toBeCloseTo(scores['CV'], 5)
  })

  it('メインステが eleMas のとき、CVスコアは変わらない', () => {
    const scores = calculateAllScores(eleMasArtifact)
    // CV = 6.6 × 2 + 17.9 = 31.1
    expect(scores['CV']).toBeCloseTo(31.1, 1)
  })

  it('メインステが def_ のとき、防御型スコアは正常計算される', () => {
    const artifact = makeArtifact('def_', [
      { key: 'critRate_', value: 6.6 },
      { key: 'critDMG_', value: 17.9 },
      { key: 'def_', value: 7.3 },
    ])
    const scores = calculateAllScores(artifact)
    // 防御型 = CV + def_ × 0.8 = 31.1 + 7.3 × 0.8 = 36.94
    expect(scores['防御型']).toBeCloseTo(36.94, 1)
  })

  it('メインステが def_ のとき、HP型スコアは0になる', () => {
    const artifact = makeArtifact('def_', [
      { key: 'critRate_', value: 6.6 },
      { key: 'critDMG_', value: 17.9 },
      { key: 'hp_', value: 5.8 },
    ])
    const scores = calculateAllScores(artifact)
    expect(scores['HP型']).toBe(0)
  })

  it('メインステが atk_ のとき、攻撃型スコアは正常計算される', () => {
    const artifact = makeArtifact('atk_', [
      { key: 'critRate_', value: 6.6 },
      { key: 'critDMG_', value: 17.9 },
      { key: 'atk_', value: 10.0 },
    ])
    const scores = calculateAllScores(artifact)
    // 攻撃型 = CV + atk_ × 1.0 = 31.1 + 10.0 = 41.1
    expect(scores['攻撃型']).toBeCloseTo(41.1, 1)
    expect(scores['防御型']).toBe(0)
    expect(scores['HP型']).toBe(0)
    expect(scores['熟知型']).toBe(0)
    expect(scores['チャージ型']).toBe(0)
  })
})

describe('calculateAllScores: 型なしメインステは全スコアを正常計算する', () => {
  it('メインステが hp（花）のとき、全スコアが正常計算される', () => {
    const artifact = makeArtifact('hp', [
      { key: 'critRate_', value: 6.6 },
      { key: 'critDMG_', value: 17.9 },
      { key: 'def_', value: 7.3 },
      { key: 'atk_', value: 5.0 },
    ])
    const scores = calculateAllScores(artifact)
    // 防御型 = CV + 7.3 × 0.8 = 36.94（0にならない）
    expect(scores['防御型']).toBeCloseTo(36.94, 1)
    // 攻撃型 = CV + 5.0 × 1.0 = 36.1（0にならない）
    expect(scores['攻撃型']).toBeCloseTo(36.1, 1)
  })

  it('メインステが atk（羽）のとき、全スコアが正常計算される', () => {
    const artifact = makeArtifact('atk', [
      { key: 'critRate_', value: 6.6 },
      { key: 'critDMG_', value: 17.9 },
      { key: 'hp_', value: 5.8 },
    ])
    const scores = calculateAllScores(artifact)
    expect(scores['HP型']).toBeCloseTo(31.1 + 5.8, 1)
  })

  it('メインステが hydro_dmg_（杯）のとき、全スコアが正常計算される', () => {
    const artifact = makeArtifact('hydro_dmg_', [
      { key: 'critRate_', value: 6.6 },
      { key: 'critDMG_', value: 17.9 },
      { key: 'def_', value: 7.3 },
    ])
    const scores = calculateAllScores(artifact)
    expect(scores['防御型']).toBeCloseTo(36.94, 1)
  })

  it('メインステが critRate_（冠）のとき、全スコアが正常計算される', () => {
    const artifact = makeArtifact('critRate_', [
      { key: 'critDMG_', value: 17.9 },
      { key: 'def_', value: 7.3 },
      { key: 'atk_', value: 5.0 },
    ])
    const scores = calculateAllScores(artifact)
    // critRate_ はサブステに出ないが、冠のメインステは型なし扱い
    expect(scores['防御型']).toBeGreaterThan(0)
    expect(scores['攻撃型']).toBeGreaterThan(0)
  })
})

describe('calculateAllScores: 最良型スコアはメインステフィルタ後の最大値', () => {
  it('メインステが eleMas のとき、最良型はCVか熟知型の最大値', () => {
    const scores = calculateAllScores(eleMasArtifact)
    const validScores = [scores['CV'], scores['熟知型']]
    expect(scores['最良型']).toBeCloseTo(Math.max(...validScores), 5)
  })
})

describe('calculateScores: メインステと不一致のスコアタイプはbestTypeにならない', () => {
  it('メインステが eleMas のとき、防御型がbest型にならない', () => {
    const result = calculateScores(eleMasArtifact)
    expect(result.bestType).not.toBe('防御型')
  })

  it('メインステが eleMas のとき、bestScoreはCVと等しい（一致する追加ステがない場合）', () => {
    const result = calculateScores(eleMasArtifact)
    // CV = 31.1、熟知型 = 31.1（eleMasはサブステにないため）
    expect(result.bestScore).toBeCloseTo(31.1, 1)
  })

  it('メインステが def_ で防御力%がサブステにある場合、防御型がbest型になる', () => {
    const artifact = makeArtifact('def_', [
      { key: 'critRate_', value: 6.6 },
      { key: 'critDMG_', value: 17.9 },
      { key: 'def_', value: 7.3 },
    ])
    const result = calculateScores(artifact)
    expect(result.bestType).toBe('防御型')
  })
})
