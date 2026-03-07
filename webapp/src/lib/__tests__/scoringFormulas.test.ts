/**
 * スコアタイプ計算式定数のテスト
 * - ja.scoreFormulas: 各スコアタイプの表示ラベルと計算式を保持
 */

import { describe, it, expect } from 'vitest'
import { ja } from '@/lib/i18n/ja'

const scoreFormulas = ja.scoreFormulas
const EXPECTED_SCORE_TYPES = ['CV', 'HP型', '攻撃型', '防御型', '熟知型', 'チャージ型', '最良型'] as const

describe('scoreFormulas', () => {
  it('全スコアタイプのエントリが存在する', () => {
    for (const type of EXPECTED_SCORE_TYPES) {
      expect(scoreFormulas[type]).toBeDefined()
    }
  })

  it('各エントリに label と formula が含まれる', () => {
    for (const type of EXPECTED_SCORE_TYPES) {
      const entry = scoreFormulas[type]
      expect(entry.label).toBeTruthy()
      expect(entry.formula).toBeTruthy()
    }
  })

  it('CVスコアの計算式に会心率と会心ダメージが含まれる', () => {
    const formula = scoreFormulas['CV'].formula
    expect(formula).toContain('会心率')
    expect(formula).toContain('会心ダメージ')
  })

  it('HP型の計算式にHP%が含まれる', () => {
    expect(scoreFormulas['HP型'].formula).toContain('HP%')
  })

  it('攻撃型の計算式に攻撃力%が含まれる', () => {
    expect(scoreFormulas['攻撃型'].formula).toContain('攻撃力%')
  })

  it('防御型の計算式に防御力%が含まれる', () => {
    expect(scoreFormulas['防御型'].formula).toContain('防御力%')
  })

  it('熟知型の計算式に元素熟知が含まれる', () => {
    expect(scoreFormulas['熟知型'].formula).toContain('元素熟知')
  })

  it('チャージ型の計算式に元素チャージが含まれる', () => {
    expect(scoreFormulas['チャージ型'].formula).toContain('元素チャージ')
  })

  it('最良型のエントリが存在する', () => {
    expect(scoreFormulas['最良型']).toBeDefined()
    expect(scoreFormulas['最良型'].label).toBeTruthy()
    expect(scoreFormulas['最良型'].formula).toBeTruthy()
  })
})
