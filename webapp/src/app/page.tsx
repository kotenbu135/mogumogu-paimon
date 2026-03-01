'use client'

import { useMemo, useState } from 'react'
import FileUpload from '@/components/FileUpload'
import ArtifactCard from '@/components/ArtifactCard'
import type { ArtifactSlotKey, GoodFile, RankedArtifact, ScoreTypeName } from '@/lib/types'
import { calculateAllScores, calculateScores, estimateRollCounts } from '@/lib/scoring'
import { ARTIFACT_SET_NAMES, SCORE_TYPE_FORMULAS, SLOT_NAMES } from '@/lib/constants'

const SCORE_TYPE_OPTIONS: ScoreTypeName[] = [
  'CV', 'HP型', '攻撃型', '防御型', '熟知型', 'チャージ型', '最良型',
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

  // フィルタ・ソート済みリスト
  const displayed = useMemo(() => {
    if (!allRanked) return []
    return [...allRanked]
      .filter((e) => !filterSet || e.artifact.setKey === filterSet)
      .filter((e) => !filterSlot || e.artifact.slotKey === filterSlot)
      .sort((a, b) => b.allScores[scoreType] - a.allScores[scoreType])
  }, [allRanked, filterSet, filterSlot, scoreType])

  return (
    <main className="main-container">
      {/* ── ヘッダー ── */}
      <h1 className="page-title">聖遺物スコアランキング</h1>

      {/* ── 空状態: ヒーロー画像 + アップロード ── */}
      {allRanked === null ? (
        <div className="hero-section">
          <img src="/hero.png" alt="" className="hero-img" />
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

            {/* 件数 + フィルタクリア + 再アップロード */}
            <div className="ctrl-group ctrl-end">
              <span className="result-count">
                {displayed.length} 件
                {(filterSet || filterSlot) && ` / ★5 ${allRanked.length} 件`}
              </span>
              {(filterSet || filterSlot) && (
                <button
                  className="ctrl-clear"
                  onClick={() => { setFilterSet(''); setFilterSlot('') }}
                >
                  フィルタをクリア
                </button>
              )}
              <FileUpload onLoad={handleLoad} compact />
            </div>
          </div>

          {/* ── カードグリッド ── */}
          <div className="card-grid">
            {displayed.map((entry, i) => (
              <ArtifactCard
                key={i}
                rank={i + 1}
                entry={entry}
                scoreType={scoreType}
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
