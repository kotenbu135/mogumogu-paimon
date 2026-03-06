import { describe, expect, it } from 'vitest'
import {
  INITIAL_ARTIFACT_FILTER_STATE,
  resetArtifactFilters,
  setMainStatFilter,
  toggleSubStatFilter,
  toggleSetFilter,
  toggleSetGroupFilter,
} from '@/lib/artifactFilters'

describe('INITIAL_ARTIFACT_FILTER_STATE', () => {
  it('すべてのフィルタが未設定の初期値を持つ', () => {
    expect(INITIAL_ARTIFACT_FILTER_STATE).toEqual({
      filterSets: [],
      filterSlot: '',
      filterMainStat: '',
      filterSubStats: [],
      filterInitialOp: '',
    })
  })
})

describe('resetArtifactFilters', () => {
  it('フィルタ設定済み状態から初期値を返す', () => {
    expect(resetArtifactFilters()).toEqual(INITIAL_ARTIFACT_FILTER_STATE)
  })

  it('毎回新しいオブジェクトを返す', () => {
    const a = resetArtifactFilters()
    const b = resetArtifactFilters()
    expect(a).not.toBe(b)
  })
})

describe('setMainStatFilter', () => {
  it('メインステを設定する', () => {
    const state = { ...INITIAL_ARTIFACT_FILTER_STATE }
    const next = setMainStatFilter(state, 'critRate_')
    expect(next.filterMainStat).toBe('critRate_')
  })

  it('メインステと同じキーをサブステフィルタから除外する', () => {
    const state = {
      ...INITIAL_ARTIFACT_FILTER_STATE,
      filterSubStats: ['critRate_', 'critDMG_'] as const,
    }
    const next = setMainStatFilter(state, 'critRate_')
    expect(next.filterSubStats).toEqual(['critDMG_'])
  })

  it('メインステをリセット（空文字）できる', () => {
    const state = { ...INITIAL_ARTIFACT_FILTER_STATE, filterMainStat: 'critRate_' }
    const next = setMainStatFilter(state, '')
    expect(next.filterMainStat).toBe('')
  })

  it('他のフィルタ状態を変更しない', () => {
    const state = {
      ...INITIAL_ARTIFACT_FILTER_STATE,
      filterSets: ['GladiatorsFinale'],
      filterSlot: 'flower' as const,
    }
    const next = setMainStatFilter(state, 'critRate_')
    expect(next.filterSets).toEqual(['GladiatorsFinale'])
    expect(next.filterSlot).toBe('flower')
  })
})

describe('toggleSubStatFilter', () => {
  it('checked=true のときサブステを追加する', () => {
    const state = { ...INITIAL_ARTIFACT_FILTER_STATE }
    const next = toggleSubStatFilter(state, 'critDMG_', true)
    expect(next.filterSubStats).toContain('critDMG_')
  })

  it('checked=false のときサブステを削除する', () => {
    const state = {
      ...INITIAL_ARTIFACT_FILTER_STATE,
      filterSubStats: ['critDMG_', 'atk_'] as const,
    }
    const next = toggleSubStatFilter(state, 'critDMG_', false)
    expect(next.filterSubStats).not.toContain('critDMG_')
    expect(next.filterSubStats).toContain('atk_')
  })

  it('他のフィルタ状態を変更しない', () => {
    const state = {
      ...INITIAL_ARTIFACT_FILTER_STATE,
      filterMainStat: 'atk',
    }
    const next = toggleSubStatFilter(state, 'critDMG_', true)
    expect(next.filterMainStat).toBe('atk')
  })
})

describe('toggleSetFilter', () => {
  it('checked=true のときセットを追加する', () => {
    const state = { ...INITIAL_ARTIFACT_FILTER_STATE }
    const next = toggleSetFilter(state, 'GladiatorsFinale', true)
    expect(next.filterSets).toContain('GladiatorsFinale')
  })

  it('checked=false のときセットを削除する', () => {
    const state = {
      ...INITIAL_ARTIFACT_FILTER_STATE,
      filterSets: ['GladiatorsFinale', 'BlizzardStrayer'],
    }
    const next = toggleSetFilter(state, 'GladiatorsFinale', false)
    expect(next.filterSets).not.toContain('GladiatorsFinale')
    expect(next.filterSets).toContain('BlizzardStrayer')
  })
})

describe('toggleSetGroupFilter', () => {
  it('allSelected=false のとき未選択キーを追加する', () => {
    const state = { ...INITIAL_ARTIFACT_FILTER_STATE }
    const next = toggleSetGroupFilter(state, ['SetA', 'SetB'], false)
    expect(next.filterSets).toEqual(['SetA', 'SetB'])
  })

  it('allSelected=true のときグループ内キーをすべて削除する', () => {
    const state = {
      ...INITIAL_ARTIFACT_FILTER_STATE,
      filterSets: ['SetA', 'SetB', 'SetC'],
    }
    const next = toggleSetGroupFilter(state, ['SetA', 'SetB'], true)
    expect(next.filterSets).toEqual(['SetC'])
  })

  it('既に選択済みのキーを重複追加しない', () => {
    const state = {
      ...INITIAL_ARTIFACT_FILTER_STATE,
      filterSets: ['SetA'],
    }
    const next = toggleSetGroupFilter(state, ['SetA', 'SetB'], false)
    expect(next.filterSets).toEqual(['SetA', 'SetB'])
  })
})
