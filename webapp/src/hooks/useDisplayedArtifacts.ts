import { useMemo } from 'react'
import type { RankedArtifact, ScoreTypeName, StatKey } from '@/lib/types'
import type { ArtifactFilterState } from '@/lib/artifactFilters'

interface DisplayedEntry {
  entry: RankedArtifact
  reconRate: number | null
  originalIndex: number
}

interface UseDisplayedArtifactsParams {
  allRanked: RankedArtifact[] | null
  reconRates: Map<number, number>
  filters: ArtifactFilterState
  subStatSort: StatKey | ''
  scoreType: ScoreTypeName
  reconSort: boolean
}

/** フィルタ・ソート済み聖遺物リストを生成するフック */
export function useDisplayedArtifacts({
  allRanked,
  reconRates,
  filters,
  subStatSort,
  scoreType,
  reconSort,
}: UseDisplayedArtifactsParams): DisplayedEntry[] {
  return useMemo(() => {
    if (!allRanked) return []
    return allRanked
      .map((e, i) => ({ entry: e, reconRate: reconRates.get(i) ?? null, originalIndex: i }))
      .filter(({ entry: e }) => filters.filterSets.length === 0 || filters.filterSets.includes(e.artifact.setKey))
      .filter(({ entry: e }) => !filters.filterSlot || e.artifact.slotKey === filters.filterSlot)
      .filter(({ entry: e }) => !filters.filterMainStat || e.artifact.mainStatKey === filters.filterMainStat)
      .filter(({ entry: e }) =>
        filters.filterSubStats.length === 0 ||
        filters.filterSubStats.every((k) => e.artifact.substats.some((s) => s.key === k)),
      )
      .filter(({ entry: e }) => {
        if (!filters.filterInitialOp) return true
        // 初期サブステ数 = 全ロール数 - 強化ロール数（Lv4ごとに1回強化が入る）
        const initialOp = e.artifact.totalRolls - Math.floor(e.artifact.level / 4)
        return initialOp === Number(filters.filterInitialOp)
      })
      .sort((a, b) => {
        if (reconSort) {
          const ra = a.reconRate ?? -1
          const rb = b.reconRate ?? -1
          if (ra !== rb) return rb - ra
        }
        if (subStatSort) {
          const va = a.entry.artifact.substats.find((s) => s.key === subStatSort)?.value ?? -Infinity
          const vb = b.entry.artifact.substats.find((s) => s.key === subStatSort)?.value ?? -Infinity
          if (va !== vb) return vb - va
        }
        return b.entry.allScores[scoreType] - a.entry.allScores[scoreType]
      })
  }, [allRanked, filters.filterSets, filters.filterSlot, filters.filterMainStat, filters.filterSubStats, filters.filterInitialOp, subStatSort, scoreType, reconRates, reconSort])
}
