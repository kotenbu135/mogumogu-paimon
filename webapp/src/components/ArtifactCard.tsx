'use client'

import { useState } from 'react'
import type { RankedArtifact, ScoreTypeName, ArtifactSlotKey, StatKey } from '@/lib/types'
import { ARTIFACT_SET_NAMES, SLOT_NAMES, STAT_NAMES, PERCENT_STATS, MAIN_STAT_NAMES, CHARACTER_NAMES, getMainStatValue } from '@/lib/constants'
import { decomposeRolls, getEffectiveStats } from '@/lib/scoring'
import { getContextMenuItems, getCharContextMenuItems } from '@/lib/contextMenu'
import ContextMenu from './ContextMenu'
import { useTranslation } from '@/lib/i18n'
import { getAllStatNames } from '@/lib/i18n/types'

interface ArtifactCardProps {
  entry: RankedArtifact
  scoreType: ScoreTypeName
  reconRate?: number | null
  onFilterBySet?: (setKey: string) => void
  onFilterBySlot?: (slotKey: ArtifactSlotKey) => void
  equippedSetKeys?: string[]
  cardIndex?: number
}

/** メインスコアの値に応じた色クラスを返す */
function scoreColor(score: number): string {
  if (score >= 55) return 'text-red-400'
  if (score >= 45) return 'text-orange-400'
  if (score >= 35) return 'text-yellow-400'
  return 'text-white'
}

/** サブステ1行のフォーマット */
function formatSubstat(
  key: string,
  value: number,
  upgradeRolls: number,  // 強化ロール数（初期除く）
  statLabels: Record<string, string>,
): { label: string; valueStr: string; rollDetail: string } {
  const statKey = key as StatKey
  const label = statLabels[statKey] ?? STAT_NAMES[statKey] ?? key
  const isPercent = PERCENT_STATS.has(statKey)
  const valueStr = isPercent ? `${value.toFixed(1)}%` : `${value}`

  // 全ロール数 = 強化 + 1（初期分）で分解
  const totalRolls = upgradeRolls + 1
  const rolls = decomposeRolls(statKey, value, totalRolls)
  const rollDetail =
    rolls && rolls.length > 0
      ? `(${upgradeRolls}) ${rolls.map((v) => String(v)).join(' + ')}`
      : `(${upgradeRolls})`

  return { label, valueStr, rollDetail }
}

/** スコアのランク文字を返す */
function scoreRank(score: number): string {
  if (score >= 55) return 'S'
  if (score >= 45) return 'A'
  if (score >= 35) return 'B'
  return 'C'
}

/** スコアランクバッジの CSS クラスを返す */
function scoreRankClass(score: number): string {
  if (score >= 55) return 'rank-s'
  if (score >= 45) return 'rank-a'
  if (score >= 35) return 'rank-b'
  return 'rank-c'
}

/** スコアバーの色クラスを返す */
function scoreBarColor(score: number): string {
  if (score >= 55) return 'score-bar-red'
  if (score >= 45) return 'score-bar-orange'
  if (score >= 35) return 'score-bar-yellow'
  return 'score-bar-default'
}

/** 再構築成功率の色クラスを返す */
function reconColor(rate: number): string {
  if (rate >= 70) return 'recon-rate-red'
  if (rate >= 50) return 'recon-rate-orange'
  return 'recon-rate-grey'
}

/** コンテキストメニューの状態 */
interface MenuState {
  x: number
  y: number
}

export default function ArtifactCard({ entry, scoreType, reconRate, onFilterBySet, onFilterBySlot, equippedSetKeys, cardIndex }: ArtifactCardProps) {
  const { artifact, cvScore, allScores, rollCounts } = entry
  const { setKey, slotKey, level, rarity, location, substats, mainStatKey } = artifact
  const { t } = useTranslation()

  const allStatLabels = getAllStatNames(t)
  const setName = t.artifactSetNames[setKey] ?? ARTIFACT_SET_NAMES[setKey] ?? setKey
  const slotName = t.slots[slotKey] ?? SLOT_NAMES[slotKey] ?? slotKey
  const mainStatName = allStatLabels[mainStatKey] ?? MAIN_STAT_NAMES[mainStatKey] ?? mainStatKey
  const mainStatValue = getMainStatValue(level, rarity, mainStatKey)

  const bp = process.env.BASE_PATH ?? ''
  const isSafeKey = (s: string) => /^[a-zA-Z0-9_-]+$/.test(s)
  const artifactImgSrc = isSafeKey(setKey) && isSafeKey(slotKey) ? `${bp}/artifacts/${setKey}/${slotKey}.webp` : null
  const charImgSrc = location && isSafeKey(location) ? `${bp}/chars/${location}.webp` : null
  const charName = (location && CHARACTER_NAMES[location]) ?? location

  const mainScore = allScores[scoreType]
  // 最良型選択時はそのカードの最良タイプ名を表示ラベルとして使う
  const scoreLabel = (type: string) => t.scoreFormulas[type as ScoreTypeName]?.label ?? type
  const displayLabel = scoreType === '最良型' ? scoreLabel(entry.bestType) : scoreLabel(scoreType)
  const showCvSub = scoreType !== 'CV' && !(scoreType === '最良型' && mainScore === cvScore)

  const effectiveStats = getEffectiveStats(scoreType, entry.bestType)

  const [menuState, setMenuState] = useState<MenuState | null>(null)
  const [charMenuState, setCharMenuState] = useState<MenuState | null>(null)

  // フィルタコールバックが両方存在する場合のみコンテキストメニューを有効化
  const canFilter = !!onFilterBySet && !!onFilterBySlot
  const canCharFilter = !!onFilterBySet && !!equippedSetKeys && equippedSetKeys.length > 0

  function handleImageClick(e: React.MouseEvent) {
    if (!canFilter) return
    e.stopPropagation()
    setMenuState({ x: e.clientX, y: e.clientY })
  }

  function handleCharClick(e: React.MouseEvent) {
    if (!canCharFilter) return
    e.stopPropagation()
    setCharMenuState({ x: e.clientX, y: e.clientY })
  }

  function handleImageKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!canFilter) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const rect = e.currentTarget.getBoundingClientRect()
      setMenuState({ x: rect.left, y: rect.bottom })
    }
  }

  function handleCharKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!canCharFilter) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const rect = e.currentTarget.getBoundingClientRect()
      setCharMenuState({ x: rect.left, y: rect.bottom })
    }
  }

  const contextLabels = {
    setPrefix: t.card.filterSet,
    slotPrefix: t.card.filterSlot,
    setNames: t.artifactSetNames,
    slotNames: t.slots,
  }

  const menuItems = canFilter
    ? getContextMenuItems(setKey, slotKey, onFilterBySet!, onFilterBySlot!, contextLabels)
    : []

  const charMenuItems = canCharFilter
    ? getCharContextMenuItems(equippedSetKeys!, onFilterBySet!, { setPrefix: t.card.filterSet, setNames: t.artifactSetNames })
    : []

  const animDelay = cardIndex !== undefined ? `${Math.min(cardIndex, 20) * 40}ms` : '0ms'
  // 先頭4枚はファーストビューとして eager ロード、それ以外は lazy ロード
  const imgLoading: 'eager' | 'lazy' = cardIndex !== undefined && cardIndex < 4 ? 'eager' : 'lazy'
  const scorePct = `${Math.min((mainScore / 60) * 100, 100).toFixed(1)}%`

  return (
    <div
      className="artifact-card"
      style={{ '--card-anim-delay': animDelay } as React.CSSProperties}
    >
      {/* 上部: 聖遺物画像 + セット情報 + キャラアイコン */}
      <div className="card-header">
        {/* 聖遺物画像（クリックでフィルタメニュー） */}
        <div
          className={`artifact-img-wrap${canFilter ? ' artifact-img-clickable' : ''}`}
          onClick={handleImageClick}
          onKeyDown={handleImageKeyDown}
          title={canFilter ? t.card.clickToFilter : undefined}
          role={canFilter ? 'button' : undefined}
          tabIndex={canFilter ? 0 : undefined}
          aria-label={canFilter ? t.card.clickToFilter : undefined}
        >
          {artifactImgSrc ? (
            <img
              src={artifactImgSrc}
              alt={`${setName} ${slotName}`}
              className="artifact-img"
              loading={imgLoading}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <span className="artifact-img-placeholder" aria-hidden="true">?</span>
          )}
        </div>

        {/* セット名・部位・メインステータス */}
        <div className="artifact-info">
          <p className="set-name">{setName}</p>
          <p className="slot-name">{slotName}</p>
          {mainStatValue && (
            <p className="main-stat-line">{mainStatName} {mainStatValue}</p>
          )}
        </div>

        {/* キャラアイコン（クリックで装備セットフィルタメニュー） */}
        {charImgSrc && (
          <div
            className={`char-wrap${canCharFilter ? ' char-wrap-clickable' : ''}`}
            onClick={handleCharClick}
            onKeyDown={handleCharKeyDown}
            title={canCharFilter ? t.card.clickToFilterEquipped : undefined}
            role={canCharFilter ? 'button' : undefined}
            tabIndex={canCharFilter ? 0 : undefined}
            aria-label={canCharFilter ? `${charName} - ${t.card.clickToFilterEquipped}` : undefined}
          >
            <img
              src={charImgSrc}
              alt={charName}
              className="char-img"
              loading={imgLoading}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        )}
      </div>

      {/* スコア表示 */}
      <div className="score-section">
        {/* メイン: 選択型スコア（大きく） */}
        <div className={`main-score ${scoreColor(mainScore)}`}>
          <span className="score-label">{displayLabel}</span> {mainScore.toFixed(1)}
        </div>
        {/* サブ: CV スコア（CVが選択中は非表示） */}
        {showCvSub && (
          <div className="cv-sub">CV {cvScore.toFixed(1)}</div>
        )}
        {/* ランクバッジ（S/A/B/C） */}
        <span className={`score-rank-badge ${scoreRankClass(mainScore)}`}>
          {scoreRank(mainScore)}
        </span>
      </div>

      {/* スコアバー（0から伸びるアニメーション） */}
      <div className="score-bar-wrap">
        <div
          className={`score-bar ${scoreBarColor(mainScore)}`}
          style={{ '--score-pct': scorePct } as React.CSSProperties}
        />
      </div>

      {/* サブステ一覧 */}
      <div className="substats">
        {substats.map((s, i) => {
          const upgradeRolls = rollCounts[i] ?? 0
          const { label, valueStr } = formatSubstat(s.key, s.value, upgradeRolls, t.stats)
          const isEffective = effectiveStats.has(s.key as StatKey)
          const totalRolls = upgradeRolls + 1
          return (
            <div key={i} className={`substat-row${isEffective ? ' substat-effective' : ''}`}>
              <span className="substat-name">{label}</span>
              <span className="substat-value">{valueStr}</span>
              <span className="substat-roll-bars">
                {Array.from({ length: totalRolls }).map((_, j) => (
                  <span key={j} className="roll-block" />
                ))}
              </span>
            </div>
          )
        })}
      </div>

      {/* 再構築成功率 */}
      {reconRate != null && (
        <div className="recon-rate-wrap">
          <span className={`recon-rate-badge ${reconColor(reconRate)}`}>
            <img
              src={`${bp}/icons/Item_Dust_of_Enlightenment.webp`}
              alt="聖啓の塵"
              className="recon-icon"
              loading={imgLoading}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            {Math.round(reconRate)}%
          </span>
        </div>
      )}

      {/* コンテキストメニュー（聖遺物画像） */}
      {menuState && (
        <ContextMenu
          x={menuState.x}
          y={menuState.y}
          items={menuItems}
          onClose={() => setMenuState(null)}
        />
      )}

      {/* コンテキストメニュー（キャラアイコン） */}
      {charMenuState && (
        <ContextMenu
          x={charMenuState.x}
          y={charMenuState.y}
          items={charMenuItems}
          onClose={() => setCharMenuState(null)}
        />
      )}
    </div>
  )
}
