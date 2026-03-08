import { useEffect, useMemo, useRef, useState } from 'react'
import type { RankedArtifact, ReconstructionType, ScoreTypeName, StatKey } from '@/lib/types'
import type { ArtifactFilterState } from '@/lib/artifactFilters'

export interface DisplayedEntry {
  entry: RankedArtifact
  reconRate: number | null
  originalIndex: number
}

interface FilteredEntry {
  entry: RankedArtifact
  originalIndex: number
}

interface UseDisplayedArtifactsParams {
  allRanked: RankedArtifact[] | null
  filters: ArtifactFilterState
  subStatSort: StatKey | ''
  scoreType: ScoreTypeName
  reconSort: boolean
  reconType: ReconstructionType
}

/** フィルタ・ソート済み聖遺物リストを生成するフック（再構築成功率はフィルタ後の対象のみ計算） */
export function useDisplayedArtifacts({
  allRanked,
  filters,
  subStatSort,
  scoreType,
  reconSort,
  reconType,
}: UseDisplayedArtifactsParams): DisplayedEntry[] {
  // Step 1: フィルタを同期的に適用（reconRates に依存しない）
  const filtered: FilteredEntry[] = useMemo(() => {
    if (!allRanked) return []
    return allRanked
      .map((e, i) => ({ entry: e, originalIndex: i }))
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
  }, [allRanked, filters.filterSets, filters.filterSlot, filters.filterMainStat, filters.filterSubStats, filters.filterInitialOp])

  // Step 2: フィルタ済み聖遺物のみ再構築成功率を非同期計算
  const [reconRates, setReconRates] = useState<Map<number, number>>(new Map())
  // scoreType:reconType をキーとして、originalIndex → rate をキャッシュ
  const reconCacheRef = useRef<Map<string, Map<number, number>>>(new Map())
  // allRanked の変更を追跡してキャッシュをクリア
  const cachedAllRankedRef = useRef<RankedArtifact[] | null>(null)

  useEffect(() => {
    if (!allRanked || filtered.length === 0) {
      setReconRates(new Map())
      return
    }

    // 新しいファイルが読み込まれたらキャッシュをクリア
    if (cachedAllRankedRef.current !== allRanked) {
      reconCacheRef.current = new Map()
      cachedAllRankedRef.current = allRanked
    }

    const cacheKey = `${scoreType}:${reconType}`
    let perArtifactCache = reconCacheRef.current.get(cacheKey)
    if (!perArtifactCache) {
      perArtifactCache = new Map()
      reconCacheRef.current.set(cacheKey, perArtifactCache)
    }
    const cache = perArtifactCache

    // キャッシュにない（未計算）聖遺物を抽出
    const toCompute = filtered.filter((f) => !cache.has(f.originalIndex))

    if (toCompute.length === 0) {
      // すべてキャッシュ済み — フィルタ分の結果をすぐに反映
      const result = new Map<number, number>()
      for (const { originalIndex } of filtered) {
        const rate = cache.get(originalIndex)
        if (rate !== undefined) result.set(originalIndex, rate)
      }
      setReconRates(result)
      return
    }

    let cancelled = false
    const CHUNK_SIZE = 100
    import('@/lib/reconstruction').then(({ calculateReconstructionRate }) => {
      if (cancelled) return
      let i = 0

      function processChunk() {
        if (cancelled) return
        const end = Math.min(i + CHUNK_SIZE, toCompute.length)
        for (; i < end; i++) {
          const { entry, originalIndex } = toCompute[i]
          const rate = calculateReconstructionRate(entry.artifact, entry.rollCounts, scoreType, reconType)
          if (rate !== null) cache.set(originalIndex, rate)
        }

        // フィルタ済み全件分の現在の結果を反映
        const result = new Map<number, number>()
        for (const { originalIndex } of filtered) {
          const rate = cache.get(originalIndex)
          if (rate !== undefined) result.set(originalIndex, rate)
        }
        setReconRates(new Map(result))

        if (i < toCompute.length) {
          setTimeout(processChunk, 0)
        }
      }

      processChunk()
    })
    return () => { cancelled = true }
  }, [filtered, scoreType, reconType, allRanked])

  // Step 3: reconRates を使ってソート
  return useMemo(() => {
    return filtered
      .map(({ entry, originalIndex }) => ({
        entry,
        reconRate: reconRates.get(originalIndex) ?? null,
        originalIndex,
      }))
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
  }, [filtered, reconRates, reconSort, subStatSort, scoreType])
}
