import type { ArtifactSlotKey, StatKey } from '@/lib/types'

/** フィルタ状態 */
export interface ArtifactFilterState {
  filterSets: string[]
  filterSlot: ArtifactSlotKey | ''
  filterMainStat: string
  filterSubStats: StatKey[]
  filterInitialOp: '' | '3' | '4'
}

export const INITIAL_ARTIFACT_FILTER_STATE: ArtifactFilterState = {
  filterSets: [],
  filterSlot: '',
  filterMainStat: '',
  filterSubStats: [],
  filterInitialOp: '',
}

/** フィルタをすべてリセットした新しい状態を返す */
export function resetArtifactFilters(): ArtifactFilterState {
  return { ...INITIAL_ARTIFACT_FILTER_STATE }
}

/** メインステを設定し、同一キーをサブステフィルタから除外する */
export function setMainStatFilter(
  state: ArtifactFilterState,
  value: string,
): ArtifactFilterState {
  return {
    ...state,
    filterMainStat: value,
    filterSubStats: state.filterSubStats.filter((k) => k !== value),
  }
}

/** サブステフィルタのトグル */
export function toggleSubStatFilter(
  state: ArtifactFilterState,
  key: StatKey,
  checked: boolean,
): ArtifactFilterState {
  return {
    ...state,
    filterSubStats: checked
      ? [...state.filterSubStats, key]
      : state.filterSubStats.filter((k) => k !== key),
  }
}

/** 単一セットフィルタのトグル */
export function toggleSetFilter(
  state: ArtifactFilterState,
  key: string,
  checked: boolean,
): ArtifactFilterState {
  return {
    ...state,
    filterSets: checked
      ? [...state.filterSets, key]
      : state.filterSets.filter((k) => k !== key),
  }
}

/**
 * セットグループのトグル
 * allSelected=true なら全削除、false なら未選択分を追加
 */
export function toggleSetGroupFilter(
  state: ArtifactFilterState,
  keys: string[],
  allSelected: boolean,
): ArtifactFilterState {
  return {
    ...state,
    filterSets: allSelected
      ? state.filterSets.filter((k) => !keys.includes(k))
      : [...state.filterSets, ...keys.filter((k) => !state.filterSets.includes(k))],
  }
}
