// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { INITIAL_ARTIFACT_FILTER_STATE } from '@/lib/artifactFilters'
import { useArtifactFilters } from '@/hooks/useArtifactFilters'

describe('useArtifactFilters', () => {
  it('初期状態が INITIAL_ARTIFACT_FILTER_STATE と一致する', () => {
    const { result } = renderHook(() => useArtifactFilters())

    expect(result.current.filterSets).toEqual(INITIAL_ARTIFACT_FILTER_STATE.filterSets)
    expect(result.current.filterSlot).toBe(INITIAL_ARTIFACT_FILTER_STATE.filterSlot)
    expect(result.current.filterMainStat).toBe(INITIAL_ARTIFACT_FILTER_STATE.filterMainStat)
    expect(result.current.filterSubStats).toEqual(INITIAL_ARTIFACT_FILTER_STATE.filterSubStats)
    expect(result.current.filterInitialOp).toBe(INITIAL_ARTIFACT_FILTER_STATE.filterInitialOp)
  })

  it('setFilterSets でセットフィルタを更新できる', () => {
    const { result } = renderHook(() => useArtifactFilters())

    act(() => {
      result.current.setFilterSets(['gladiatorFinale', 'wanderersTroupe'])
    })

    expect(result.current.filterSets).toEqual(['gladiatorFinale', 'wanderersTroupe'])
  })

  it('setFilterSlot で部位フィルタを更新できる', () => {
    const { result } = renderHook(() => useArtifactFilters())

    act(() => {
      result.current.setFilterSlot('flower')
    })

    expect(result.current.filterSlot).toBe('flower')
  })

  it('setFilterInitialOp で初期OP数フィルタを更新できる', () => {
    const { result } = renderHook(() => useArtifactFilters())

    act(() => {
      result.current.setFilterInitialOp('4')
    })

    expect(result.current.filterInitialOp).toBe('4')
  })

  it('resetFilters で全フィルタがリセットされる', () => {
    const { result } = renderHook(() => useArtifactFilters())

    act(() => {
      result.current.setFilterSlot('goblet')
      result.current.setFilterSets(['gladiatorFinale'])
    })

    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.filterSets).toEqual([])
    expect(result.current.filterSlot).toBe('')
    expect(result.current.filterMainStat).toBe('')
    expect(result.current.filterSubStats).toEqual([])
    expect(result.current.filterInitialOp).toBe('')
  })

  it('applyMainStat でメインステフィルタを更新し、サブステから除外される', () => {
    const { result } = renderHook(() => useArtifactFilters())

    act(() => {
      result.current.toggleSubStat('atk_', true)
      result.current.toggleSubStat('hp_', true)
    })

    act(() => {
      result.current.applyMainStat('atk_')
    })

    expect(result.current.filterMainStat).toBe('atk_')
    expect(result.current.filterSubStats).not.toContain('atk_')
    expect(result.current.filterSubStats).toContain('hp_')
  })

  it('toggleSubStat(key, true) でサブステを追加できる', () => {
    const { result } = renderHook(() => useArtifactFilters())

    act(() => {
      result.current.toggleSubStat('critRate_', true)
    })

    expect(result.current.filterSubStats).toContain('critRate_')
  })

  it('toggleSubStat(key, false) でサブステを削除できる', () => {
    const { result } = renderHook(() => useArtifactFilters())

    act(() => {
      result.current.toggleSubStat('critRate_', true)
    })

    act(() => {
      result.current.toggleSubStat('critRate_', false)
    })

    expect(result.current.filterSubStats).not.toContain('critRate_')
  })

  it('toggleSet(key, true) でセットを追加できる', () => {
    const { result } = renderHook(() => useArtifactFilters())

    act(() => {
      result.current.toggleSet('gladiatorFinale', true)
    })

    expect(result.current.filterSets).toContain('gladiatorFinale')
  })

  it('toggleSet(key, false) でセットを削除できる', () => {
    const { result } = renderHook(() => useArtifactFilters())

    act(() => {
      result.current.toggleSet('gladiatorFinale', true)
    })

    act(() => {
      result.current.toggleSet('gladiatorFinale', false)
    })

    expect(result.current.filterSets).not.toContain('gladiatorFinale')
  })

  it('toggleSetGroup で全選択済みの場合にグループを一括削除できる', () => {
    const { result } = renderHook(() => useArtifactFilters())
    const keys = ['setA', 'setB', 'setC']

    act(() => {
      result.current.setFilterSets(keys)
    })

    act(() => {
      result.current.toggleSetGroup(keys, true)
    })

    expect(result.current.filterSets).toEqual([])
  })

  it('toggleSetGroup で未選択がある場合にグループを一括追加できる', () => {
    const { result } = renderHook(() => useArtifactFilters())
    const keys = ['setA', 'setB', 'setC']

    act(() => {
      result.current.setFilterSets(['setA'])
    })

    act(() => {
      result.current.toggleSetGroup(keys, false)
    })

    expect(result.current.filterSets).toContain('setA')
    expect(result.current.filterSets).toContain('setB')
    expect(result.current.filterSets).toContain('setC')
  })
})
