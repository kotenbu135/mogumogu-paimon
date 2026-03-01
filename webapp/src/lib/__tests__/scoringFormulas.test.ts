/**
 * スコアタイプ計算式定数のテスト
 * - SCORE_TYPE_FORMULAS: 各スコアタイプの表示ラベルと計算式を保持
 */

import { describe, it, expect } from 'vitest'
import { SCORE_TYPE_FORMULAS } from '@/lib/constants'

const EXPECTED_SCORE_TYPES = ['CV', 'HP型', '攻撃型', '防御型', '熟知型', 'チャージ型', '最良型'] as const

describe('SCORE_TYPE_FORMULAS', () => {
  it('全スコアタイプのエントリが存在する', () => {
    for (const type of EXPECTED_SCORE_TYPES) {
      expect(SCORE_TYPE_FORMULAS[type]).toBeDefined()
    }
  })

  it('各エントリに label と formula が含まれる', () => {
    for (const type of EXPECTED_SCORE_TYPES) {
      const entry = SCORE_TYPE_FORMULAS[type]
      expect(entry.label).toBeTruthy()
      expect(entry.formula).toBeTruthy()
    }
  })

  it('CVスコアの計算式に会心率と会心ダメージが含まれる', () => {
    const formula = SCORE_TYPE_FORMULAS['CV'].formula
    expect(formula).toContain('会心率')
    expect(formula).toContain('会心ダメージ')
  })

  it('HP型の計算式にHP%が含まれる', () => {
    expect(SCORE_TYPE_FORMULAS['HP型'].formula).toContain('HP%')
  })

  it('攻撃型の計算式に攻撃力%が含まれる', () => {
    expect(SCORE_TYPE_FORMULAS['攻撃型'].formula).toContain('攻撃力%')
  })

  it('防御型の計算式に防御力%が含まれる', () => {
    expect(SCORE_TYPE_FORMULAS['防御型'].formula).toContain('防御力%')
  })

  it('熟知型の計算式に元素熟知が含まれる', () => {
    expect(SCORE_TYPE_FORMULAS['熟知型'].formula).toContain('元素熟知')
  })

  it('チャージ型の計算式に元素チャージが含まれる', () => {
    expect(SCORE_TYPE_FORMULAS['チャージ型'].formula).toContain('元素チャージ')
  })

  it('最良型のエントリが存在する', () => {
    expect(SCORE_TYPE_FORMULAS['最良型']).toBeDefined()
    expect(SCORE_TYPE_FORMULAS['最良型'].label).toBeTruthy()
    expect(SCORE_TYPE_FORMULAS['最良型'].formula).toBeTruthy()
  })
})
