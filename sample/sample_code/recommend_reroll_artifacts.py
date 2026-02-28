#!/usr/bin/env python3
"""
聖啓の塵による再構築おすすめ聖遺物の分析・スコアリング

再構築におすすめな聖遺物の特徴：
1. 初期4OP（4つのサブ効果を持つ）
2. 会心率 & 会心ダメージが両方ある
3. 初期値の品質が良い（初期値の合計が高い）
4. 強化の分配が悪い（会心関連の強化が少ない）
5. 強化の伸び幅が悪い（低・中のランクが多い）

スコアリングロジック：
- 初期OP数: 4OP = 基本点
- スコア対象オプション: 会心率と会心ダメージが両方 = +40
- 初期値品質: initialValueの合計が高い = +30
- 強化不足（会心）: 会心関連の強化が少ない = +20
- 強化品質: 低・中のランクが多い = +10
"""

import json
from typing import Dict, List, Tuple
from dataclasses import dataclass

# Artifact Set キーと日本語名のマッピング
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

# Slot キーと日本語名のマッピング
SLOT_NAMES = {
    "flower": "生の花",
    "plume": "羽毛",
    "sands": "砂時計",
    "goblet": "杯",
    "circlet": "冠",
}

# サブ効果の平均強化幅（ランク別）
SUBSTAT_RANKS = {
    "hp": [209, 239, 269, 299],
    "atk": [14, 16, 18, 19],
    "def": [16, 19, 21, 23],
    "hp_": [4.1, 4.7, 5.3, 5.8],  # %表記
    "atk_": [4.1, 4.7, 5.3, 5.8],  # %表記
    "def_": [5.1, 5.8, 6.6, 7.3],  # %表記
    "enerRech_": [4.5, 5.2, 5.8, 6.5],  # %表記
    "elemMas": [16, 19, 21, 23],
    "critRate_": [2.7, 3.1, 3.5, 3.9],  # %表記
    "critDMG_": [5.4, 6.2, 7.0, 7.8],  # %表記
}

# 平均強化幅（スコア計算用）
AVG_INCREMENT = {
    "hp": 254,
    "atk": 16.75,
    "def": 19.75,
    "hp_": 4.975,
    "atk_": 4.975,
    "def_": 6.2,
    "enerRech_": 5.5,
    "elemMas": 19.75,
    "critRate_": 3.3,
    "critDMG_": 6.6,
}

@dataclass
class RerollScore:
    """再構築スコア"""
    artifact_idx: int
    set_key: str
    slot_key: str
    level: int
    initial_op: int
    
    # スコア要素
    has_both_crits: bool  # 会心率と会心ダメージが両方
    initial_quality: float  # 初期値の合計
    crit_boost_ratio: float  # 会心関連の強化率（低いほどおすすめ）
    low_mid_ratio: float  # 低・中ランクの強化数（高いほどおすすめ）
    
    # 最終スコア
    total_score: float
    
    def __str__(self) -> str:
        # 日本語に変換
        set_name = ARTIFACT_SET_NAMES.get(self.set_key, self.set_key)
        slot_name = SLOT_NAMES.get(self.slot_key, self.slot_key)
        
        score_breakdown = []
        if self.has_both_crits:
            score_breakdown.append("会心率+会心ダメージ")
        if self.initial_quality > 25:
            score_breakdown.append(f"初期値品質良({self.initial_quality:.1f})")
        if self.crit_boost_ratio < 0.3:
            score_breakdown.append(f"会心強化不足({self.crit_boost_ratio:.1%})")
        if self.low_mid_ratio > 0.5:
            score_breakdown.append(f"低・中ランク多({self.low_mid_ratio:.1%})")
        
        return f"#{self.artifact_idx+1} | {set_name} - {slot_name} | Lv{self.level} | {self.initial_op}OP | スコア: {self.total_score:.1f} | 理由: {', '.join(score_breakdown)}"

def estimate_rank(key: str, increase: float) -> int:
    """
    増加値からランクを推定（0=低, 1=中, 2=高, 3=最高）
    
    Returns:
        [0, 1, 2, 3] 推定ランク
    """
    if key not in SUBSTAT_RANKS:
        return 1  # 不明な場合は中
    
    ranks = SUBSTAT_RANKS[key]
    
    # 各ランクに最も近い値を見つける
    min_diff = float('inf')
    best_rank = 1
    
    for rank, value in enumerate(ranks):
        diff = abs(increase - value)
        if diff < min_diff:
            min_diff = diff
            best_rank = rank
    
    return best_rank

def calculate_reroll_score(artifact: Dict, idx: int) -> RerollScore:
    """
    聖遺物の再構築スコアを計算
    """
    set_key = artifact.get('setKey', '?')
    slot_key = artifact.get('slotKey', '?')
    level = artifact.get('level', 0)
    rarity = artifact.get('rarity', 5)
    substats = artifact.get('substats', [])
    
    # 初期OP数を逆算
    total_rolls = artifact.get('totalRolls', 0)
    upgrade_events = level // 4
    initial_op = total_rolls - upgrade_events
    
    # スコア計算
    score = 0.0
    details = {}
    
    # 1. 初期4OP
    is_4op = initial_op == 4
    if is_4op:
        score += 50  # 基本点
    details['is_4op'] = is_4op
    
    # スコア関連オプション（会心率と会心ダメージ）を検査
    substat_keys = [s['key'] for s in substats]
    has_crit_rate = 'critRate_' in substat_keys
    has_crit_dmg = 'critDMG_' in substat_keys
    has_both_crits = has_crit_rate and has_crit_dmg
    
    if has_both_crits:
        score += 40  # スコア対象が豊富
    details['has_both_crits'] = has_both_crits
    
    # 2. 初期値の品質
    initial_quality = 0.0
    for substat in substats:
        initial_quality += substat.get('initialValue', 0)
    
    # 初期値が高いほどおすすめ（20以上で+30点）
    if initial_quality > 20:
        quality_bonus = min(30, (initial_quality - 20) * 1.5)
        score += quality_bonus
    details['initial_quality'] = initial_quality
    
    # 3. 強化の分配（会心関連が少ない方がおすすめ）
    crit_boost = 0.0  # 会心関連の強化量
    total_boost = 0.0  # 全体の強化量
    
    for substat in substats:
        key = substat['key']
        value = substat['value']
        initial_value = substat['initialValue']
        increase = value - initial_value
        
        if key in AVG_INCREMENT:
            avg_inc = AVG_INCREMENT[key]
            boost_count = increase / avg_inc
            
            total_boost += boost_count
            
            if key in ['critRate_', 'critDMG_']:
                crit_boost += boost_count
    
    crit_boost_ratio = crit_boost / total_boost if total_boost > 0 else 0
    
    # 会心関連の強化が少ない（40%以下） = +20点
    if crit_boost_ratio < 0.4:
        score += 20 * (1 - crit_boost_ratio / 0.4)
    details['crit_boost_ratio'] = crit_boost_ratio
    
    # 4. 強化の伸び幅が悪い（低・中が多い）
    low_mid_count = 0
    high_count = 0
    
    for substat in substats:
        key = substat['key']
        initial = substat['initialValue']
        value = substat['value']
        
        # 初期値がある場合のみ（初期値がない = 後から追加された = フリーロル）
        if initial > 0:
            # 各回の強化幅を推定
            increase = value - initial
            if increase > 0 and key in AVG_INCREMENT:
                rank = estimate_rank(key, increase / (upgrade_events if upgrade_events > 0 else 1))
                
                if rank in [0, 1]:  # 低・中
                    low_mid_count += 1
                elif rank == 2:  # 高
                    high_count += 1
    
    total_initial_substats = sum(1 for s in substats if s.get('initialValue', 0) > 0)
    low_mid_ratio = low_mid_count / total_initial_substats if total_initial_substats > 0 else 0
    
    # 低・中ランクが多い（50%以上） = +10点
    if low_mid_ratio > 0.5:
        score += 10 * min(1, low_mid_ratio)
    details['low_mid_ratio'] = low_mid_ratio
    
    return RerollScore(
        artifact_idx=idx,
        set_key=set_key,
        slot_key=slot_key,
        level=level,
        initial_op=initial_op,
        has_both_crits=has_both_crits,
        initial_quality=initial_quality,
        crit_boost_ratio=crit_boost_ratio,
        low_mid_ratio=low_mid_ratio,
        total_score=score,
    )

def main():
    # JSONファイル読み込み
    with open('genshin_export_2026-02-28_16-31.json', 'r') as f:
        data = json.load(f)
    
    artifacts = data.get('artifacts', [])
    
    print("=" * 100)
    print("聖啓の塵による再構築おすすめ聖遺物 TOP 10")
    print("=" * 100)
    print()
    
    # 全アーティファクトをスコア計算
    scores = []
    for idx, artifact in enumerate(artifacts):
        score = calculate_reroll_score(artifact, idx)
        # 初期4OPで最低限の品質を持つもののみ
        if score.initial_op == 4 and score.total_score > 20:
            scores.append(score)
    
    # スコアでソート（降順）
    scores.sort(key=lambda x: x.total_score, reverse=True)
    
    print(f"再構築ランク100以上: {len(scores)}個 / 総{len(artifacts)}個")
    print()
    
    # TOP 10を表示
    print("=" * 100)
    print("TOP 10")
    print("=" * 100)
    print()
    
    for rank, score in enumerate(scores[:10], 1):
        print(f"{rank:2d}. {score}")
        
        # サブステータス詳細を表示
        artifact = artifacts[score.artifact_idx]
        substats = artifact.get('substats', [])
        
        print("    サブステータス:")
        for substat in substats:
            key = substat['key']
            value = substat['value']
            initial_value = substat['initialValue']
            increase = value - initial_value
            
            # ステータスキーを日本語化（簡略版）
            stat_names = {
                'hp': 'HP',
                'atk': '攻撃力',
                'def': '防御力',
                'hp_': 'HP%',
                'atk_': '攻撃力%',
                'def_': '防御力%',
                'enerRech_': 'エネルギーチャージ%',
                'elemMas': '元素熟知',
                'critRate_': '会心率%',
                'critDMG_': '会心ダメージ%',
            }
            stat_name = stat_names.get(key, key)
            
            # 表示フォーマット: 初期値 → 現在値 (増加量)
            print(f"      {stat_name:15s}: {initial_value:7.1f} → {value:7.1f} (+{increase:6.1f})")
        
        print()
    
    # 統計情報
    print("=" * 100)
    print("統計情報")
    print("=" * 100)
    print()
    
    if scores:
        avg_score = sum(s.total_score for s in scores) / len(scores)
        max_score = max(s.total_score for s in scores)
        min_score = min(s.total_score for s in scores)
        
        print(f"最高スコア: {max_score:.1f}")
        print(f"最低スコア: {min_score:.1f}")
        print(f"平均スコア: {avg_score:.1f}")
        print()
        
        # 特性別の統計
        both_crits_count = sum(1 for s in scores if s.has_both_crits)
        print(f"会心率・会心ダメージ両方: {both_crits_count}/{len(scores)} ({100*both_crits_count/len(scores):.1f}%)")
        
        high_quality_count = sum(1 for s in scores if s.initial_quality > 25)
        print(f"初期値品質良好(25以上): {high_quality_count}/{len(scores)} ({100*high_quality_count/len(scores):.1f}%)")
        
        low_crit_boost_count = sum(1 for s in scores if s.crit_boost_ratio < 0.3)
        print(f"会心強化不足(30%未満): {low_crit_boost_count}/{len(scores)} ({100*low_crit_boost_count/len(scores):.1f}%)")
        
        many_low_mid_count = sum(1 for s in scores if s.low_mid_ratio > 0.5)
        print(f"低・中ランク多(50%以上): {many_low_mid_count}/{len(scores)} ({100*many_low_mid_count/len(scores):.1f}%)")

if __name__ == '__main__':
    main()
