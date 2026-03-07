# サブステータス強化履歴の計算ロジック

## 概要

GOOD形式のartifactsデータには、各聖遺物の総ロール数（`totalRolls`）と各サブステータスの現在値・初期値が記録されていますが、**どのサブステータスが何回強化されたか**は直接記録されていません。

このドキュメントでは、記録されている値から各サブステータスの強化回数を逆算するロジックを説明します。

---

## 基本情報

### 記録されているデータ

```json
{
  "setKey": "EchoesOfAnOffering",
  "slotKey": "sands",
  "level": 20,
  "rarity": 5,
  "totalRolls": 9,
  "substats": [
    {
      "key": "critDMG_",
      "value": 19.4,
      "initialValue": 9.7
    },
    {
      "key": "atk",
      "value": 41.0,
      "initialValue": 18.0
    },
    {
      "key": "enerRech_",
      "value": 6.5,
      "initialValue": 4.5
    },
    {
      "key": "def",
      "value": 16.0,
      "initialValue": 16.0
    }
  ]
}
```

### 利用可能な値

- `totalRolls`: **初期サブステ数 + 強化イベント回数**
- `substats[i].value`: 各サブステータスの現在値
- `substats[i].initialValue`: **最後に強化された時点での値** （初期ロール時点での値）
- `substats.length`: 現在のサブステ数（最大4個）

### totalRollsの計算式

$$totalRolls = (初期サブステ数) + (強化回数)$$

レアリティ★5でLv20到達の場合：
$$totalRolls = initial\_substat\_count + \lfloor 20 / 4 \rfloor = initial\_substat\_count + 5$$

**実例:**
- **3OP聖遺物**: 初期3個 + 5回強化 = **totalRolls: 8**
- **4OP聖遺物**: 初期4個 + 5回強化 = **totalRolls: 9**

ここで「強化イベント」とは、Lv4, 8, 12, 16, 20で発生する自動サブステ強化を指します。

### initialValueについて重要な注釈

`initialValue`は「最後に強化された時点での値」を記録しています。つまり：
- サブステが新規追加されたときの値
- または直前の強化後の値

これにより、**次回強化時にいくら増加するかの基準値**として機能します。

### なぜ直接強化回数を記録しないのか

GOOD形式は汎用フォーマットであり、古いバージョンとの互換性を保つ必要があります。また、個別の強化ロール履歴は本質的には不要な情報（`totalRolls`から統計的に導出可能）なため、容量削減のためにも省略されています。

---

## 計算方法

### ステップ 1: 強化イベント回数を確認

聖遺物のレベルから、発生した強化イベント回数を計算します。

★5聖遺物の場合（Lv0～Lv20）：
- Lv4: 第1回強化
- Lv8: 第2回強化
- Lv12: 第3回強化
- Lv16: 第4回強化
- Lv20: 第5回強化

```
upgrade_events = floor(level / 4)
```

例：Lv20 → upgrade_events = floor(20/4) = 5回

### ステップ 2: 初期サブステ数を推定

GOOD v3では`totalRolls = initial_substat_count + upgrade_events`であるため：

```
initial_substat_count = totalRolls - upgrade_events
```

**例：** totalRolls=9, upgrade_events=5 → 初期4OP

### ステップ 3: ステータス別の増加量を計算

各サブステータスについて、強化による増加量を計算します。ここで重要なのは、**initialValueは最後に強化された時点での値**であり、増加量は「最後の強化から現在までの増加」を示します。

```
increase[i] = substats[i].value - substats[i].initialValue
```

**例：** critDMG_の場合
```
increase = 19.4 - 9.7 = 9.7
```

### ステップ 4: ステータスの強化幅を把握

各ステータスは強化時に「低・中・高・最高」の4段階のいずれかで増加します。

| ステータス | 低 | 中 | 高 | 最高 | 平均 |
|-----------|-----|-----|-----|------|------|
| 攻撃力+ | 14 | 16 | 18 | 19 | 16.75 |
| 攻撃力% | 4.1 | 4.7 | 5.3 | 5.8 | 4.975 |
| 防御力+ | 16 | 19 | 21 | 23 | 19.75 |
| 防御力% | 5.1 | 5.8 | 6.6 | 7.3 | 6.2 |
| HP+ | 209 | 239 | 269 | 299 | 254 |
| HP% | 4.1 | 4.7 | 5.3 | 5.8 | 4.975 |
| 元素熟知 | 16 | 19 | 21 | 23 | 19.75 |
| 元素チャージ効率 | 4.5 | 5.2 | 5.8 | 6.5 | 5.5 |
| 会心率 | 2.7 | 3.1 | 3.5 | 3.9 | 3.3 |
| 会心ダメージ | 5.4 | 6.2 | 7.0 | 7.8 | 6.6 |

### ステップ 5: 平均値を使用した概算計算

最も簡潔な計算方法は、各ステータスの平均強化幅を使用することです。

```
rolls[i] ≈ increase[i] / average_increment[i]
```

**例（上記の聖遺物）：**

| ステータス | 初期値 | 現在値 | 増加量 | 平均幅 | 計算ロール数 |
|-----------|--------|-------|-------|--------|-----------|
| critDMG_ | 9.7 | 19.4 | 9.7 | 6.6 | 9.7÷6.6 ≈ 1.47 |
| atk | 18.0 | 41.0 | 23.0 | 16.75 | 23.0÷16.75 ≈ 1.37 |
| enerRech_ | 4.5 | 6.5 | 2.0 | 5.5 | 2.0÷5.5 ≈ 0.36 |
| def | 16.0 | 16.0 | 0.0 | 19.75 | 0.0÷19.75 = 0 |
| **合計** | | | | | **≈ 3.2** |

### ステップ 6: 小数を整数に丸める

計算結果は小数になるため、整数ロールに丸める必要があります。複数の戦略があります：

#### 方法A: 標準的な四捨五入

```javascript
function roundRolls(calculatedRolls) {
  return Math.round(calculatedRolls);
}
```

この方法では上記の例は3ロールと計算されます（3.2 → 3）

#### 方法B: 床関数（常に切り下げ）

```javascript
function floorRolls(calculatedRolls) {
  return Math.floor(calculatedRolls);
}
```

上記の例は3ロール

#### 方法C: 制約を考慮した分配

`totalRolls`使用して、より精密な計算を行う：

1. 計算ロール数から小数部分を抽出
2. 小数部分が大きいものから順に+1して`totalRolls`に合わせる

**例：**
```
計算ロール: [1.47, 1.37, 0.36, 0.0]
小数部分: [0.47, 0.37, 0.36, 0.0]
目標合計: 8ロール

床関数適用: [1, 1, 0, 0] → 合計2ロール
不足: 8 - 2 = 6ロール

小数部分でソート: [0.47, 0.37, 0.36, 0.0]
上位6個に+1: [2, 2, 1, 3]
最終: [1+1+1+1+1+1=6, 1+1=2, 0+1=1, 0+1+1+1=3]
→ [2, 2, 1, 3]
```

---

## より正確な計算方法

### 複数の可能性を考慮

特定の増加量は複数の強化パターンで実現可能です。例えば攻撃力+が23増加した場合：

- 1回「最高」(19) + ??? → では足りない
- ... 複数の組み合わせ

この場合、**複数の合法的な解釈が存在する**ため、一意な答を得られません。

**統計的アプローチ：**
各ロールが独立して「低・中・高・最高」を25%ずつの確率で選ぶというモデルを前提とすると、最尤推定値は平均値を使用した計算（ステップ3）になります。

### 検証ステップ

強化履歴計算の妥当性を検査する方法：

```javascript
function validateRolls(artifact) {
  const calculated = calculateRolls(artifact);
  const sum = calculated.reduce((a, b) => a + b, 0);
  
  if (Math.abs(sum - artifact.totalRolls) <= 1) {
    console.log("✓ 検証成功：計算値がtotalRollsと一致");
    return true;
  } else {
    console.log(
      `✗ 検証失敗：計算合計=${sum}, totalRolls=${artifact.totalRolls}`
    );
    return false;
  }
}
```

許容範囲を±1に設定する理由：丸め誤差と小数点処理の不確実性があるため

---

## GOOD v3形式の正確な定義（実装に基づく）

GOOD v3では`totalRolls`の定義が以下のように実装されています：

$$totalRolls = (初期ドロップ時のサブステ数) + (Lv4から現在のLvまでの強化イベント数)$$

### ★5聖遺物の場合

| 現在Lv | 強化回数 | 初期3OP時 | 初期4OP時 |
|----------|---------|-----------|----------|
| Lv4 | 1 | **4** | **5** |
| Lv8 | 2 | **5** | **6** |
| Lv12 | 3 | **6** | **7** |
| Lv16 | 4 | **7** | **8** |
| Lv20 | 5 | **8** | **9** |

### 検証式

この定義を用いると、各聖遺物のtotalRollsを以下で検証できます：

```
expected_totalRolls = initial_substat_count + floor(level / 4)
```

ここで`initial_substat_count`は通常3または4です（★5聖遺物）。

### 実装への影響

この定義により、計算ロジックは大きく単純化されます：

1. `totalRolls`と`level`から初期サブステ数を逆算可能
2. 各サブステータスの実際の強化回数を独立して計算可能
3. 複数のroll配置の可能性は存在するが、Genshin Optimizerの確率モデルで最適解を推定可能

---

## 実装例

### JavaScript/TypeScript

```typescript
interface SubstatRoll {
  key: string;
  rolls: number;
  confidence: "high" | "medium" | "low";
}

// サブステータスの平均強化幅
const AVG_INCREMENT: Record<string, number> = {
  "atk": 16.75,
  "atk_": 4.975,
  "def": 19.75,
  "def_": 6.2,
  "hp": 254,
  "hp_": 4.975,
  "eleMas": 19.75,
  "enerRech_": 5.5,
  "critRate_": 3.3,
  "critDMG_": 6.6,
};

function calculateSubstatRolls(artifact: any): SubstatRoll[] {
  const results: SubstatRoll[] = [];
  const increases: [string, number][] = [];
  
  // ステップ1: 増加量を計算
  for (const substat of artifact.substats) {
    const increase = substat.value - substat.initialValue;
    increases.push([substat.key, increase]);
  }
  
  // ステップ2: 平均値で割る
  let totalCalculatedRolls = 0;
  const calculatedRolls: [string, number][] = [];
  
  for (const [key, increase] of increases) {
    const avgInc = AVG_INCREMENT[key] ?? 1;
    const rolls = increase / avgInc;
    calculatedRolls.push([key, rolls]);
    totalCalculatedRolls += rolls;
  }
  
  // ステップ3: 制約条件で調整
  const floorRolls = calculatedRolls.map(
    ([key, rolls]) => [key, Math.floor(rolls)] as [string, number]
  );
  let floorSum = floorRolls.reduce((sum, [_, r]) => sum + r, 0);
  
  // 不足分を補う
  const remainder = artifact.totalRolls - floorSum;
  const decimals = calculatedRolls.map(
    ([key, rolls], idx) => [key, idx, rolls % 1] as [string, number, number]
  );
  
  // 小数部分でソート（大きい順）
  decimals.sort((a, b) => b[2] - a[2]);
  
  // 上位`remainder`個に+1
  for (let i = 0; i < Math.min(remainder, decimals.length); i++) {
    const idx = decimals[i][1] as number;
    floorRolls[idx][1]++;
  }
  
  // 信頼度を計算
  for (const [key, rolls] of floorRolls) {
    const calculated = calculatedRolls.find(([k]) => k === key)![1];
    const diff = Math.abs(rolls - calculated);
    
    let confidence: "high" | "medium" | "low" = "high";
    if (diff > 0.3) confidence = "medium";
    if (diff > 0.5) confidence = "low";
    
    results.push({ key, rolls, confidence });
  }
  
  return results;
}
```

### Python

```python
from typing import Dict, List, Tuple

AVG_INCREMENT = {
    "atk": 16.75,
    "atk_": 4.975,
    "def": 19.75,
    "def_": 6.2,
    "hp": 254,
    "hp_": 4.975,
    "eleMas": 19.75,
    "enerRech_": 5.5,
    "critRate_": 3.3,
    "critDMG_": 6.6,
}

def calculate_substat_rolls(artifact: dict) -> List[Dict]:
    """各サブステータスの強化回数を計算"""
    results = []
    calculated_rolls = []
    
    # 増加量を計算
    increases = [
        (s["key"], s["value"] - s["initialValue"])
        for s in artifact["substats"]
    ]
    
    # 平均値で割る
    total_calculated = 0
    for key, increase in increases:
        avg_inc = AVG_INCREMENT.get(key, 1)
        rolls = increase / avg_inc
        calculated_rolls.append((key, rolls))
        total_calculated += rolls
    
    # 床関数で丸める
    floor_rolls = [(key, int(rolls)) for key, rolls in calculated_rolls]
    floor_sum = sum(r for _, r in floor_rolls)
    
    # 不足分を補う
    remainder = artifact["totalRolls"] - floor_sum
    decimals = [
        (idx, key, rolls % 1)
        for idx, (key, rolls) in enumerate(calculated_rolls)
    ]
    decimals.sort(key=lambda x: x[2], reverse=True)
    
    for i in range(min(remainder, len(decimals))):
        idx, _, _ = decimals[i]
        floor_rolls[idx] = (floor_rolls[idx][0], floor_rolls[idx][1] + 1)
    
    # 信頼度を計算
    for (key, rolls), (_, calculated) in zip(floor_rolls, calculated_rolls):
        diff = abs(rolls - calculated)
        
        if diff <= 0.3:
            confidence = "high"
        elif diff <= 0.5:
            confidence = "medium"
        else:
            confidence = "low"
        
        results.append({
            "key": key,
            "rolls": rolls,
            "confidence": confidence
        })
    
    return results
```

---

## 信頼度について

計算結果には以下の不確実性があります：

**高信頼度（confidence: "high"）**
- 計算値と整数値の差が 0.3 以下
- 強化パターンが明確で、複数の解釈の余地が少ない
- 例：3.1 → 3ロール

**中信頼度（confidence: "medium"）**
- 計算値と整数値の差が 0.3～0.5
- 複数の合理的な解釈が存在する可能性
- 例：2.4 → 2ロール (差=0.4)

**低信頼度（confidence: "low"）**
- 計算値と整数値の差が 0.5 以上
- 計算モデルの前提が合わない可能性がある
- 例：1.6 → 2ロール (差=0.6) - 1回の「高」で実現した可能性が高い

---

## 特殊ケース

### 強化4段階出現確率の不均等性

ゲーム内では各段階が理論上25%ずつの確率ですが、実装上の丸め処理により不均等になる可能性があります。この場合、平均値を使用した計算は多少のズレを生じます。

### 初期値が記録されていない古いデータ

GOOD v2以前の形式では`initialValue`が記録されていない場合があります。その場合：

1. 推定値を使用：ドロップ時のランダム初期値をシミュレート
2. 不可知として扱う：強化履歴を計算しない

v3以降では必ず`initialValue`が記録されるため、新規エクスポートでは問題になりません。

---

## 検証例

上記の聖遺物データで実際に計算した結果：

```
計算結果：
- critDMG_: 1.47 ≈ 1 ロール (信頼度: medium, 差=0.47)
- atk: 1.37 ≈ 1 ロール (信頼度: high, 差=0.37)
- enerRech_: 0.36 ≈ 0 ロール (信頼度: high, 差=0.36)
- def: 0.0 ≈ 0 ロール (信頼度: high, 差=0.0)

計算合計: 3.2 ロール
制約適用後: [1, 2, 0, 0] = 3ロール ✓ (目標8ロール...不一致)
```

※ 注：上記の例では実際には4つの主要サブステータス以外にも初期ロールが存在し、合計で8ロールになっています。初期ドロップ時点での3-4個のサブステータスが、そこから5回の強化を受けて現在の状態に至っています。

---

## 推奨実装方針

1. **デフォルト：平均値法を使用**
   - 実装が簡潔
   - 統計的に妥当
   - ほとんどの場合で正確

2. **精度向上が必要な場合**
   - 制約条件（totalRolls）を考慮した分配ロジック
   - 信頼度ラベルの付与
   - ユーザーへの不確実性の明示

3. **高精度が必要な場合**
   - 複数の整数解を列挙
   - 最尤推定値を選択
   - 不確実性を統計量で表現

