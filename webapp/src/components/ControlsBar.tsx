'use client'

import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, Select, SelectItem, Checkbox } from '@heroui/react'
import type { ArtifactSlotKey, ReconstructionType, ScoreTypeName, StatKey } from '@/lib/types'
import type { ArtifactFiltersHook } from '@/hooks/useArtifactFilters'
import { useDropdownClose } from '@/hooks/useDropdownClose'
import { useDropdownPosition } from '@/hooks/useDropdownPosition'
import { hasActiveFilter } from '@/lib/filterUtils'
import { ARTIFACT_SET_NAMES, MAIN_STAT_NAMES, STAT_NAMES, SCORE_TYPE_OPTIONS, ALL_SUBSTAT_KEYS } from '@/lib/constants'
import type { Translations } from '@/lib/i18n/types'

interface ControlsBarProps {
  filters: ArtifactFiltersHook
  scoreType: ScoreTypeName
  setScoreType: (type: ScoreTypeName) => void
  subStatSort: StatKey | ''
  setSubStatSort: (key: StatKey | '') => void
  reconType: ReconstructionType
  setReconType: (type: ReconstructionType) => void
  reconSort: boolean
  setReconSort: (v: boolean) => void
  mainStatOptions: string[]
  setOptionGroups: { label: string; keys: string[] }[]
  availableSubStatKeys: StatKey[]
  t: Translations
  allMainStatNames: Record<string, string>
}

/** コントロールバー全体コンポーネント */
export default function ControlsBar({
  filters,
  scoreType,
  setScoreType,
  subStatSort,
  setSubStatSort,
  reconType,
  setReconType,
  reconSort,
  setReconSort,
  mainStatOptions,
  setOptionGroups,
  availableSubStatKeys,
  t,
  allMainStatNames,
}: ControlsBarProps) {
  const [subStatOpen, setSubStatOpen] = useState(false)
  const [setFilterOpen, setSetFilterOpen] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const subStatBtnRef = useRef<HTMLButtonElement>(null)
  const subStatPanelRef = useRef<HTMLDivElement>(null)
  const setFilterBtnRef = useRef<HTMLButtonElement>(null)
  const setFilterPanelRef = useRef<HTMLDivElement>(null)

  const subStatPos = useDropdownPosition(subStatBtnRef, subStatOpen)
  const setFilterPos = useDropdownPosition(setFilterBtnRef, setFilterOpen)

  useDropdownClose([
    {
      open: subStatOpen,
      close: () => setSubStatOpen(false),
      btnRef: subStatBtnRef,
      panelRef: subStatPanelRef,
    },
    {
      open: setFilterOpen,
      close: () => setSetFilterOpen(false),
      btnRef: setFilterBtnRef,
      panelRef: setFilterPanelRef,
    },
  ])

  const RECON_OPTIONS: { value: ReconstructionType; label: string }[] = [
    { value: 'normal', label: t.reconTypes.normal },
    { value: 'advanced', label: t.reconTypes.advanced },
    { value: 'absolute', label: t.reconTypes.absolute },
  ]

  const SLOT_OPTIONS: { value: ArtifactSlotKey | ''; label: string }[] = [
    { value: '', label: t.controls.allSlots },
    { value: 'flower', label: t.slots.flower },
    { value: 'plume', label: t.slots.plume },
    { value: 'sands', label: t.slots.sands },
    { value: 'goblet', label: t.slots.goblet },
    { value: 'circlet', label: t.slots.circlet },
  ]

  const hasFilter = hasActiveFilter(
    filters.filterSets,
    filters.filterSlot,
    filters.filterMainStat,
    filters.filterSubStats,
    filters.filterInitialOp,
  )

  // アクティブフィルターのチップ一覧
  const filterChips: { label: string; onRemove: () => void }[] = []

  if (filters.filterSlot) {
    const slotLabel = SLOT_OPTIONS.find((o) => o.value === filters.filterSlot)?.label ?? filters.filterSlot
    filterChips.push({ label: slotLabel, onRemove: () => filters.setFilterSlot('') })
  }
  if (filters.filterMainStat) {
    const mainStatLabel = allMainStatNames[filters.filterMainStat] ?? MAIN_STAT_NAMES[filters.filterMainStat] ?? filters.filterMainStat
    filterChips.push({ label: mainStatLabel, onRemove: () => filters.applyMainStat('') })
  }
  if (filters.filterInitialOp) {
    const opLabel = filters.filterInitialOp === '3' ? t.controls.op3 : t.controls.op4
    filterChips.push({ label: opLabel, onRemove: () => filters.setFilterInitialOp('') })
  }
  for (const key of filters.filterSubStats) {
    const subStatLabel = t.stats[key] ?? STAT_NAMES[key]
    filterChips.push({ label: subStatLabel, onRemove: () => filters.toggleSubStat(key, false) })
  }
  for (const key of filters.filterSets) {
    const setLabel = t.artifactSetNames[key] ?? ARTIFACT_SET_NAMES[key] ?? key
    filterChips.push({ label: setLabel, onRemove: () => filters.toggleSet(key, false) })
  }

  return (
    <div className="controls-bar">
      <div className="ctrl-row">
        {/* グループA: スコア設定 */}
        <div className="ctrl-section">
          <div className="ctrl-section-label">{t.controls.groupScore}</div>
          <div className="ctrl-section-body">
            <div className="ctrl-group">
              <Select
                label={t.controls.scoreType}
                selectedKeys={new Set([scoreType])}
                onSelectionChange={(keys) => {
                  if (keys !== 'all') {
                    const key = [...keys][0]
                    if (key !== undefined) setScoreType(String(key) as ScoreTypeName)
                  }
                }}
                size="sm"
                variant="bordered"
              >
                {SCORE_TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type}>{t.scoreFormulas[type].label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* グループB: フィルター */}
        <div className="ctrl-section ctrl-section-filter">
          <div className="ctrl-section-label">{t.controls.groupFilter}</div>
          <div className="ctrl-section-body">
            {/* セットフィルタ */}
            <div className="ctrl-group">
              <label className="ctrl-label">{t.controls.set}</label>
              <Button
                ref={setFilterBtnRef}
                type="button"
                variant="bordered"
                size="sm"
                className={`substat-dropdown-btn${filters.filterSets.length > 0 ? ' ctrl-active' : ''}`}
                aria-expanded={setFilterOpen}
                aria-haspopup="listbox"
                onPress={() => setSetFilterOpen((v) => !v)}
              >
                {filters.filterSets.length > 0
                  ? `${t.controls.set}(${filters.filterSets.length})`
                  : t.controls.set}
              </Button>
              {setFilterOpen && createPortal(
                <div
                  ref={setFilterPanelRef}
                  className="set-dropdown-panel"
                  style={{
                    top: setFilterPos.top,
                    left: setFilterPos.left,
                  }}
                >
                  {setOptionGroups.map((group) => {
                    const allSelected = group.keys.every((k) => filters.filterSets.includes(k))
                    const someSelected = group.keys.some((k) => filters.filterSets.includes(k))
                    const groupLabel = t.setGroupLabels[group.label] ?? group.label
                    return (
                      <div key={group.label}>
                        <Checkbox
                          classNames={{ base: 'set-group-header max-w-full w-full', wrapper: 'mr-1' }}
                          isSelected={allSelected}
                          isIndeterminate={someSelected && !allSelected}
                          onValueChange={() => filters.toggleSetGroup(group.keys, allSelected)}
                          size="sm"
                        >
                          {groupLabel}
                        </Checkbox>
                        {group.keys.map((key) => (
                          <Checkbox
                            key={key}
                            classNames={{ base: 'substat-dropdown-item set-item max-w-full w-full', wrapper: 'mr-1' }}
                            isSelected={filters.filterSets.includes(key)}
                            onValueChange={(checked) => filters.toggleSet(key, checked)}
                            size="sm"
                          >
                            {t.artifactSetNames[key] ?? ARTIFACT_SET_NAMES[key] ?? key}
                          </Checkbox>
                        ))}
                      </div>
                    )
                  })}
                </div>,
                document.body,
              )}
            </div>

            {/* 部位フィルタ */}
            <div className="ctrl-group">
              <Select
                label={t.controls.slot}
                selectedKeys={new Set([filters.filterSlot])}
                onSelectionChange={(keys) => {
                  if (keys !== 'all') {
                    const key = [...keys][0]
                    filters.setFilterSlot((key !== undefined ? String(key) : '') as ArtifactSlotKey | '')
                  }
                }}
                size="sm"
                variant="bordered"
                classNames={{ trigger: filters.filterSlot ? 'ctrl-active' : '' }}
              >
                {SLOT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value}>{opt.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* メインステフィルタ */}
            <div className="ctrl-group">
              <Select
                label={t.controls.mainStat}
                selectedKeys={new Set([filters.filterMainStat])}
                onSelectionChange={(keys) => {
                  if (keys !== 'all') {
                    const key = [...keys][0]
                    filters.applyMainStat(key !== undefined ? String(key) : '')
                  }
                }}
                size="sm"
                variant="bordered"
                classNames={{ trigger: filters.filterMainStat ? 'ctrl-active' : '' }}
                items={[
                  { key: '', label: t.controls.allMainStats },
                  ...mainStatOptions.map((key) => ({
                    key,
                    label: allMainStatNames[key] ?? MAIN_STAT_NAMES[key] ?? key,
                  })),
                ]}
              >
                {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
              </Select>
            </div>

            {/* 詳細フィルタートグル */}
            <div className="ctrl-group">
              <div className="ctrl-label">&nbsp;</div>
              <Button
                type="button"
                variant="bordered"
                size="sm"
                className={`ctrl-advanced-btn${advancedOpen ? ' ctrl-advanced-open' : ''}${(filters.filterInitialOp || filters.filterSubStats.length > 0) ? ' ctrl-active' : ''}`}
                onPress={() => setAdvancedOpen((v) => !v)}
              >
                {t.controls.advancedFilter}
                <span className="ctrl-advanced-arrow">{advancedOpen ? '▲' : '▼'}</span>
              </Button>
            </div>
          </div>

          {/* 詳細フィルターパネル */}
          {advancedOpen && (
            <div className="ctrl-advanced-panel">
              {/* 初期OPフィルタ */}
              <div className="ctrl-group">
                <Select
                  label={t.controls.initialOp}
                  selectedKeys={new Set([filters.filterInitialOp])}
                  onSelectionChange={(keys) => {
                    if (keys !== 'all') {
                      const key = [...keys][0]
                      filters.setFilterInitialOp((key !== undefined ? String(key) : '') as '' | '3' | '4')
                    }
                  }}
                  size="sm"
                  variant="bordered"
                  classNames={{ trigger: filters.filterInitialOp ? 'ctrl-active' : '' }}
                >
                  <SelectItem key="">{t.controls.allOps}</SelectItem>
                  <SelectItem key="3">{t.controls.op3}</SelectItem>
                  <SelectItem key="4">{t.controls.op4}</SelectItem>
                </Select>
              </div>

              {/* サブステフィルタ */}
              <div className="ctrl-group">
                <label className="ctrl-label">{t.controls.substatFilter}</label>
                <Button
                  ref={subStatBtnRef}
                  type="button"
                  variant="bordered"
                  size="sm"
                  className={`substat-dropdown-btn${filters.filterSubStats.length > 0 ? ' ctrl-active' : ''}`}
                  aria-expanded={subStatOpen}
                  aria-haspopup="listbox"
                  onPress={() => setSubStatOpen((v) => !v)}
                >
                  {filters.filterSubStats.length > 0
                    ? `${t.controls.substatBtn}(${filters.filterSubStats.length})`
                    : t.controls.substatBtn}
                </Button>
                {subStatOpen && createPortal(
                  <div
                    ref={subStatPanelRef}
                    className="substat-dropdown-panel"
                    style={{
                      top: subStatPos.top,
                      left: subStatPos.left,
                    }}
                  >
                    {availableSubStatKeys.map((key) => (
                      <Checkbox
                        key={key}
                        classNames={{ base: 'substat-dropdown-item max-w-full w-full', wrapper: 'mr-1' }}
                        isSelected={filters.filterSubStats.includes(key)}
                        onValueChange={(checked) => filters.toggleSubStat(key, checked)}
                        size="sm"
                      >
                        {t.stats[key] ?? STAT_NAMES[key]}
                      </Checkbox>
                    ))}
                  </div>,
                  document.body,
                )}
              </div>
            </div>
          )}
        </div>

        {/* グループC: 表示設定 */}
        <div className="ctrl-section">
          <div className="ctrl-section-label">{t.controls.groupDisplay}</div>
          <div className="ctrl-section-body">
            {/* サブステソート */}
            <div className="ctrl-group">
              <Select
                label={t.controls.substatSort}
                selectedKeys={new Set([subStatSort])}
                onSelectionChange={(keys) => {
                  if (keys !== 'all') {
                    const key = [...keys][0]
                    setSubStatSort((key !== undefined ? String(key) : '') as StatKey | '')
                  }
                }}
                size="sm"
                variant="bordered"
                items={[
                  { key: '', label: t.controls.byScore },
                  ...ALL_SUBSTAT_KEYS.map((key) => ({
                    key,
                    label: t.stats[key] ?? STAT_NAMES[key],
                  })),
                ]}
              >
                {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
              </Select>
            </div>

            {/* 再構築種別 */}
            <div className="ctrl-group">
              <Select
                label={t.controls.reconstruction}
                selectedKeys={new Set([reconType])}
                onSelectionChange={(keys) => {
                  if (keys !== 'all') {
                    const key = [...keys][0]
                    if (key !== undefined) setReconType(String(key) as ReconstructionType)
                  }
                }}
                size="sm"
                variant="bordered"
              >
                {RECON_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value}>{opt.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* 再構築成功率ソート */}
            <div className="ctrl-group">
              <div className="ctrl-label">&nbsp;</div>
              <Checkbox
                classNames={{ base: 'ctrl-label-toggle' }}
                isSelected={reconSort}
                onValueChange={setReconSort}
                size="sm"
              >
                {t.controls.byOdds}
              </Checkbox>
            </div>
          </div>
        </div>
      </div>

      {/* アクティブフィルターチップ */}
      {hasFilter && (
        <div className="ctrl-filter-chips">
          {filterChips.map((chip, i) => (
            <button
              key={i}
              type="button"
              className="ctrl-filter-chip"
              onClick={chip.onRemove}
            >
              {chip.label}
              <span className="ctrl-chip-close" aria-hidden="true">×</span>
            </button>
          ))}
          <Button
            type="button"
            variant="bordered"
            size="sm"
            className="ctrl-btn ctrl-clear"
            onPress={filters.resetFilters}
          >
            {t.controls.filterClear}
          </Button>
        </div>
      )}
    </div>
  )
}
