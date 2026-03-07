import type { ArtifactSlotKey, ScoreTypeName, StatKey } from '../types'

export type Lang = 'ja' | 'en'

export interface Translations {
  lang: Lang
  siteTitle: string

  nav: {
    home: string
    aboutScore: string
    aboutReconstruction: string
    howToUse: string
    faq: string
    disclaimer: string
  }

  slots: Record<ArtifactSlotKey, string>
  stats: Record<StatKey, string>
  mainStatExtra: Record<string, string>
  scoreFormulas: Record<ScoreTypeName, { label: string; formula: string }>

  /** セットグループラベルの翻訳マップ（日本語ラベル → 翻訳済みラベル） */
  setGroupLabels: Record<string, string>

  /** 聖遺物セット名の翻訳（上書き用; 未定義なら constants の名前をフォールバックとして使う） */
  artifactSetNames: Record<string, string>

  upload: {
    drop: string
    click: string
    errorFormat: string
    errorParse: string
    errorSize: string
  }

  controls: {
    scoreType: string
    set: string
    slot: string
    allSlots: string
    mainStat: string
    allMainStats: string
    initialOp: string
    allOps: string
    op3: string
    op4: string
    substatFilter: string
    substatBtn: string
    substatSort: string
    byScore: string
    reconstruction: string
    byOdds: string
    filterClear: string
    filterBySet: string
    filterBySlot: string
    groupScore: string
    groupFilter: string
    groupDisplay: string
    advancedFilter: string
  }

  reconTypes: Record<'normal' | 'advanced' | 'absolute', string>

  card: {
    clickToFilter: string
    clickToFilterEquipped: string
    filterSet: string
    filterSlot: string
  }

  pages: {
    aboutScore: AboutScoreT
    aboutReconstruction: AboutReconstructionT
    howToUse: HowToUseT
    faq: FaqT
    disclaimer: DisclaimerT
  }
}

export interface AboutScoreT {
  title: string
  whatIsScore: { heading: string; p1: string; p2: string }
  cv: {
    heading: string
    p1: string
    formula: string
    p2: string
    tier55: string
    tier45: string
    tier35: string
    tierDefault: string
  }
  formulaList: { heading: string; p1: string }
  mainStatFilter: {
    heading: string
    p1: string
    p2: string
    tableHeaders: { scoreType: string; mainStat: string }
    rows: readonly { scoreType: string; mainStat: string }[]
    note: string
  }
}

export interface AboutReconstructionT {
  title: string
  whatIs: { heading: string; p1: string; p2: string }
  types: {
    heading: string
    p1: string
    normal: string
    advanced: string
    absolute: string
    p2: string
  }
  successRate: {
    heading: string
    p1: string
    steps: readonly string[]
    p2: string
  }
  guarantee: {
    heading: string
    p1: string
    basic: string
    circlet: string
    cvCirclet: string
  }
  precision: {
    heading: string
    p1: string
    bullets: readonly string[]
    p2: string
  }
}

export interface HowToUseT {
  title: string
  step1: {
    heading: string
    p1pre: string
    p1link: string
    p1post: string
    p2: string
    p3: string
  }
  step2: { heading: string; p1: string }
  step3: { heading: string; p1: string; p2: string; p3: string }
}

export interface FaqT {
  title: string
  q1: { q: string; a: string; refLabel: string }
  q2: { q: string; a: string }
}

export interface DisclaimerT {
  title: string
  responsibility: { heading: string; p1: string; p2: string; p3: string }
  disclaimer: { heading: string; p1: string }
}

/** stats と mainStatExtra をマージした全ステータス名マップを返す */
export function getAllStatNames(t: Translations): Record<string, string> {
  return { ...t.stats, ...t.mainStatExtra }
}
