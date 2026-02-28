import type { RankedArtifact, ScoreTypeName } from '@/lib/types'
import { ARTIFACT_SET_NAMES, SLOT_NAMES, STAT_NAMES, PERCENT_STATS, MAIN_STAT_NAMES, getMainStatValue } from '@/lib/constants'
import { decomposeRolls } from '@/lib/scoring'

interface ArtifactCardProps {
  rank: number
  entry: RankedArtifact
  scoreType: ScoreTypeName
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
  upgradeRolls: number  // 強化ロール数（初期除く）
): { label: string; valueStr: string; rollDetail: string } {
  const statKey = key as keyof typeof STAT_NAMES
  const label = STAT_NAMES[statKey] ?? key
  const isPercent = PERCENT_STATS.has(statKey as never)
  const valueStr = isPercent ? `${value.toFixed(1)}%` : `${value}`

  // 全ロール数 = 強化 + 1（初期分）で分解
  const totalRolls = upgradeRolls + 1
  const rolls = decomposeRolls(statKey as never, value, totalRolls)
  let rollDetail = ''
  if (rolls && rolls.length > 0) {
    rollDetail = `(${upgradeRolls}) ${rolls.map((v) => String(v)).join(' + ')}`
  } else {
    rollDetail = `(${upgradeRolls})`
  }

  return { label, valueStr, rollDetail }
}

export default function ArtifactCard({ rank, entry, scoreType }: ArtifactCardProps) {
  const { artifact, cvScore, allScores, rollCounts } = entry
  const { setKey, slotKey, level, rarity, location, substats, mainStatKey } = artifact

  const setName = ARTIFACT_SET_NAMES[setKey] ?? setKey
  const slotName = SLOT_NAMES[slotKey] ?? slotKey
  const mainStatName = MAIN_STAT_NAMES[mainStatKey] ?? mainStatKey
  const mainStatValue = getMainStatValue(level, rarity, mainStatKey)

  const artifactImgSrc = `/artifacts/${setKey}/${slotKey}.png`
  const charImgSrc = location ? `/chars/${location}.png` : null

  const mainScore = allScores[scoreType]
  const showCvSub = scoreType !== 'CV'

  return (
    <div className="artifact-card">
      {/* ランク番号 */}
      <div className="rank-badge">#{rank}</div>

      {/* 上部: 聖遺物画像 + セット情報 + キャラアイコン */}
      <div className="card-header">
        {/* 聖遺物画像 */}
        <div className="artifact-img-wrap">
          <img
            src={artifactImgSrc}
            alt={`${setName} ${slotName}`}
            className="artifact-img"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>

        {/* セット名・部位・メインステータス・レベル */}
        <div className="artifact-info">
          <p className="set-name">{setName}</p>
          <p className="slot-name">
            {slotName}
            {mainStatValue && (
              <span className="main-stat-inline"> · {mainStatName} {mainStatValue}</span>
            )}
          </p>
          <p className="level">+{level}</p>
        </div>

        {/* キャラアイコン */}
        {charImgSrc && (
          <div className="char-wrap">
            <img
              src={charImgSrc}
              alt={location}
              className="char-img"
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
          {scoreType === 'CV' ? 'CV' : scoreType} {mainScore.toFixed(1)}
        </div>
        {/* サブ: CV スコア（CVが選択中は非表示） */}
        {showCvSub && (
          <div className="cv-sub">CV {cvScore.toFixed(1)}</div>
        )}
      </div>

      {/* サブステ一覧 */}
      <div className="substats">
        {substats.map((s, i) => {
          const upgradeRolls = rollCounts[i] ?? 0
          const { label, valueStr, rollDetail } = formatSubstat(s.key, s.value, upgradeRolls)
          return (
            <div key={i} className="substat-row">
              <span className="substat-name">{label}</span>
              <span className="substat-value">{valueStr}</span>
              <span className="substat-rolls">{rollDetail}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
