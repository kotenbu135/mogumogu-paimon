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

/** メインステータスキー（サブステ外のキーも含む） */
export type MainStatKey =
  | StatKey
  | 'heal_'
  | 'anemo_dmg_'
  | 'cryo_dmg_'
  | 'dendro_dmg_'
  | 'electro_dmg_'
  | 'geo_dmg_'
  | 'hydro_dmg_'
  | 'pyro_dmg_'
  | 'physical_dmg_'

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
  mainStatKey: MainStatKey
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
  bestType: ScoreTypeName
}

/** ランキング表示用の聖遺物エントリ */
export interface RankedArtifact {
  artifact: Artifact
  cvScore: number
  bestScore: number
  bestType: ScoreTypeName
  /** 全スコアタイプのスコア */
  allScores: Record<ScoreTypeName, number>
  /** 強化ロール数（初期ロールを除く）— substats と同じ順 */
  rollCounts: number[]
}
