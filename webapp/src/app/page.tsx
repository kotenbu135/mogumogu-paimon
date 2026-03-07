'use client'

import { useEffect, useMemo, useState } from 'react'
import ArtifactCard from '@/components/ArtifactCard'
import HeroSection from '@/components/HeroSection'
import ControlsBar from '@/components/ControlsBar'
import type { GoodFile, MainStatKey, RankedArtifact, ReconstructionType, ScoreTypeName, StatKey } from '@/lib/types'
import { groupSetOptions, SCORE_TYPE_OPTIONS, ALL_SUBSTAT_KEYS } from '@/lib/constants'
import { useTranslation } from '@/lib/i18n'
import { getAllStatNames } from '@/lib/i18n/types'
import { useArtifactFilters } from '@/hooks/useArtifactFilters'

const MAIN_STAT_ORDER: MainStatKey[] = [
  'critRate_', 'critDMG_', 'atk_', 'hp_', 'def_',
  'eleMas', 'enerRech_', 'heal_',
  'anemo_dmg_', 'geo_dmg_', 'electro_dmg_', 'dendro_dmg_',
  'hydro_dmg_', 'pyro_dmg_', 'cryo_dmg_', 'physical_dmg_',
  'atk', 'hp', 'def',
]

/** GOODファイルを読み込んで★5聖遺物をランク付けする */
async function buildRankedList(data: GoodFile): Promise<RankedArtifact[]> {
  const { calculateScores, calculateAllScores, estimateRollCounts } = await import('@/lib/scoring')
  return data.artifacts
    .filter((a) => a.rarity === 5)
    .map((artifact) => {
      const { cvScore, bestScore, bestType } = calculateScores(artifact)
      const allScores = calculateAllScores(artifact)
      const rollCounts = estimateRollCounts(artifact)
      return { artifact, cvScore, bestScore, bestType, allScores, rollCounts }
    })
}

export default function HomePage() {
  const { t } = useTranslation()
  const filters = useArtifactFilters()
  const [allRanked, setAllRanked] = useState<RankedArtifact[] | null>(null)
  const [scoreType, setScoreType] = useState<ScoreTypeName>('攻撃型')
  const [subStatSort, setSubStatSort] = useState<StatKey | ''>('')
  const [reconType, setReconType] = useState<ReconstructionType>('normal')
  const [reconSort, setReconSort] = useState(false)

  async function handleLoad(data: GoodFile) {
    setAllRanked(await buildRankedList(data))
    filters.resetFilters()
  }

  const setOptionGroups = useMemo(() => {
    if (!allRanked) return []
    const keys = [...new Set(allRanked.map((e) => e.artifact.setKey))]
    return groupSetOptions(keys)
  }, [allRanked])

  const mainStatOptions = useMemo(() => {
    if (!allRanked) return []
    const present = new Set(allRanked.map((e) => e.artifact.mainStatKey))
    return MAIN_STAT_ORDER.filter((k) => present.has(k))
  }, [allRanked])

  const availableSubStatKeys = useMemo((): StatKey[] => {
    if (!filters.filterMainStat) return ALL_SUBSTAT_KEYS
    return ALL_SUBSTAT_KEYS.filter((k) => k !== filters.filterMainStat)
  }, [filters.filterMainStat])

  const equippedSetsMap = useMemo(() => {
    if (!allRanked) return new Map<string, string[]>()
    const map = new Map<string, string[]>()
    for (const e of allRanked) {
      const loc = e.artifact.location
      if (!loc) continue
      const sets = map.get(loc) ?? []
      sets.push(e.artifact.setKey)
      map.set(loc, sets)
    }
    return map
  }, [allRanked])

  const [reconRates, setReconRates] = useState<Map<number, number>>(new Map())
  useEffect(() => {
    if (!allRanked) {
      setReconRates(new Map())
      return
    }
    let cancelled = false
    import('@/lib/reconstruction').then(({ calculateReconstructionRate }) => {
      if (cancelled) return
      const map = new Map<number, number>()
      for (let i = 0; i < allRanked.length; i++) {
        const e = allRanked[i]
        const rate = calculateReconstructionRate(e.artifact, e.rollCounts, scoreType, reconType)
        if (rate !== null) map.set(i, rate)
      }
      setReconRates(map)
    })
    return () => { cancelled = true }
  }, [allRanked, scoreType, reconType])

  const displayed = useMemo(() => {
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

  const allMainStatNames = getAllStatNames(t)

  return (
    <main className="main-container">
      <h1 className="page-title">{t.siteTitle}</h1>

      {allRanked === null ? (
        <HeroSection onLoad={handleLoad} t={t} scoreTypeOptions={SCORE_TYPE_OPTIONS} />
      ) : (
        <>
          <ControlsBar
            filters={filters}
            scoreType={scoreType}
            setScoreType={setScoreType}
            subStatSort={subStatSort}
            setSubStatSort={setSubStatSort}
            reconType={reconType}
            setReconType={setReconType}
            reconSort={reconSort}
            setReconSort={setReconSort}
            mainStatOptions={mainStatOptions}
            setOptionGroups={setOptionGroups}
            availableSubStatKeys={availableSubStatKeys}
            t={t}
            allMainStatNames={allMainStatNames}
          />

          <div className="card-grid">
            {displayed.map(({ entry, reconRate, originalIndex }, i) => (
              <ArtifactCard
                key={originalIndex}
                rank={i + 1}
                entry={entry}
                scoreType={scoreType}
                reconRate={reconRate}
                onFilterBySet={(setKey) => filters.setFilterSets([setKey])}
                onFilterBySlot={filters.setFilterSlot}
                equippedSetKeys={equippedSetsMap.get(entry.artifact.location) ?? []}
              />
            ))}
          </div>
        </>
      )}
    </main>
  )
}
