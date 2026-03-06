import { describe, expect, it } from 'vitest'
import { hasActiveFilter } from '@/lib/filterUtils'

describe('hasActiveFilter', () => {
  it('フィルタがすべて未設定のとき false を返す', () => {
    expect(hasActiveFilter([], '', '', [], '')).toBe(false)
  })

  it('セットフィルタが設定されているとき true を返す', () => {
    expect(hasActiveFilter(['GladiatorsFinale'], '', '', [], '')).toBe(true)
  })

  it('部位フィルタが設定されているとき true を返す', () => {
    expect(hasActiveFilter([], 'flower', '', [], '')).toBe(true)
  })

  it('メインステフィルタが設定されているとき true を返す', () => {
    expect(hasActiveFilter([], '', 'critRate_', [], '')).toBe(true)
  })

  it('サブステフィルタが設定されているとき true を返す', () => {
    expect(hasActiveFilter([], '', '', ['critDMG_'], '')).toBe(true)
  })

  it('初期OPフィルタが 3 のとき true を返す', () => {
    expect(hasActiveFilter([], '', '', [], '3')).toBe(true)
  })

  it('初期OPフィルタが 4 のとき true を返す', () => {
    expect(hasActiveFilter([], '', '', [], '4')).toBe(true)
  })

  it('複数のフィルタが設定されているとき true を返す', () => {
    expect(hasActiveFilter(['GladiatorsFinale'], 'sands', 'atk_', ['critRate_'], '4')).toBe(true)
  })
})
