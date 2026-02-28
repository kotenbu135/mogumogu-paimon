/**
 * メインステータス表示機能のテスト
 * - MAIN_STAT_NAMES: mainStatKey → 日本語名マッピング
 * - getMainStatValue: レベル・レアリティ・statKey → 表示用値
 */

import { describe, it, expect } from 'vitest'
import { MAIN_STAT_NAMES, getMainStatValue } from '@/lib/constants'

describe('MAIN_STAT_NAMES', () => {
  it('既存のサブステ互換キーが含まれる', () => {
    expect(MAIN_STAT_NAMES['hp']).toBe('HP')
    expect(MAIN_STAT_NAMES['atk']).toBe('攻撃力')
    expect(MAIN_STAT_NAMES['def']).toBe('防御力')
    expect(MAIN_STAT_NAMES['hp_']).toBe('HP%')
    expect(MAIN_STAT_NAMES['atk_']).toBe('攻撃力%')
    expect(MAIN_STAT_NAMES['def_']).toBe('防御力%')
    expect(MAIN_STAT_NAMES['enerRech_']).toBe('元素チャージ効率')
    expect(MAIN_STAT_NAMES['eleMas']).toBe('元素熟知')
    expect(MAIN_STAT_NAMES['critRate_']).toBe('会心率')
    expect(MAIN_STAT_NAMES['critDMG_']).toBe('会心ダメージ')
  })

  it('元素ダメージ加成キーが含まれる', () => {
    expect(MAIN_STAT_NAMES['anemo_dmg_']).toBe('風元素ダメージ')
    expect(MAIN_STAT_NAMES['cryo_dmg_']).toBe('氷元素ダメージ')
    expect(MAIN_STAT_NAMES['dendro_dmg_']).toBe('草元素ダメージ')
    expect(MAIN_STAT_NAMES['electro_dmg_']).toBe('雷元素ダメージ')
    expect(MAIN_STAT_NAMES['geo_dmg_']).toBe('岩元素ダメージ')
    expect(MAIN_STAT_NAMES['hydro_dmg_']).toBe('水元素ダメージ')
    expect(MAIN_STAT_NAMES['pyro_dmg_']).toBe('炎元素ダメージ')
    expect(MAIN_STAT_NAMES['physical_dmg_']).toBe('物理ダメージ')
  })

  it('治癒ボーナスキーが含まれる', () => {
    expect(MAIN_STAT_NAMES['heal_']).toBe('治癒ボーナス')
  })
})

describe('getMainStatValue', () => {
  describe('5星聖遺物', () => {
    it('HP(花) Lv20 の値は 4780', () => {
      expect(getMainStatValue(20, 5, 'hp')).toBe('4780')
    })

    it('HP(花) Lv0 の値は 717', () => {
      expect(getMainStatValue(0, 5, 'hp')).toBe('717')
    })

    it('攻撃力(羽) Lv20 の値は 311', () => {
      expect(getMainStatValue(20, 5, 'atk')).toBe('311')
    })

    it('HP% Lv20 の値は 46.6%', () => {
      expect(getMainStatValue(20, 5, 'hp_')).toBe('46.6%')
    })

    it('HP% Lv0 の値は 7.0%', () => {
      expect(getMainStatValue(0, 5, 'hp_')).toBe('7.0%')
    })

    it('会心率 Lv20 の値は 31.1%', () => {
      expect(getMainStatValue(20, 5, 'critRate_')).toBe('31.1%')
    })

    it('会心ダメージ Lv20 の値は 62.2%', () => {
      expect(getMainStatValue(20, 5, 'critDMG_')).toBe('62.2%')
    })

    it('元素チャージ効率 Lv20 の値は 51.8%', () => {
      expect(getMainStatValue(20, 5, 'enerRech_')).toBe('51.8%')
    })

    it('元素熟知 Lv20 の値は 187', () => {
      expect(getMainStatValue(20, 5, 'eleMas')).toBe('187')
    })

    it('防御力% Lv20 の値は 58.3%', () => {
      expect(getMainStatValue(20, 5, 'def_')).toBe('58.3%')
    })

    it('炎元素ダメージ加成 Lv20 の値は 46.6%', () => {
      expect(getMainStatValue(20, 5, 'pyro_dmg_')).toBe('46.6%')
    })

    it('物理ダメージ加成 Lv20 の値は 58.3%', () => {
      expect(getMainStatValue(20, 5, 'physical_dmg_')).toBe('58.3%')
    })

    it('治癒ボーナス Lv20 の値は 35.9%', () => {
      expect(getMainStatValue(20, 5, 'heal_')).toBe('35.9%')
    })
  })

  describe('4星聖遺物', () => {
    it('HP(花) Lv20 の値は 3571', () => {
      expect(getMainStatValue(20, 4, 'hp')).toBe('3571')
    })

    it('攻撃力(羽) Lv20 の値は 232', () => {
      expect(getMainStatValue(20, 4, 'atk')).toBe('232')
    })

    it('HP% Lv20 の値は 35.2%', () => {
      expect(getMainStatValue(20, 4, 'hp_')).toBe('35.2%')
    })
  })

  describe('不明なキー', () => {
    it('未知のキーは空文字を返す', () => {
      expect(getMainStatValue(20, 5, 'unknown_key')).toBe('')
    })
  })
})
