'use client'

import { useMemo, useState } from 'react'
import FileUpload from '@/components/FileUpload'
import ArtifactCard from '@/components/ArtifactCard'
import type { ArtifactSlotKey, GoodFile, RankedArtifact, ReconstructionType, ScoreTypeName } from '@/lib/types'
import { calculateAllScores, calculateScores, estimateRollCounts } from '@/lib/scoring'
import { calculateReconstructionRate } from '@/lib/reconstruction'
import { ARTIFACT_SET_NAMES, SCORE_TYPE_FORMULAS, SLOT_NAMES } from '@/lib/constants'

const basePath = process.env.BASE_PATH ?? ''

const SCORE_TYPE_OPTIONS: ScoreTypeName[] = [
  'CV', 'HP型', '攻撃型', '防御型', '熟知型', 'チャージ型', '最良型',
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
  const [reconType, setReconType] = useState<ReconstructionType>('normal')
  const [reconSort, setReconSort] = useState(false)

  function handleLoad(data: GoodFile) {
    setAllRanked(buildRankedList(data))
    setFilterSet('')
    setFilterSlot('')
  }

  // アップロードデータに含まれる setKey を日本語名でソートして列挙
  const setOptions = useMemo(() => {
    if (!allRanked) return []
    const keys = [...new Set(allRanked.map((e) => e.artifact.setKey))].sort((a, b) => {
      const na = ARTIFACT_SET_NAMES[a] ?? a
      const nb = ARTIFACT_SET_NAMES[b] ?? b
      return na.localeCompare(nb, 'ja')
    })
    return keys
  }, [allRanked])

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
      .sort((a, b) => {
        if (reconSort) {
          // 再構築成功率ソートON: 成功率の高い順（nullは末尾）
          const ra = a.reconRate ?? -1
          const rb = b.reconRate ?? -1
          if (ra !== rb) return rb - ra
        }
        return b.entry.allScores[scoreType] - a.entry.allScores[scoreType]
      })
  }, [allRanked, filterSet, filterSlot, scoreType, reconRates, reconSort])

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
                {setOptions.map((key) => (
                  <option key={key} value={key}>
                    {ARTIFACT_SET_NAMES[key] ?? key}
                  </option>
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
                {(filterSet || filterSlot) && ` / ★5 ${allRanked.length} 件`}
              </span>
              <div className="ctrl-buttons">
                {(filterSet || filterSlot) && (
                  <button
                    className="ctrl-btn ctrl-clear"
                    onClick={() => { setFilterSet(''); setFilterSlot('') }}
                  >
                    フィルタをクリア
                  </button>
                )}
                <FileUpload onLoad={handleLoad} compact />
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
