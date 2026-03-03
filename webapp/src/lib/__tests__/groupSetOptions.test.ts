import { describe, expect, it } from 'vitest'
import { groupSetOptions } from '../constants'

describe('groupSetOptions', () => {
  it('グループに属するセットキーが正しいグループに分類される', () => {
    const keys = ['GladiatorsFinale', 'EmblemOfSeveredFate', 'ViridescentVenerer']
    const result = groupSetOptions(keys)

    expect(result).toEqual([
      { label: 'サブアタッカー用', keys: ['EmblemOfSeveredFate'] },
      { label: 'サポート用', keys: ['ViridescentVenerer'] },
      { label: 'メインアタッカー用（v3以前）', keys: ['GladiatorsFinale'] },
    ])
  })

  it('いずれのグループにも属さないセットキーが「その他」に入る', () => {
    const keys = ['GladiatorsFinale', 'Adventurer', 'Gambler']
    const result = groupSetOptions(keys)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ label: 'メインアタッカー用（v3以前）', keys: ['GladiatorsFinale'] })
    expect(result[1].label).toBe('その他')
    expect(result[1].keys).toContain('Adventurer')
    expect(result[1].keys).toContain('Gambler')
  })

  it('データに存在しないセットキーはグループに含まれない', () => {
    // GladiatorsFinale はメインアタッカー用だが、渡さないのでグループに出ない
    const keys = ['Adventurer']
    const result = groupSetOptions(keys)

    expect(result).toEqual([
      { label: 'その他', keys: ['Adventurer'] },
    ])
  })

  it('空配列を渡すと空配列が返る', () => {
    expect(groupSetOptions([])).toEqual([])
  })

  it('「その他」グループのキーが日本語名でソートされる', () => {
    // 博徒 (ばくと) < 冒険者 (ぼうけんしゃ) in Japanese locale
    const keys = ['Adventurer', 'Gambler']
    const result = groupSetOptions(keys)

    expect(result).toHaveLength(1)
    expect(result[0].label).toBe('その他')
    const names = result[0].keys
    expect(names[0]).toBe('Gambler')    // 博徒
    expect(names[1]).toBe('Adventurer') // 冒険者
  })

  it('グループ内のキーはARTIFACT_SET_GROUPSの定義順を維持する', () => {
    const keys = ['GladiatorsFinale', 'ADayCarvedFromRisingWinds', 'MarechausseeHunter']
    const result = groupSetOptions(keys)

    // v4以降グループが先に来る
    expect(result[0].label).toBe('メインアタッカー用(v4以降)')
    expect(result[0].keys).toEqual([
      'ADayCarvedFromRisingWinds',
      'MarechausseeHunter',
    ])
    // v3以前グループ
    expect(result[1].label).toBe('メインアタッカー用（v3以前）')
    expect(result[1].keys).toEqual(['GladiatorsFinale'])
  })
})
