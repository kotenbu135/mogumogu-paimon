/** GOOD フォーマットの型定義 */

/** 再構築種別 */
export type ReconstructionType = 'normal' | 'advanced' | 'absolute'

export type ArtifactSlotKey = 'flower' | 'plume' | 'sands' | 'goblet' | 'circlet'

export type StatKey =
  | 'hp'
  | 'atk'
  | 'def'
  | 'hp_'
  | 'atk_'
  | 'def_'
  | 'enerRech_'
  | 'eleMas'
  | 'critRate_'
  | 'critDMG_'

/** スコアタイプ名 */
export type ScoreTypeName = 'CV' | 'HP型' | '攻撃型' | '防御型' | '熟知型' | 'チャージ型' | '最良型'

export interface Substat {
  key: StatKey
  value: number
  initialValue?: number
}

export interface Artifact {
  setKey: string
  slotKey: ArtifactSlotKey
  level: number
  rarity: number
  mainStatKey: string
  location: string
  lock: boolean
  substats: Substat[]
  totalRolls: number
}

export interface GoodFile {
  format: 'GOOD'
  version: number
  artifacts: Artifact[]
}

/** スコア計算結果 */
export interface ScoreResult {
  cvScore: number
  bestScore: number
  bestType: string
}

/** ランキング表示用の聖遺物エントリ */
export interface RankedArtifact {
  artifact: Artifact
  cvScore: number
  bestScore: number
  bestType: string
  /** 全スコアタイプのスコア */
  allScores: Record<ScoreTypeName, number>
  /** 強化ロール数（初期ロールを除く）— substats と同じ順 */
  rollCounts: number[]
}
