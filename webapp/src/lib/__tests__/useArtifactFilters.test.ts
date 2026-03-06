// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useArtifactFilters } from '@/hooks/useArtifactFilters'
import { INITIAL_ARTIFACT_FILTER_STATE } from '@/lib/artifactFilters'

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
      result.current.setFilterSets(['GladiatorsFinale', 'BlizzardStrayer'])
    })
    expect(result.current.filterSets).toEqual(['GladiatorsFinale', 'BlizzardStrayer'])
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
      result.current.setFilterSets(['GladiatorsFinale'])
      result.current.setFilterSlot('flower')
      result.current.setFilterInitialOp('3')
    })
    act(() => {
      result.current.resetFilters()
    })
    expect(result.current.filterSets).toEqual([])
    expect(result.current.filterSlot).toBe('')
    expect(result.current.filterInitialOp).toBe('')
  })

  it('applyMainStat でメインステフィルタを更新し、サブステから除外される', () => {
    const { result } = renderHook(() => useArtifactFilters())
    act(() => {
      result.current.toggleSubStat('critRate_', true)
      result.current.toggleSubStat('critDMG_', true)
    })
    act(() => {
      result.current.applyMainStat('critRate_')
    })
    expect(result.current.filterMainStat).toBe('critRate_')
    expect(result.current.filterSubStats).not.toContain('critRate_')
    expect(result.current.filterSubStats).toContain('critDMG_')
  })

  it('toggleSubStat(key, true) でサブステを追加できる', () => {
    const { result } = renderHook(() => useArtifactFilters())
    act(() => {
      result.current.toggleSubStat('critDMG_', true)
    })
    expect(result.current.filterSubStats).toContain('critDMG_')
  })

  it('toggleSubStat(key, false) でサブステを削除できる', () => {
    const { result } = renderHook(() => useArtifactFilters())
    act(() => {
      result.current.toggleSubStat('critDMG_', true)
      result.current.toggleSubStat('atk_', true)
    })
    act(() => {
      result.current.toggleSubStat('critDMG_', false)
    })
    expect(result.current.filterSubStats).not.toContain('critDMG_')
    expect(result.current.filterSubStats).toContain('atk_')
  })

  it('toggleSet(key, true) でセットを追加できる', () => {
    const { result } = renderHook(() => useArtifactFilters())
    act(() => {
      result.current.toggleSet('GladiatorsFinale', true)
    })
    expect(result.current.filterSets).toContain('GladiatorsFinale')
  })

  it('toggleSet(key, false) でセットを削除できる', () => {
    const { result } = renderHook(() => useArtifactFilters())
    act(() => {
      result.current.toggleSet('GladiatorsFinale', true)
      result.current.toggleSet('BlizzardStrayer', true)
    })
    act(() => {
      result.current.toggleSet('GladiatorsFinale', false)
    })
    expect(result.current.filterSets).not.toContain('GladiatorsFinale')
    expect(result.current.filterSets).toContain('BlizzardStrayer')
  })

  it('toggleSetGroup でグループ一括トグルできる（全未選択 → 全追加）', () => {
    const { result } = renderHook(() => useArtifactFilters())
    act(() => {
      result.current.toggleSetGroup(['SetA', 'SetB'], false)
    })
    expect(result.current.filterSets).toContain('SetA')
    expect(result.current.filterSets).toContain('SetB')
  })

  it('toggleSetGroup でグループ一括トグルできる（全選択 → 全削除）', () => {
    const { result } = renderHook(() => useArtifactFilters())
    act(() => {
      result.current.setFilterSets(['SetA', 'SetB', 'SetC'])
    })
    act(() => {
      result.current.toggleSetGroup(['SetA', 'SetB'], true)
    })
    expect(result.current.filterSets).not.toContain('SetA')
    expect(result.current.filterSets).not.toContain('SetB')
    expect(result.current.filterSets).toContain('SetC')
  })
})
