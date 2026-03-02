import { describe, expect, it } from 'vitest'
import { groupSetOptions } from '../constants'

describe('groupSetOptions', () => {
  it('グループに属するセットキーが正しいグループに分類される', () => {
    const keys = ['GladiatorsFinale', 'EmblemOfSeveredFate', 'ViridescentVenerer']
    const result = groupSetOptions(keys)

    expect(result).toEqual([
      { label: 'メインアタッカー用', keys: ['GladiatorsFinale'] },
      { label: 'サブアタッカー用', keys: ['EmblemOfSeveredFate'] },
      { label: 'サポート用', keys: ['ViridescentVenerer'] },
    ])
  })

  it('いずれのグループにも属さないセットキーが「その他」に入る', () => {
    const keys = ['GladiatorsFinale', 'Adventurer', 'Gambler']
    const result = groupSetOptions(keys)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ label: 'メインアタッカー用', keys: ['GladiatorsFinale'] })
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

  it('グループ内のキーはIssue記載の順序を維持する', () => {
    const keys = ['GladiatorsFinale', 'ADayCarvedFromRisingWinds', 'MarechausseeHunter']
    const result = groupSetOptions(keys)

    expect(result[0].label).toBe('メインアタッカー用')
    // ARTIFACT_SET_GROUPS の定義順: ADayCarvedFromRisingWinds → MarechausseeHunter → GladiatorsFinale
    expect(result[0].keys).toEqual([
      'ADayCarvedFromRisingWinds',
      'MarechausseeHunter',
      'GladiatorsFinale',
    ])
  })
})
