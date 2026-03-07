'use client'

import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ArtifactSlotKey, ReconstructionType, ScoreTypeName, StatKey } from '@/lib/types'
import type { ArtifactFiltersHook } from '@/hooks/useArtifactFilters'
import { useDropdownClose } from '@/hooks/useDropdownClose'
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
              <label className="ctrl-label">{t.controls.scoreType}</label>
              <select
                className="ctrl-select"
                value={scoreType}
                onChange={(e) => setScoreType(e.target.value as ScoreTypeName)}
              >
                {SCORE_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>{t.scoreFormulas[type].label}</option>
                ))}
              </select>
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
              <button
                ref={setFilterBtnRef}
                type="button"
                className={`substat-dropdown-btn${filters.filterSets.length > 0 ? ' ctrl-active' : ''}`}
                onClick={() => setSetFilterOpen((v) => !v)}
              >
                {filters.filterSets.length > 0
                  ? `${t.controls.set}(${filters.filterSets.length})`
                  : t.controls.set}
              </button>
              {setFilterOpen && createPortal(
                <div
                  ref={setFilterPanelRef}
                  className="set-dropdown-panel"
                  style={{
                    top: (setFilterBtnRef.current?.getBoundingClientRect().bottom ?? 0) + 4,
                    left: setFilterBtnRef.current?.getBoundingClientRect().left ?? 0,
                  }}
                >
                  {setOptionGroups.map((group) => {
                    const allSelected = group.keys.every((k) => filters.filterSets.includes(k))
                    const someSelected = group.keys.some((k) => filters.filterSets.includes(k))
                    const groupLabel = t.setGroupLabels[group.label] ?? group.label
                    return (
                      <div key={group.label}>
                        <label className="set-group-header">
                          <input
                            type="checkbox"
                            className="ctrl-checkbox"
                            checked={allSelected}
                            ref={(el) => {
                              if (el) el.indeterminate = someSelected && !allSelected
                            }}
                            onChange={() => filters.toggleSetGroup(group.keys, allSelected)}
                          />
                          {groupLabel}
                        </label>
                        {group.keys.map((key) => (
                          <label key={key} className="substat-dropdown-item set-item">
                            <input
                              type="checkbox"
                              className="ctrl-checkbox"
                              checked={filters.filterSets.includes(key)}
                              onChange={(e) => filters.toggleSet(key, e.target.checked)}
                            />
                            {t.artifactSetNames[key] ?? ARTIFACT_SET_NAMES[key] ?? key}
                          </label>
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
              <label className="ctrl-label">{t.controls.slot}</label>
              <select
                className={`ctrl-select${filters.filterSlot ? ' ctrl-active' : ''}`}
                value={filters.filterSlot}
                onChange={(e) => filters.setFilterSlot(e.target.value as ArtifactSlotKey | '')}
              >
                {SLOT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* メインステフィルタ */}
            <div className="ctrl-group">
              <label className="ctrl-label">{t.controls.mainStat}</label>
              <select
                className={`ctrl-select${filters.filterMainStat ? ' ctrl-active' : ''}`}
                value={filters.filterMainStat}
                onChange={(e) => filters.applyMainStat(e.target.value)}
              >
                <option value="">{t.controls.allMainStats}</option>
                {mainStatOptions.map((key) => (
                  <option key={key} value={key}>
                    {allMainStatNames[key] ?? MAIN_STAT_NAMES[key] ?? key}
                  </option>
                ))}
              </select>
            </div>

            {/* 詳細フィルタートグル */}
            <div className="ctrl-group">
              <div className="ctrl-label">&nbsp;</div>
              <button
                type="button"
                className={`ctrl-advanced-btn${advancedOpen ? ' ctrl-advanced-open' : ''}${(filters.filterInitialOp || filters.filterSubStats.length > 0) ? ' ctrl-active' : ''}`}
                onClick={() => setAdvancedOpen((v) => !v)}
              >
                {t.controls.advancedFilter}
                <span className="ctrl-advanced-arrow">{advancedOpen ? '▲' : '▼'}</span>
              </button>
            </div>
          </div>

          {/* 詳細フィルターパネル */}
          {advancedOpen && (
            <div className="ctrl-advanced-panel">
              {/* 初期OPフィルタ */}
              <div className="ctrl-group">
                <label className="ctrl-label">{t.controls.initialOp}</label>
                <select
                  className={`ctrl-select${filters.filterInitialOp ? ' ctrl-active' : ''}`}
                  value={filters.filterInitialOp}
                  onChange={(e) => filters.setFilterInitialOp(e.target.value as '' | '3' | '4')}
                >
                  <option value="">{t.controls.allOps}</option>
                  <option value="3">{t.controls.op3}</option>
                  <option value="4">{t.controls.op4}</option>
                </select>
              </div>

              {/* サブステフィルタ */}
              <div className="ctrl-group">
                <label className="ctrl-label">{t.controls.substatFilter}</label>
                <button
                  ref={subStatBtnRef}
                  type="button"
                  className={`substat-dropdown-btn${filters.filterSubStats.length > 0 ? ' ctrl-active' : ''}`}
                  onClick={() => setSubStatOpen((v) => !v)}
                >
                  {filters.filterSubStats.length > 0
                    ? `${t.controls.substatBtn}(${filters.filterSubStats.length})`
                    : t.controls.substatBtn}
                </button>
                {subStatOpen && createPortal(
                  <div
                    ref={subStatPanelRef}
                    className="substat-dropdown-panel"
                    style={{
                      top: (subStatBtnRef.current?.getBoundingClientRect().bottom ?? 0) + 4,
                      left: subStatBtnRef.current?.getBoundingClientRect().left ?? 0,
                    }}
                  >
                    {availableSubStatKeys.map((key) => (
                      <label key={key} className="substat-dropdown-item">
                        <input
                          type="checkbox"
                          className="ctrl-checkbox"
                          checked={filters.filterSubStats.includes(key)}
                          onChange={(e) => filters.toggleSubStat(key, e.target.checked)}
                        />
                        {t.stats[key] ?? STAT_NAMES[key]}
                      </label>
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
              <label className="ctrl-label">{t.controls.substatSort}</label>
              <select
                className="ctrl-select"
                value={subStatSort}
                onChange={(e) => setSubStatSort(e.target.value as StatKey | '')}
              >
                <option value="">{t.controls.byScore}</option>
                {ALL_SUBSTAT_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {t.stats[key] ?? STAT_NAMES[key]}
                  </option>
                ))}
              </select>
            </div>

            {/* 再構築種別 */}
            <div className="ctrl-group">
              <label className="ctrl-label">{t.controls.reconstruction}</label>
              <select
                className="ctrl-select"
                value={reconType}
                onChange={(e) => setReconType(e.target.value as ReconstructionType)}
              >
                {RECON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* 再構築成功率ソート */}
            <div className="ctrl-group">
              <div className="ctrl-label">&nbsp;</div>
              <label className="ctrl-label-toggle">
                <input
                  type="checkbox"
                  className="ctrl-checkbox"
                  checked={reconSort}
                  onChange={(e) => setReconSort(e.target.checked)}
                />
                {t.controls.byOdds}
              </label>
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
          <button
            type="button"
            className="ctrl-btn ctrl-clear"
            onClick={filters.resetFilters}
          >
            {t.controls.filterClear}
          </button>
        </div>
      )}
    </div>
  )
}
