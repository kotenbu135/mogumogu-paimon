import { useState } from 'react'
import type { ArtifactSlotKey, StatKey } from '@/lib/types'
import {
  type ArtifactFilterState,
  INITIAL_ARTIFACT_FILTER_STATE,
  resetArtifactFilters,
  setMainStatFilter,
  toggleSubStatFilter,
  toggleSetFilter,
  toggleSetGroupFilter,
} from '@/lib/artifactFilters'

export type { ArtifactFilterState }

export interface ArtifactFiltersHook extends ArtifactFilterState {
  setFilterSets: (sets: string[]) => void
  setFilterSlot: (slot: ArtifactSlotKey | '') => void
  setFilterInitialOp: (op: '' | '3' | '4') => void
  resetFilters: () => void
  applyMainStat: (value: string) => void
  toggleSubStat: (key: StatKey, checked: boolean) => void
  toggleSet: (key: string, checked: boolean) => void
  toggleSetGroup: (keys: string[], allSelected: boolean) => void
}

/** フィルタ状態を一元管理するカスタムフック */
export function useArtifactFilters(): ArtifactFiltersHook {
  const [state, setState] = useState<ArtifactFilterState>(INITIAL_ARTIFACT_FILTER_STATE)

  return {
    ...state,
    setFilterSets: (sets) => setState((prev) => ({ ...prev, filterSets: sets })),
    setFilterSlot: (slot) => setState((prev) => ({ ...prev, filterSlot: slot })),
    setFilterInitialOp: (op) => setState((prev) => ({ ...prev, filterInitialOp: op })),
    resetFilters: () => setState(resetArtifactFilters()),
    applyMainStat: (value) => setState((prev) => setMainStatFilter(prev, value)),
    toggleSubStat: (key, checked) => setState((prev) => toggleSubStatFilter(prev, key, checked)),
    toggleSet: (key, checked) => setState((prev) => toggleSetFilter(prev, key, checked)),
    toggleSetGroup: (keys, allSelected) =>
      setState((prev) => toggleSetGroupFilter(prev, keys, allSelected)),
  }
}
