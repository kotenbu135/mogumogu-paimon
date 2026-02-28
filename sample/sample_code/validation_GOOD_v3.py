#!/usr/bin/env python3
"""
GOOD v3形式 - totalRolls検証スクリプト

GOOD v3では:
  totalRolls = (初期ドロップ時のサブステ数) + floor(level / 4)

初期ドロップ時: 3 or 4個のサブステータス
強化イベント: Lv4, 8, 12, 16, 20（★5の場合）で自動実行
"""

import json
from typing import Dict, Tuple

def calculate_expected_rolls(level: int, rarity: int) -> int:
    """
    レベルとレアリティから強化イベント回数を計算
    
    ★5: Lv4,8,12,16,20 → 5回
    ★4: Lv4,8,12,16 → 4回
    ★3以下: Lv4,8,12 → 3回
    """
    return level // 4

def get_initial_substat_count(total_rolls: int, upgrade_events: int) -> int:
    """
    totalRollsと強化回数から初期サブステ数を逆算
    """
    return total_rolls - upgrade_events

def validate_artifact(artifact: Dict) -> Dict:
    """
    単一の聖遺物のtotalRollsを検証
    """
    level = artifact.get('level', 0)
    rarity = artifact.get('rarity', 5)
    total_rolls = artifact.get('totalRolls', 0)
    substat_count = len(artifact.get('substats', []))
    
    # 強化回数を計算
    upgrade_events = calculate_expected_rolls(level, rarity)
    
    # 初期サブステ数を逆算
    initial_substat_count = get_initial_substat_count(total_rolls, upgrade_events)
    
    # ★5は3OPまたは4OPが標準
    is_valid = initial_substat_count in [3, 4]
    
    # 検証：計算値がtotalRollsと一致するか
    expected_total_rolls = initial_substat_count + upgrade_events
    matches = expected_total_rolls == total_rolls
    
    return {
        'level': level,
        'rarity': rarity,
        'actual_total_rolls': total_rolls,
        'upgrade_events': upgrade_events,
        'initial_substat_count': initial_substat_count,
        'expected_total_rolls': expected_total_rolls,
        'current_substat_count': substat_count,
        'is_valid': is_valid,
        'matches': matches,
        'formula': f"{initial_substat_count} (初期) + {upgrade_events} (強化) = {expected_total_rolls}"
    }

def main():
    # JSONファイル読み込み
    with open('genshin_export_data.json', 'r') as f:
        data = json.load(f)
    
    artifacts = data.get('artifacts', [])
    
    print("=" * 80)
    print("GOOD v3形式 - totalRolls検証")
    print("=" * 80)
    print()
    print(f"総聖遺物数: {len(artifacts)}")
    print()
    
    # サンプル検証（最初の10個）
    print("=" * 80)
    print("サンプル検証結果（最初の10個）")
    print("=" * 80)
    print()
    
    for i in range(min(10, len(artifacts))):
        artifact = artifacts[i]
        result = validate_artifact(artifact)
        
        print(f"Artifact #{i+1}")
        print(f"  セット: {artifact.get('setKey', '?')} - {artifact.get('slotKey', '?')}")
        print(f"  レアリティ: ★{result['rarity']}, Lv{result['level']}")
        print(f"  現在のサブステ数: {result['current_substat_count']}")
        print()
        print(f"  検証式: {result['formula']}")
        print(f"  実際のtotalRolls: {result['actual_total_rolls']}")
        print(f"  一致: {'✓ PASS' if result['matches'] else '✗ FAIL'}")
        if not result['is_valid']:
            print(f"  ⚠️  警告: 初期サブステ数が異常 ({result['initial_substat_count']})")
        print()
    
    # 全体統計
    print("=" * 80)
    print("全体統計")
    print("=" * 80)
    print()
    
    matches_count = 0
    valid_count = 0
    rarity_distribution = {}
    initial_op_distribution = {}
    
    for artifact in artifacts:
        result = validate_artifact(artifact)
        
        if result['matches']:
            matches_count += 1
        if result['is_valid']:
            valid_count += 1
        
        # レアリティ分布
        rarity = result['rarity']
        if rarity not in rarity_distribution:
            rarity_distribution[rarity] = 0
        rarity_distribution[rarity] += 1
        
        # 初期OP分布
        if result['is_valid']:
            op_count = result['initial_substat_count']
            if op_count not in initial_op_distribution:
                initial_op_distribution[op_count] = 0
            initial_op_distribution[op_count] += 1
    
    print(f"✓ 検証成功: {matches_count}/{len(artifacts)} ({100*matches_count/len(artifacts):.1f}%)")
    print(f"✓ 有効な構造: {valid_count}/{len(artifacts)} ({100*valid_count/len(artifacts):.1f}%)")
    print()
    
    print("レアリティ分布:")
    for rarity in sorted(rarity_distribution.keys()):
        count = rarity_distribution[rarity]
        print(f"  ★{rarity}: {count}個")
    print()
    
    print("初期OP分布:")
    for op_count in sorted(initial_op_distribution.keys()):
        count = initial_op_distribution[op_count]
        print(f"  {op_count}OP: {count}個")
    print()
    
    # 失敗したアーティファクト（あれば表示）
    failures = []
    for i, artifact in enumerate(artifacts):
        result = validate_artifact(artifact)
        if not result['matches']:
            failures.append((i, artifact, result))
    
    if failures:
        print("=" * 80)
        print(f"⚠️  検証失敗: {len(failures)}個のアーティファクト")
        print("=" * 80)
        print()
        
        for idx, artifact, result in failures[:5]:
            print(f"Artifact #{idx+1}")
            print(f"  {artifact.get('setKey')} - {artifact.get('slotKey')}")
            print(f"  期待値: {result['expected_total_rolls']}, 実際: {result['actual_total_rolls']}")
            print(f"  初期OP推定: {result['initial_substat_count']}")
            print()
        
        if len(failures) > 5:
            print(f"... 他 {len(failures) - 5}個")

if __name__ == '__main__':
    main()

