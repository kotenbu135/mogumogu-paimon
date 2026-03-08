'use client'

import { useEffect, useMemo, useState } from 'react'
import HeroSection from '@/components/HeroSection'
import VirtualArtifactGrid from '@/components/VirtualArtifactGrid'
import ControlsBar from '@/components/ControlsBar'
import type { GoodFile, MainStatKey, ReconstructionType, ScoreTypeName, StatKey } from '@/lib/types'
import { groupSetOptions, SCORE_TYPE_OPTIONS, ALL_SUBSTAT_KEYS } from '@/lib/constants'
import { useTranslation } from '@/lib/i18n'
import { getAllStatNames } from '@/lib/i18n/types'
import { useArtifactFilters } from '@/hooks/useArtifactFilters'
import { useArtifactData, loadFromStorage } from '@/hooks/useArtifactData'
import { useDisplayedArtifacts } from '@/hooks/useDisplayedArtifacts'

const MAIN_STAT_ORDER: MainStatKey[] = [
  'critRate_', 'critDMG_', 'atk_', 'hp_', 'def_',
  'eleMas', 'enerRech_', 'heal_',
  'anemo_dmg_', 'geo_dmg_', 'electro_dmg_', 'dendro_dmg_',
  'hydro_dmg_', 'pyro_dmg_', 'cryo_dmg_', 'physical_dmg_',
  'atk', 'hp', 'def',
]

export default function HomeClient() {
  const { t } = useTranslation()
  const filters = useArtifactFilters()
  const [scoreType, setScoreType] = useState<ScoreTypeName>('攻撃型')
  const [subStatSort, setSubStatSort] = useState<StatKey | ''>('')
  const [reconType, setReconType] = useState<ReconstructionType>('normal')
  const [reconSort, setReconSort] = useState(false)

  const { allRanked, handleLoad } = useArtifactData()

  // マウント時に localStorage からデータを自動復元
  useEffect(() => {
    const stored = loadFromStorage()
    if (stored) {
      handleLoad(stored)
    }
  }, [])

  async function handleLoadWithReset(data: GoodFile) {
    await handleLoad(data)
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

  const displayed = useDisplayedArtifacts({
    allRanked,
    filters,
    subStatSort,
    scoreType,
    reconSort,
    reconType,
  })

  const allMainStatNames = getAllStatNames(t)

  // フィルター変更時にカードグリッドを再マウントしてスタガーアニメーションを再生
  const gridAnimKey = [
    filters.filterSlot,
    JSON.stringify(filters.filterSets),
    filters.filterMainStat,
    JSON.stringify(filters.filterSubStats),
    scoreType,
    subStatSort,
    reconSort,
    reconType,
  ].join('|')

  return (
    <>
      {allRanked === null ? (
        <HeroSection onLoad={handleLoadWithReset} t={t} scoreTypeOptions={SCORE_TYPE_OPTIONS} />
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

          <VirtualArtifactGrid
            key={gridAnimKey}
            displayed={displayed}
            scoreType={scoreType}
            equippedSetsMap={equippedSetsMap}
            onFilterBySet={(setKey) => filters.setFilterSets([setKey])}
            onFilterBySlot={filters.setFilterSlot}
          />
        </>
      )}
    </>
  )
}
