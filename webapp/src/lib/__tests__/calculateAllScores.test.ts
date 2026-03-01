/**
 * calculateAllScores の最良型スコアテスト
 */

import { describe, it, expect } from 'vitest'
import { calculateAllScores } from '@/lib/scoring'
import type { Artifact } from '@/lib/types'

/** テスト用ダミー聖遺物（攻撃型が最高になるよう設定） */
function makeArtifact(): Artifact {
  return {
    setKey: 'GladiatorsFinale',
    slotKey: 'flower',
    level: 20,
    rarity: 5,
    mainStatKey: 'hp',
    location: '',
    lock: false,
    totalRolls: 9,
    substats: [
      { key: 'critRate_', value: 10.5 },
      { key: 'critDMG_', value: 21.0 },
      { key: 'atk_', value: 15.0 },
      { key: 'hp_', value: 5.8 },
    ],
  }
}

describe('calculateAllScores の最良型', () => {
  it('最良型スコアが全スコアタイプのうち最高値と一致する', () => {
    const artifact = makeArtifact()
    const scores = calculateAllScores(artifact)

    const types = ['CV', 'HP型', '攻撃型', '防御型', '熟知型', 'チャージ型'] as const
    const maxScore = Math.max(...types.map((t) => scores[t]))

    expect(scores['最良型']).toBeCloseTo(maxScore, 5)
  })

  it('最良型スコアは CV 以上である', () => {
    const artifact = makeArtifact()
    const scores = calculateAllScores(artifact)
    expect(scores['最良型']).toBeGreaterThanOrEqual(scores['CV'])
  })

  it('サブステに攻撃力%が高い場合、最良型スコアは攻撃型スコアと一致する', () => {
    const artifact: Artifact = {
      setKey: 'GladiatorsFinale',
      slotKey: 'flower',
      level: 20,
      rarity: 5,
      mainStatKey: 'hp',
      location: '',
      lock: false,
      totalRolls: 9,
      substats: [
        { key: 'critRate_', value: 5.0 },
        { key: 'critDMG_', value: 10.0 },
        { key: 'atk_', value: 20.0 },  // 攻撃型が優位
        { key: 'enerRech_', value: 5.0 },
      ],
    }
    const scores = calculateAllScores(artifact)
    expect(scores['最良型']).toBeCloseTo(scores['攻撃型'], 5)
  })
})
