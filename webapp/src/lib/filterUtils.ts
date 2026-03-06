import type { ArtifactSlotKey, StatKey } from '@/lib/types'

/** いずれかのフィルタが有効かどうかを返す */
export function hasActiveFilter(
  filterSets: string[],
  filterSlot: ArtifactSlotKey | '',
  filterMainStat: string,
  filterSubStats: StatKey[],
  filterInitialOp: '' | '3' | '4',
): boolean {
  return (
    filterSets.length > 0 ||
    filterSlot !== '' ||
    filterMainStat !== '' ||
    filterSubStats.length > 0 ||
    filterInitialOp !== ''
  )
}
