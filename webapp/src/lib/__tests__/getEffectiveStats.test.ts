/**
 * getEffectiveStats のテスト
 * - スコアタイプに応じて有効なサブステ StatKey の Set を返す
 */

import { describe, it, expect } from 'vitest'
import { getEffectiveStats } from '@/lib/scoring'

describe('getEffectiveStats', () => {
  it('CV は会心率と会心ダメージのみ', () => {
    const result = getEffectiveStats('CV')
    expect(result).toEqual(new Set(['critRate_', 'critDMG_']))
  })

  it('HP型は会心率・会心ダメージ・HP%', () => {
    const result = getEffectiveStats('HP型')
    expect(result).toEqual(new Set(['critRate_', 'critDMG_', 'hp_']))
  })

  it('攻撃型は会心率・会心ダメージ・攻撃力%', () => {
    const result = getEffectiveStats('攻撃型')
    expect(result).toEqual(new Set(['critRate_', 'critDMG_', 'atk_']))
  })

  it('防御型は会心率・会心ダメージ・防御力%', () => {
    const result = getEffectiveStats('防御型')
    expect(result).toEqual(new Set(['critRate_', 'critDMG_', 'def_']))
  })

  it('熟知型は会心率・会心ダメージ・元素熟知', () => {
    const result = getEffectiveStats('熟知型')
    expect(result).toEqual(new Set(['critRate_', 'critDMG_', 'eleMas']))
  })

  it('チャージ型は会心率・会心ダメージ・元素チャージ効率', () => {
    const result = getEffectiveStats('チャージ型')
    expect(result).toEqual(new Set(['critRate_', 'critDMG_', 'enerRech_']))
  })

  it('最良型は bestType に準じる（攻撃型）', () => {
    const result = getEffectiveStats('最良型', '攻撃型')
    expect(result).toEqual(new Set(['critRate_', 'critDMG_', 'atk_']))
  })

  it('最良型で bestType が未指定の場合は CV と同じ', () => {
    const result = getEffectiveStats('最良型')
    expect(result).toEqual(new Set(['critRate_', 'critDMG_']))
  })
})
