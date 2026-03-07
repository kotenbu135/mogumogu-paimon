/** 日本語マッピング定数（score_artifacts.py より移植） */

import type { ArtifactSlotKey, ScoreTypeName, StatKey } from './types'

/** スコアタイプの選択肢一覧 */
export const SCORE_TYPE_OPTIONS: ScoreTypeName[] = [
  'CV', '攻撃型', 'HP型', '防御型', '熟知型', 'チャージ型', '最良型',
]

/** サブステータスのキー一覧 */
export const ALL_SUBSTAT_KEYS: StatKey[] = [
  'critRate_', 'critDMG_', 'atk_', 'hp_', 'def_',
  'eleMas', 'enerRech_', 'atk', 'hp', 'def',
]

export const ARTIFACT_SET_NAMES: Record<string, string> = {
  ADayCarvedFromRisingWinds: '風立ちの日',
  Adventurer: '冒険者',
  ArchaicPetra: '悠久の磐岩',
  AubadeOfMorningstarAndMoon: '暁の星と月の歌',
  Berserker: '狂戦士',
  BlizzardStrayer: '氷風を彷徨う勇士',
  BloodstainedChivalry: '血染めの騎士道',
  BraveHeart: '勇士の心',
  CrimsonWitchOfFlames: '燃え盛る炎の魔女',
  DeepwoodMemories: '深林の記憶',
  DefendersWill: '守護の心',
  DesertPavilionChronicle: '砂上の楼閣の史話',
  EchoesOfAnOffering: '来歆の余響',
  EmblemOfSeveredFate: '絶縁の旗印',
  FinaleOfTheDeepGalleries: '深廊の終曲',
  FlowerOfParadiseLost: '楽園の絶花',
  FragmentOfHarmonicWhimsy: '諧律奇想の断章',
  Gambler: '博徒',
  GildedDreams: '金メッキの夢',
  GladiatorsFinale: '剣闘士のフィナーレ',
  GoldenTroupe: '黄金の劇団',
  HeartOfDepth: '沈淪の心',
  HuskOfOpulentDreams: '華館夢醒形骸記',
  Instructor: '教官',
  Lavawalker: '烈火を渡る賢者',
  LongNightsOath: '長き夜の誓い',
  LuckyDog: '幸運',
  MaidenBeloved: '愛される少女',
  MarechausseeHunter: 'ファントムハンター',
  MartialArtist: '武人',
  NightOfTheSkysUnveiling: '天穹の顕現せし夜',
  NighttimeWhispersInTheEchoingWoods: '残響の森で囁かれる夜話',
  NoblesseOblige: '旧貴族のしつけ',
  NymphsDream: '水仙の夢',
  ObsidianCodex: '黒曜の秘典',
  OceanHuedClam: '海染硨磲',
  PaleFlame: '蒼白の炎',
  PrayersForDestiny: '水祭りの人',
  PrayersForIllumination: '火祭りの人',
  PrayersForWisdom: '雷祭りの人',
  PrayersToSpringtime: '氷祭りの人',
  ResolutionOfSojourner: '旅人の心',
  RetracingBolide: '逆飛びの流星',
  Scholar: '学者',
  ScrollOfTheHeroOfCinderCity: '灰燼の都に立つ英雄の絵巻',
  ShimenawasReminiscence: '追憶のしめ縄',
  SilkenMoonsSerenade: '月を紡ぐ夜の歌',
  SongOfDaysPast: '在りし日の歌',
  TenacityOfTheMillelith: '千岩牢固',
  TheExile: '亡命者',
  ThunderingFury: '雷のような怒り',
  Thundersoother: '雷を鎮める尊者',
  TinyMiracle: '奇跡',
  TravelingDoctor: '医者',
  UnfinishedReverie: '遂げられなかった想い',
  VermillionHereafter: '辰砂往生録',
  ViridescentVenerer: '翠緑の影',
  VourukashasGlow: '花海甘露の光',
  WanderersTroupe: '大地を流浪する楽団',
}

/** キャラクター名の日本語マッピング（GOOD フォーマットキー → 表示名） */
export const CHARACTER_NAMES: Record<string, string> = {
  Aino: 'アイノ',
  Albedo: 'アルベド',
  Alhaitham: 'アルハイゼン',
  Aloy: 'アーロイ',
  Amber: 'アンバー',
  AratakiItto: '荒瀧一斗',
  Arlecchino: 'アルレッキーノ',
  Baizhu: '白朮',
  Barbara: 'バーバラ',
  Beidou: '北斗',
  Bennett: 'ベネット',
  Candace: 'キャンデス',
  Charlotte: 'シャルロット',
  Chasca: 'チャスカ',
  Chevreuse: 'シュヴルーズ',
  Chiori: '千織',
  Chongyun: '重雲',
  Citlali: 'シトラリ',
  Clorinde: 'クロリンド',
  Collei: 'コレイ',
  Columbina: 'コロンビーナ',
  Cyno: 'サイノ',
  Dahlia: 'ダリア',
  Dehya: 'ディシア',
  Diluc: 'ディルック',
  Diona: 'ディオナ',
  Dori: 'ドリー',
  Durin: 'デュリン',
  Emilie: 'エミリー',
  Escoffier: 'エスコフィエ',
  Eula: 'エウルア',
  Faruzan: 'ファルザン',
  Fischl: 'フィッシュル',
  Flins: 'フリンス',
  Freminet: 'フレミネ',
  Furina: 'フリーナ',
  Gaming: 'ガミング',
  Ganyu: '甘雨',
  Gorou: '五郎',
  HuTao: '胡桃',
  Iansan: 'イアンサン',
  Ifa: 'イファ',
  Illuga: 'イルガ',
  Ineffa: 'イネファ',
  Jahoda: 'ヤホダ',
  Jean: 'ジン',
  Kachina: 'カチナ',
  KaedeharaKazuha: '楓原万葉',
  Kaeya: 'カエヤ',
  KamisatoAyaka: '神里綾華',
  KamisatoAyato: '神里綾人',
  Kaveh: 'カーヴェ',
  Keqing: '刻晴',
  Kinich: 'キニチ',
  Kirara: 'きらら',
  Klee: 'クレー',
  KujouSara: '九条裟羅',
  KukiShinobu: '久岐忍',
  LanYan: '蘭砚',
  Lauma: 'ラウマ',
  Layla: 'レイラ',
  Lisa: 'リサ',
  Lynette: 'リネット',
  Lyney: 'リネ',
  Mavuika: 'マーヴィカ',
  Mika: 'ミカ',
  Mona: 'モナ',
  Mualani: 'ムアラニ',
  Nahida: 'ナヒーダ',
  Navia: 'ナヴィア',
  Nefer: 'ネフェル',
  Neuvillette: 'ヌヴィレット',
  Nilou: 'ニィロウ',
  Ningguang: '凝光',
  Noelle: 'ノエル',
  Ororon: 'オロロン',
  Qiqi: '七七',
  RaidenShogun: '雷電将軍',
  Razor: 'レザー',
  Rosaria: 'ロサリア',
  SangonomiyaKokomi: '珊瑚宮心海',
  Sayu: '早柚',
  Sethos: 'セトス',
  Shenhe: '申鶴',
  ShikanoinHeizou: '鹿野院平蔵',
  Sigewinne: 'シグウィン',
  Skirk: 'スカーク',
  Somnia: 'ソムニア',
  Sucrose: 'スクロース',
  Tartaglia: 'タルタリヤ',
  Thoma: 'トーマ',
  Tighnari: 'ティナリ',
  Traveler: '旅人',
  TravelerF: '旅人（女）',
  TravelerM: '旅人（男）',
  Varesa: 'ヴァレーザ',
  Varka: 'ヴァルカ',
  Venti: 'ウェンティ',
  Wanderer: '放浪者',
  Wriothesley: 'リオスリ',
  Xiangling: '香菱',
  Xianyun: '閑雲',
  Xiao: '魈',
  Xilonen: 'シロネン',
  Xingqiu: '行秋',
  Xinyan: '辛焱',
  YaeMiko: '八重神子',
  Yanfei: '煙緋',
  Yaoyao: '瑶瑶',
  Yelan: '夜蘭',
  Yoimiya: '宵宮',
  YumemizukiMizuki: '夢見月みずき',
  YunJin: '云堇',
  Zhongli: '鍾離',
  Zibai: '子白',
}

export const SLOT_NAMES: Record<ArtifactSlotKey, string> = {
  flower: '生の花',
  plume: '死の羽',
  sands: '時の砂',
  goblet: '空の杯',
  circlet: '理の冠',
}

export const STAT_NAMES: Record<StatKey, string> = {
  hp: 'HP',
  atk: '攻撃力',
  def: '防御力',
  hp_: 'HP%',
  atk_: '攻撃力%',
  def_: '防御力%',
  enerRech_: '元素チャージ効率',
  eleMas: '元素熟知',
  critRate_: '会心率',
  critDMG_: '会心ダメージ',
}

/** セットグループ定義（プルダウンの optgroup 用） */
export const ARTIFACT_SET_GROUPS: { label: string; keys: string[] }[] = [
  {
    label: 'メインアタッカー用(v4以降)',
    keys: [
      'ADayCarvedFromRisingWinds',
      'NightOfTheSkysUnveiling',
      'FinaleOfTheDeepGalleries',
      'ObsidianCodex',
      'LongNightsOath',
      'FragmentOfHarmonicWhimsy',
      'MarechausseeHunter',
    ],
  },
  {
    label: 'サブアタッカー用',
    keys: [
      'AubadeOfMorningstarAndMoon',
      'EmblemOfSeveredFate',
      'GildedDreams',
      'GoldenTroupe',
      'UnfinishedReverie',
    ],
  },
  {
    label: 'サポート用',
    keys: [
      'ArchaicPetra',
      'DeepwoodMemories',
      'MaidenBeloved',
      'NoblesseOblige',
      'OceanHuedClam',
      'ScrollOfTheHeroOfCinderCity',
      'SilkenMoonsSerenade',
      'SongOfDaysPast',
      'TenacityOfTheMillelith',
      'ViridescentVenerer',
      'VourukashasGlow',
    ],
  },
  {
    label: 'メインアタッカー用（v3以前）',
    keys: [
      'BlizzardStrayer',
      'BloodstainedChivalry',
      'CrimsonWitchOfFlames',
      'DesertPavilionChronicle',
      'EchoesOfAnOffering',
      'FlowerOfParadiseLost',
      'HeartOfDepth',
      'HuskOfOpulentDreams',
      'Lavawalker',
      'NighttimeWhispersInTheEchoingWoods',
      'NymphsDream',
      'PaleFlame',
      'RetracingBolide',
      'ShimenawasReminiscence',
      'ThunderingFury',
      'Thundersoother',
      'VermillionHereafter',
      'WanderersTroupe',
      'GladiatorsFinale',
    ],
  },
]

/** アップロードデータのセットキーをグループ化する */
export function groupSetOptions(
  availableKeys: string[],
): { label: string; keys: string[] }[] {
  const available = new Set(availableKeys)
  const used = new Set<string>()
  const groups: { label: string; keys: string[] }[] = []

  for (const group of ARTIFACT_SET_GROUPS) {
    const keys = group.keys.filter((k) => available.has(k))
    if (keys.length > 0) {
      groups.push({ label: group.label, keys })
      keys.forEach((k) => used.add(k))
    }
  }

  const others = availableKeys
    .filter((k) => !used.has(k))
    .sort((a, b) =>
      (ARTIFACT_SET_NAMES[a] ?? a).localeCompare(ARTIFACT_SET_NAMES[b] ?? b, 'ja'),
    )
  if (others.length > 0) {
    groups.push({ label: 'その他', keys: others })
  }

  return groups
}

/**
 * スコアタイプに対応したメインステキーのセット。
 * メインステがこのセットに含まれる場合、対応しない型のスコアを 0 にする。
 */
export const TYPED_MAIN_STATS = new Set<string>(['hp_', 'atk_', 'def_', 'eleMas', 'enerRech_'])

/** パーセント表記のサブステ */
export const PERCENT_STATS = new Set<StatKey>([
  'hp_',
  'atk_',
  'def_',
  'enerRech_',
  'critRate_',
  'critDMG_',
])

/** メインステータス表示名（サブステ外のキー含む） */
export const MAIN_STAT_NAMES: Record<string, string> = {
  ...STAT_NAMES,
  heal_: '治癒ボーナス',
  anemo_dmg_: '風元素ダメージ',
  cryo_dmg_: '氷元素ダメージ',
  dendro_dmg_: '草元素ダメージ',
  electro_dmg_: '雷元素ダメージ',
  geo_dmg_: '岩元素ダメージ',
  hydro_dmg_: '水元素ダメージ',
  pyro_dmg_: '炎元素ダメージ',
  physical_dmg_: '物理ダメージ',
}

/** レアリティ別最大強化レベル */
const MAX_LEVEL_BY_RARITY: Record<number, number> = {
  5: 20,
  4: 16,
  3: 12,
}

/**
 * 5星聖遺物HP(花)の各レベル値（Lv0-20）
 * 他の聖遺物ステータスの中間値計算に使用するスケール基準
 */
const HP5_LEVELS = [
  717, 919, 1120, 1321, 1523,
  1758, 1994, 2229, 2464, 2700,
  2891, 3083, 3275, 3467, 3659,
  3818, 3977, 4137, 4296, 4455, 4780,
]

/** メインステータスの最大値（レアリティ別） */
const MAIN_STAT_MAX: Record<number, Record<string, number>> = {
  5: {
    hp: 4780, atk: 311,
    hp_: 46.6, atk_: 46.6, def_: 58.3,
    enerRech_: 51.8, eleMas: 187,
    critRate_: 31.1, critDMG_: 62.2,
    heal_: 35.9,
    anemo_dmg_: 46.6, cryo_dmg_: 46.6, dendro_dmg_: 46.6,
    electro_dmg_: 46.6, geo_dmg_: 46.6, hydro_dmg_: 46.6,
    pyro_dmg_: 46.6, physical_dmg_: 58.3,
  },
  4: {
    hp: 3571, atk: 232,
    hp_: 35.2, atk_: 35.2, def_: 44.1,
    enerRech_: 39.0, eleMas: 141,
    critRate_: 23.4, critDMG_: 46.9,
    heal_: 27.2,
    anemo_dmg_: 35.2, cryo_dmg_: 35.2, dendro_dmg_: 35.2,
    electro_dmg_: 35.2, geo_dmg_: 35.2, hydro_dmg_: 35.2,
    pyro_dmg_: 35.2, physical_dmg_: 44.1,
  },
  3: {
    hp: 2342, atk: 152,
    hp_: 23.1, atk_: 23.1, def_: 28.8,
    enerRech_: 25.6, eleMas: 92,
    critRate_: 15.4, critDMG_: 30.8,
    heal_: 17.8,
    anemo_dmg_: 23.1, cryo_dmg_: 23.1, dendro_dmg_: 23.1,
    electro_dmg_: 23.1, geo_dmg_: 23.1, hydro_dmg_: 23.1,
    pyro_dmg_: 23.1, physical_dmg_: 28.8,
  },
}

/** パーセント表記のメインステータスキーセット */
const MAIN_STAT_PERCENT_KEYS = new Set([
  'hp_', 'atk_', 'def_', 'enerRech_', 'critRate_', 'critDMG_', 'heal_',
  'anemo_dmg_', 'cryo_dmg_', 'dendro_dmg_', 'electro_dmg_',
  'geo_dmg_', 'hydro_dmg_', 'pyro_dmg_', 'physical_dmg_',
])

/**
 * 指定レベル・レアリティ・メインステータスキーの表示用値を返す
 * @returns フォーマット済み文字列（%表記 or 整数）。未知キーは空文字
 */
export function getMainStatValue(level: number, rarity: number, key: string): string {
  const rarityTable = MAIN_STAT_MAX[rarity]
  if (!rarityTable) return ''
  const maxVal = rarityTable[key]
  if (maxVal === undefined) return ''

  // レアリティ別最大レベルで範囲チェック
  const maxLevel = MAX_LEVEL_BY_RARITY[rarity] ?? 20
  if (level < 0 || level > maxLevel) return ''

  // レアリティ別最大レベルで正規化し、5星HP基準のスケール比率を適用
  const normalizedLevel = Math.round(level * 20 / maxLevel)
  const scale = HP5_LEVELS[normalizedLevel] / 4780

  if (MAIN_STAT_PERCENT_KEYS.has(key)) {
    const val = Math.round(maxVal * scale * 10) / 10
    return `${val.toFixed(1)}%`
  } else {
    return String(Math.round(maxVal * scale))
  }
}
