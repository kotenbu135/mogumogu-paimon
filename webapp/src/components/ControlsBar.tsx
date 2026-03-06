'use client'

import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ArtifactSlotKey, ReconstructionType, ScoreTypeName, StatKey } from '@/lib/types'
import type { ArtifactFiltersHook } from '@/hooks/useArtifactFilters'
import { useDropdownClose } from '@/hooks/useDropdownClose'
import { hasActiveFilter } from '@/lib/filterUtils'
import { ARTIFACT_SET_NAMES, MAIN_STAT_NAMES, STAT_NAMES } from '@/lib/constants'
import type { Translations } from '@/lib/i18n/types'

const SCORE_TYPE_OPTIONS: ScoreTypeName[] = [
  'CV', '攻撃型', 'HP型', '防御型', '熟知型', 'チャージ型', '最良型',
]

const ALL_SUBSTAT_KEYS: StatKey[] = [
  'critRate_', 'critDMG_', 'atk_', 'hp_', 'def_',
  'eleMas', 'enerRech_', 'atk', 'hp', 'def',
]

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

  return (
    <div className="controls-bar">
      {/* スコアタイプ */}
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

      {/* セットフィルタ */}
      <div className="ctrl-group">
        <label className="ctrl-label">{t.controls.set}</label>
        <button
          ref={setFilterBtnRef}
          type="button"
          className="substat-dropdown-btn"
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
          className="ctrl-select"
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
          className="ctrl-select"
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

      {/* 初期OPフィルタ */}
      <div className="ctrl-group">
        <label className="ctrl-label">{t.controls.initialOp}</label>
        <select
          className="ctrl-select"
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
          className="substat-dropdown-btn"
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
        <label className="ctrl-label-toggle">
          <input
            type="checkbox"
            className="ctrl-checkbox"
            checked={reconSort}
            onChange={(e) => setReconSort(e.target.checked)}
          />
          {t.controls.bySuccessRate}
        </label>
      </div>

      {/* フィルタクリア */}
      <div className="ctrl-group ctrl-end">
        <button
          className="ctrl-btn ctrl-clear"
          disabled={!hasActiveFilter(
            filters.filterSets,
            filters.filterSlot,
            filters.filterMainStat,
            filters.filterSubStats,
            filters.filterInitialOp,
          )}
          onClick={filters.resetFilters}
        >
          {t.controls.filterClear}
        </button>
      </div>
    </div>
  )
}
