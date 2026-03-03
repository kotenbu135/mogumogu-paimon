'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import FileUpload from '@/components/FileUpload'
import ArtifactCard from '@/components/ArtifactCard'
import type { ArtifactSlotKey, GoodFile, RankedArtifact, ReconstructionType, ScoreTypeName, StatKey } from '@/lib/types'
import { calculateAllScores, calculateScores, estimateRollCounts } from '@/lib/scoring'
import { calculateReconstructionRate } from '@/lib/reconstruction'
import { ARTIFACT_SET_NAMES, MAIN_STAT_NAMES, SCORE_TYPE_FORMULAS, SLOT_NAMES, STAT_NAMES, groupSetOptions } from '@/lib/constants'

const basePath = process.env.BASE_PATH ?? ''

const SCORE_TYPE_OPTIONS: ScoreTypeName[] = [
  'CV', '攻撃型', 'HP型', '防御型', '熟知型', 'チャージ型', '最良型',
]

const RECON_OPTIONS: { value: ReconstructionType; label: string }[] = [
  { value: 'normal', label: '通常再構築' },
  { value: 'advanced', label: '上級再構築' },
  { value: 'absolute', label: '絶対再構築' },
]

const SLOT_OPTIONS: { value: ArtifactSlotKey | ''; label: string }[] = [
  { value: '', label: 'すべての部位' },
  { value: 'flower', label: SLOT_NAMES.flower },
  { value: 'plume', label: SLOT_NAMES.plume },
  { value: 'sands', label: SLOT_NAMES.sands },
  { value: 'goblet', label: SLOT_NAMES.goblet },
  { value: 'circlet', label: SLOT_NAMES.circlet },
]

/** GOODファイルを読み込んで★5聖遺物をランク付けする */
function buildRankedList(data: GoodFile): RankedArtifact[] {
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
  const [allRanked, setAllRanked] = useState<RankedArtifact[] | null>(null)
  const [scoreType, setScoreType] = useState<ScoreTypeName>('攻撃型')
  const [filterSet, setFilterSet] = useState('')
  const [filterSlot, setFilterSlot] = useState<ArtifactSlotKey | ''>('')
  const [filterMainStat, setFilterMainStat] = useState('')
  const [filterSubStats, setFilterSubStats] = useState<StatKey[]>([])
  const [filterInitialOp, setFilterInitialOp] = useState<'' | '3' | '4'>('')
  const [subStatSort, setSubStatSort] = useState<StatKey | ''>('')
  const [subStatOpen, setSubStatOpen] = useState(false)
  const subStatBtnRef = useRef<HTMLButtonElement>(null)
  const subStatPanelRef = useRef<HTMLDivElement>(null)
  const [reconType, setReconType] = useState<ReconstructionType>('normal')
  const [reconSort, setReconSort] = useState(false)

  // サブステドロップダウンの外側クリック・Escキーで閉じる
  useEffect(() => {
    if (!subStatOpen) return
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (
        subStatBtnRef.current && !subStatBtnRef.current.contains(target) &&
        subStatPanelRef.current && !subStatPanelRef.current.contains(target)
      ) {
        setSubStatOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSubStatOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [subStatOpen])

  function handleLoad(data: GoodFile) {
    setAllRanked(buildRankedList(data))
    setFilterSet('')
    setFilterSlot('')
    setFilterMainStat('')
    setFilterSubStats([])
    setFilterInitialOp('')
    setSubStatSort('')
  }

  // アップロードデータに含まれる setKey をグループ化して列挙
  const setOptionGroups = useMemo(() => {
    if (!allRanked) return []
    const keys = [...new Set(allRanked.map((e) => e.artifact.setKey))]
    return groupSetOptions(keys)
  }, [allRanked])

  // アップロードデータに存在するメインステキーの一覧（固定順序）
  const MAIN_STAT_ORDER: string[] = [
    'critRate_', 'critDMG_', 'atk_', 'hp_', 'def_',
    'eleMas', 'enerRech_', 'heal_',
    'anemo_dmg_', 'geo_dmg_', 'electro_dmg_', 'dendro_dmg_',
    'hydro_dmg_', 'pyro_dmg_', 'cryo_dmg_',
    'atk', 'hp', 'def',
  ]
  const mainStatOptions = useMemo(() => {
    if (!allRanked) return []
    const present = new Set(allRanked.map((e) => e.artifact.mainStatKey))
    return MAIN_STAT_ORDER.filter((k) => present.has(k))
  }, [allRanked])

  // メインステフィルタが選択されている場合、同じキーをサブステ選択肢から除外
  const ALL_SUBSTAT_KEYS: StatKey[] = [
    'critRate_', 'critDMG_', 'atk_', 'hp_', 'def_',
    'eleMas', 'enerRech_', 'atk', 'hp', 'def',
  ]
  const availableSubStatKeys = useMemo((): StatKey[] => {
    if (!filterMainStat) return ALL_SUBSTAT_KEYS
    return ALL_SUBSTAT_KEYS.filter((k) => k !== filterMainStat)
  }, [filterMainStat])

  // キャラ名 → 装備セットキー配列のマップ
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

  // 再構築成功率マップ（entry index → rate）
  const reconRates = useMemo(() => {
    if (!allRanked) return new Map<number, number>()
    const map = new Map<number, number>()
    for (let i = 0; i < allRanked.length; i++) {
      const e = allRanked[i]
      const rate = calculateReconstructionRate(e.artifact, e.rollCounts, scoreType, reconType)
      if (rate !== null) map.set(i, rate)
    }
    return map
  }, [allRanked, scoreType, reconType])

  // フィルタ・ソート済みリスト（再構築成功率付き）
  const displayed = useMemo(() => {
    if (!allRanked) return []
    return allRanked
      .map((e, i) => ({ entry: e, reconRate: reconRates.get(i) ?? null }))
      .filter(({ entry: e }) => !filterSet || e.artifact.setKey === filterSet)
      .filter(({ entry: e }) => !filterSlot || e.artifact.slotKey === filterSlot)
      .filter(({ entry: e }) => !filterMainStat || e.artifact.mainStatKey === filterMainStat)
      .filter(({ entry: e }) =>
        filterSubStats.length === 0 ||
        filterSubStats.every((k) => e.artifact.substats.some((s) => s.key === k)),
      )
      .filter(({ entry: e }) => {
        if (!filterInitialOp) return true
        const initialOp = e.artifact.totalRolls - Math.floor(e.artifact.level / 4)
        return initialOp === Number(filterInitialOp)
      })
      .sort((a, b) => {
        if (reconSort) {
          // 再構築成功率ソートON: 成功率の高い順（nullは末尾）
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
  }, [allRanked, filterSet, filterSlot, filterMainStat, filterSubStats, filterInitialOp, subStatSort, scoreType, reconRates, reconSort])

  return (
    <main className="main-container">
      {/* ── ヘッダー ── */}
      <h1 className="page-title">もぐもぐパイモン - 聖遺物スコア -</h1>

      {/* ── 空状態: ヒーロー画像 + アップロード ── */}
      {allRanked === null ? (
        <div className="hero-section">
          <FileUpload onLoad={handleLoad} />
          {/* スコア計算式の説明 */}
          <div className="score-formulas">
            <p className="score-formulas-title">スコア計算方式</p>
            <ul className="score-formulas-list">
              {SCORE_TYPE_OPTIONS.map((type) => (
                <li key={type} className="score-formulas-item">
                  <span className="score-formulas-label">{SCORE_TYPE_FORMULAS[type].label}</span>
                  <span className="score-formulas-eq">=</span>
                  <span className="score-formulas-formula">{SCORE_TYPE_FORMULAS[type].formula}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <>
          {/* ── コントロールバー ── */}
          <div className="controls-bar">
            {/* スコアタイプ */}
            <div className="ctrl-group">
              <label className="ctrl-label">スコアタイプ</label>
              <select
                className="ctrl-select"
                value={scoreType}
                onChange={(e) => setScoreType(e.target.value as ScoreTypeName)}
              >
                {SCORE_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* セットフィルタ */}
            <div className="ctrl-group">
              <label className="ctrl-label">セット</label>
              <select
                className="ctrl-select"
                value={filterSet}
                onChange={(e) => setFilterSet(e.target.value)}
              >
                <option value="">すべてのセット</option>
                {setOptionGroups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.keys.map((key) => (
                      <option key={key} value={key}>
                        {ARTIFACT_SET_NAMES[key] ?? key}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* 部位フィルタ */}
            <div className="ctrl-group">
              <label className="ctrl-label">部位</label>
              <select
                className="ctrl-select"
                value={filterSlot}
                onChange={(e) => setFilterSlot(e.target.value as ArtifactSlotKey | '')}
              >
                {SLOT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* メインステフィルタ */}
            <div className="ctrl-group">
              <label className="ctrl-label">メインステ</label>
              <select
                className="ctrl-select"
                value={filterMainStat}
                onChange={(e) => {
                  const val = e.target.value
                  setFilterMainStat(val)
                  setFilterSubStats((prev) => prev.filter((k) => k !== val))
                }}
              >
                <option value="">すべて</option>
                {mainStatOptions.map((key) => (
                  <option key={key} value={key}>
                    {MAIN_STAT_NAMES[key] ?? key}
                  </option>
                ))}
              </select>
            </div>

            {/* 初期OPフィルタ */}
            <div className="ctrl-group">
              <label className="ctrl-label">初期OP</label>
              <select
                className="ctrl-select"
                value={filterInitialOp}
                onChange={(e) => setFilterInitialOp(e.target.value as '' | '3' | '4')}
              >
                <option value="">すべて</option>
                <option value="3">3OP</option>
                <option value="4">4OP</option>
              </select>
            </div>

            {/* サブステフィルタ */}
            <div className="ctrl-group">
              <label className="ctrl-label">サブステ（AND）</label>
              <button
                ref={subStatBtnRef}
                type="button"
                className="substat-dropdown-btn"
                onClick={() => setSubStatOpen((v) => !v)}
              >
                {filterSubStats.length > 0
                  ? `サブステ(${filterSubStats.length})`
                  : 'サブステ'}
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
                        checked={filterSubStats.includes(key)}
                        onChange={(e) => {
                          setFilterSubStats((prev) =>
                            e.target.checked
                              ? [...prev, key]
                              : prev.filter((k) => k !== key),
                          )
                        }}
                      />
                      {STAT_NAMES[key]}
                    </label>
                  ))}
                </div>,
                document.body,
              )}
            </div>

            {/* サブステソート */}
            <div className="ctrl-group">
              <label className="ctrl-label">サブステソート</label>
              <select
                className="ctrl-select"
                value={subStatSort}
                onChange={(e) => setSubStatSort(e.target.value as StatKey | '')}
              >
                <option value="">スコア順</option>
                {ALL_SUBSTAT_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {STAT_NAMES[key]}
                  </option>
                ))}
              </select>
            </div>

            {/* 再構築種別 */}
            <div className="ctrl-group">
              <label className="ctrl-label">再構築</label>
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
                成功率順
              </label>
            </div>

            {/* 件数 + フィルタクリア + 再アップロード */}
            <div className="ctrl-group ctrl-end">
              <span className="result-count">
                {displayed.length} 件
                {(filterSet || filterSlot || filterMainStat || filterSubStats.length > 0) && ` / ${allRanked.length} 件`}
              </span>
              <div className="ctrl-buttons">
                {(filterSet || filterSlot || filterMainStat || filterSubStats.length > 0 || filterInitialOp) && (
                  <button
                    className="ctrl-btn ctrl-clear"
                    onClick={() => { setFilterSet(''); setFilterSlot(''); setFilterMainStat(''); setFilterSubStats([]); setFilterInitialOp('') }}
                  >
                    フィルタをクリア
                  </button>
                )}

              </div>
            </div>
          </div>

          {/* ── カードグリッド ── */}
          <div className="card-grid">
            {displayed.map(({ entry, reconRate }, i) => (
              <ArtifactCard
                key={i}
                rank={i + 1}
                entry={entry}
                scoreType={scoreType}
                reconRate={reconRate}
                onFilterBySet={setFilterSet}
                onFilterBySlot={setFilterSlot}
                equippedSetKeys={equippedSetsMap.get(entry.artifact.location) ?? []}
              />
            ))}
          </div>
        </>
      )}
    </main>
  )
}
