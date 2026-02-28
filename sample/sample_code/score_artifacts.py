#!/usr/bin/env python3
"""
聖遺物スコアリング＆ロール分解

スコアリング基準:
  CVスコア  = 会心率×2 + 会心ダメージ
  HP型     = CV + HP%
  攻撃型   = CV + 攻撃力%
  防御型   = CV + 防御力%×0.8
  熟知型   = CV + 元素熟知×0.25
  チャージ型 = CV + 元素チャージ×0.9

CVスコアと最高スコアの両方を表示し、上位10件を出力する。
各サブステの伸び回数・個別ロール値も表示。
"""

import json
import math
import sys
from typing import Dict, List, Optional, Tuple

# ── 定数 ──────────────────────────────────────────────

ARTIFACT_SET_NAMES = {
    "ADayCarvedFromRisingWinds": "風立ちの日",
    "Adventurer": "冒険者",
    "ArchaicPetra": "悠久の磐岩",
    "AubadeOfMorningstarAndMoon": "暁の星と月の歌",
    "Berserker": "狂戦士",
    "BlizzardStrayer": "氷風を彷徨う勇士",
    "BloodstainedChivalry": "血染めの騎士道",
    "BraveHeart": "勇士の心",
    "CrimsonWitchOfFlames": "燃え盛る炎の魔女",
    "DeepwoodMemories": "深林の記憶",
    "DefendersWill": "守護の心",
    "DesertPavilionChronicle": "砂上の楼閣の史話",
    "EchoesOfAnOffering": "来歆の余響",
    "EmblemOfSeveredFate": "絶縁の旗印",
    "FinaleOfTheDeepGalleries": "深廊の終曲",
    "FlowerOfParadiseLost": "楽園の絶花",
    "FragmentOfHarmonicWhimsy": "諧律奇想の断章",
    "Gambler": "博徒",
    "GildedDreams": "金メッキの夢",
    "GladiatorsFinale": "剣闘士のフィナーレ",
    "GoldenTroupe": "黄金の劇団",
    "HeartOfDepth": "沈淪の心",
    "HuskOfOpulentDreams": "華館夢醒形骸記",
    "Instructor": "教官",
    "Lavawalker": "烈火を渡る賢者",
    "LongNightsOath": "長き夜の誓い",
    "LuckyDog": "幸運",
    "MaidenBeloved": "愛される少女",
    "MarechausseeHunter": "ファントムハンター",
    "MartialArtist": "武人",
    "NightOfTheSkysUnveiling": "天穹の顕現せし夜",
    "NighttimeWhispersInTheEchoingWoods": "残響の森で囁かれる夜話",
    "NoblesseOblige": "旧貴族のしつけ",
    "NymphsDream": "水仙の夢",
    "ObsidianCodex": "黒曜の秘典",
    "OceanHuedClam": "海染硨磲",
    "PaleFlame": "蒼白の炎",
    "PrayersForDestiny": "水祭りの人",
    "PrayersForIllumination": "火祭りの人",
    "PrayersForWisdom": "雷祭りの人",
    "PrayersToSpringtime": "氷祭りの人",
    "ResolutionOfSojourner": "旅人の心",
    "RetracingBolide": "逆飛びの流星",
    "Scholar": "学者",
    "ScrollOfTheHeroOfCinderCity": "灰燼の都に立つ英雄の絵巻",
    "ShimenawasReminiscence": "追憶のしめ縄",
    "SilkenMoonsSerenade": "月を紡ぐ夜の歌",
    "SongOfDaysPast": "在りし日の歌",
    "TenacityOfTheMillelith": "千岩牢固",
    "TheExile": "亡命者",
    "ThunderingFury": "雷のような怒り",
    "Thundersoother": "雷を鎮める尊者",
    "TinyMiracle": "奇跡",
    "TravelingDoctor": "医者",
    "UnfinishedReverie": "遂げられなかった想い",
    "VermillionHereafter": "辰砂往生録",
    "ViridescentVenerer": "翠緑の影",
    "VourukashasGlow": "花海甘露の光",
    "WanderersTroupe": "大地を流浪する楽団",
}

SLOT_NAMES = {
    "flower": "生の花",
    "plume": "死の羽",
    "sands": "時の砂",
    "goblet": "空の杯",
    "circlet": "理の冠",
}

STAT_NAMES = {
    "hp": "HP",
    "atk": "攻撃力",
    "def": "防御力",
    "hp_": "HP%",
    "atk_": "攻撃力%",
    "def_": "防御力%",
    "enerRech_": "元素チャージ効率",
    "eleMas": "元素熟知",
    "critRate_": "会心率",
    "critDMG_": "会心ダメージ",
}

# サブステの4段階ティア値（低/中/高/最高）
SUBSTAT_TIERS: Dict[str, List[float]] = {
    "hp":        [209, 239, 269, 299],
    "atk":       [14, 16, 18, 19],
    "def":       [16, 19, 21, 23],
    "hp_":       [4.1, 4.7, 5.3, 5.8],
    "atk_":      [4.1, 4.7, 5.3, 5.8],
    "def_":      [5.1, 5.8, 6.6, 7.3],
    "enerRech_": [4.5, 5.2, 5.8, 6.5],
    "eleMas":    [16, 19, 21, 23],
    "critRate_": [2.7, 3.1, 3.5, 3.9],
    "critDMG_":  [5.4, 6.2, 7.0, 7.8],
}

# 平均強化幅
AVG_INCREMENT: Dict[str, float] = {
    "hp": 254, "atk": 16.75, "def": 19.75,
    "hp_": 4.975, "atk_": 4.975, "def_": 6.2,
    "enerRech_": 5.5, "eleMas": 19.75,
    "critRate_": 3.3, "critDMG_": 6.6,
}

# パーセント表記のサブステ（表示時に % を付ける）
PERCENT_STATS = {"hp_", "atk_", "def_", "enerRech_", "critRate_", "critDMG_"}

# スコア種別の定義: (名前, サブステkey, 係数)
SCORE_TYPES = [
    ("HP型",     "hp_",      1.0),
    ("攻撃型",   "atk_",     1.0),
    ("防御型",   "def_",     0.8),
    ("熟知型",   "eleMas",   0.25),
    ("チャージ型", "enerRech_", 0.9),
]


# ── ロール分解 ───────────────────────────────────────

def _is_float_stat(key: str) -> bool:
    return key in PERCENT_STATS or key == "eleMas"


def _scale(key: str) -> int:
    """浮動小数点回避用のスケール係数"""
    if key in PERCENT_STATS:
        return 10
    return 1


def decompose_rolls(key: str, total_value: float, num_rolls: int) -> Optional[List[float]]:
    """total_value を num_rolls 個のティア値の和として分解する"""
    if key not in SUBSTAT_TIERS or num_rolls <= 0:
        return None

    tiers = SUBSTAT_TIERS[key]
    scale = _scale(key)
    target = round(total_value * scale)
    scaled_tiers = sorted(round(t * scale) for t in tiers)

    result: List[int] = []
    if _backtrack(scaled_tiers, target, num_rolls, 0, result):
        return [v / scale for v in result]
    # 誤差 ±1 で再試行
    for delta in [1, -1]:
        result = []
        if _backtrack(scaled_tiers, target + delta, num_rolls, 0, result):
            return [v / scale for v in result]
    return None


def _backtrack(tiers: List[int], target: int, remaining: int,
               min_idx: int, current: List[int]) -> bool:
    if remaining == 0:
        return target == 0
    if target < tiers[0] * remaining:
        return False
    if target > tiers[-1] * remaining:
        return False
    for i in range(min_idx, len(tiers)):
        current.append(tiers[i])
        if _backtrack(tiers, target - tiers[i], remaining - 1, i, current):
            return True
        current.pop()
    return False


# ── ロール数推定 ─────────────────────────────────────

def _roll_range(key: str, value: float) -> Tuple[int, int]:
    """サブステの値から可能なロール数の範囲を返す"""
    tiers = SUBSTAT_TIERS.get(key)
    if not tiers or value <= 0:
        return (1, 1)
    scale = _scale(key)
    sv = round(value * scale)
    t_min = round(min(tiers) * scale)
    t_max = round(max(tiers) * scale)
    lo = max(1, math.ceil(sv / t_max))
    hi = max(1, math.floor(sv / t_min))
    return (lo, hi)


def estimate_roll_counts(artifact: dict) -> List[int]:
    """各サブステの伸び回数を totalRolls 制約付きで推定する。
    ティア値の min/max から各サブステの取りうるロール数範囲を求め、
    合計が totalRolls になる組み合わせを探索する。"""
    substats = artifact.get("substats", [])
    total_rolls = artifact.get("totalRolls", 0)
    n = len(substats)

    ranges = [_roll_range(s["key"], s["value"]) for s in substats]

    # 探索で合計 = totalRolls となる分配を見つける
    result: List[int] = [0] * n

    def search(idx: int, remaining: int) -> bool:
        if idx == n:
            return remaining == 0
        lo, hi = ranges[idx]
        rest_min = sum(r[0] for r in ranges[idx + 1:])
        rest_max = sum(r[1] for r in ranges[idx + 1:])
        for r in range(lo, hi + 1):
            left = remaining - r
            if left < rest_min or left > rest_max:
                continue
            result[idx] = r
            if search(idx + 1, left):
                # 分解可能か検証
                return True
            result[idx] = 0
        return False

    if search(0, total_rolls):
        return result

    # フォールバック: 平均値ベースの推定
    raw = []
    for s in substats:
        avg = AVG_INCREMENT.get(s["key"], 1)
        raw.append(s["value"] / avg)
    floor_rolls = [max(1, math.floor(r)) for r in raw]
    remainder = total_rolls - sum(floor_rolls)
    if remainder > 0:
        frac = [(i, r - math.floor(r)) for i, r in enumerate(raw)]
        frac.sort(key=lambda x: x[1], reverse=True)
        for j in range(min(remainder, len(frac))):
            floor_rolls[frac[j][0]] += 1
    return floor_rolls


# ── スコア計算 ───────────────────────────────────────

def calculate_scores(artifact: dict) -> Tuple[float, float, str]:
    """CVスコアと最高スコア(型名付き)を返す"""
    substats = artifact.get("substats", [])
    sub_map: Dict[str, float] = {}
    for s in substats:
        sub_map[s["key"]] = s["value"]

    crit_rate = sub_map.get("critRate_", 0.0)
    crit_dmg = sub_map.get("critDMG_", 0.0)
    cv = crit_rate * 2 + crit_dmg

    best_score = cv
    best_name = "CVスコア"

    for name, key, coeff in SCORE_TYPES:
        score = cv + sub_map.get(key, 0.0) * coeff
        if score > best_score:
            best_score = score
            best_name = name

    return cv, best_score, best_name


# ── 表示 ─────────────────────────────────────────────

def format_artifact(rank: int, artifact: dict, cv: float, best_score: float,
                    best_name: str, roll_counts: List[int]) -> str:
    set_name = ARTIFACT_SET_NAMES.get(artifact["setKey"], artifact["setKey"])
    slot_name = SLOT_NAMES.get(artifact["slotKey"], artifact["slotKey"])
    location = artifact.get("location", "")
    level = artifact.get("level", 0)

    loc_str = f" | 装備: {location}" if location else " | 未装備"
    header = f"{rank:2d}. {set_name} - {slot_name} | Lv{level}{loc_str}"

    if best_name == "CVスコア":
        score_line = f"    CVスコア: {cv:.1f}"
    else:
        score_line = f"    CVスコア: {cv:.1f}  |  最高スコア: {best_score:.1f}（{best_name}）"

    lines = [header, score_line, "    " + "─" * 40]

    substats = artifact.get("substats", [])
    for i, s in enumerate(substats):
        key = s["key"]
        value = s["value"]
        stat_name = STAT_NAMES.get(key, key)
        num_rolls = roll_counts[i]
        pct = "%" if key in PERCENT_STATS else ""

        rolls = decompose_rolls(key, value, num_rolls)
        if rolls:
            roll_strs = [f"{v:g}" for v in rolls]
            roll_detail = f"（{num_rolls}回）" + " + ".join(roll_strs)
        else:
            roll_detail = f"（≈{num_rolls}回）"

        lines.append(f"    {stat_name:10s}：{value:>7g}{pct} {roll_detail}")

    return "\n".join(lines)


# ── メイン ───────────────────────────────────────────

def main():
    path = sys.argv[1] if len(sys.argv) > 1 else "genshin_export_data.json"
    with open(path, "r") as f:
        data = json.load(f)

    artifacts = data.get("artifacts", [])
    # ★5 のみ
    five_star = [a for a in artifacts if a.get("rarity") == 5]

    # スコア計算
    scored: List[Tuple[dict, float, float, str]] = []
    for a in five_star:
        cv, best, name = calculate_scores(a)
        scored.append((a, cv, best, name))

    # 最高スコア降順でソート
    scored.sort(key=lambda x: x[2], reverse=True)

    print("=" * 55)
    print("聖遺物スコアランキング TOP 10")
    print("=" * 55)
    print()

    for rank, (a, cv, best, name) in enumerate(scored[:10], 1):
        roll_counts = estimate_roll_counts(a)
        print(format_artifact(rank, a, cv, best, name, roll_counts))
        print()


if __name__ == "__main__":
    main()
