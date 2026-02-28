# GOOD形式 仕様書

## 概要

GOOD形式（**G**enshin **O**ptimizer **O**bject **D**ata）は、原神（Genshin Impact）のゲームデータを機械的に解析可能なJSON形式に変換したものです。異なるアプリケーション間でデータを交換するための標準化されたフォーマットであり、Genshin Optimizer v6.0.0以降で採用されています。

## ファイル構造

### ルートレベル

```json
{
  "format": "GOOD",
  "version": 6,
  "source": "Irminsul",
  "characters": [],
  "artifacts": [],
  "weapons": [],
  "materials": {}
}
```

| フィールド | 型 | 説明 | 必須 |
|-----------|-----|------|-----|
| `format` | string | フォーマット名（常に"GOOD"） | ✓ |
| `version` | number | GOODバージョン（v6から） | ✓ |
| `source` | string | データの出典/取得元（例："Irminsul", "Snap.genshin.hoyoverse.com"） | ✓ |
| `characters` | array | キャラクターデータの配列 | - |
| `artifacts` | array | 聖遺物データの配列 | - |
| `weapons` | array | 武器データの配列 | - |
| `materials` | object | 素材の保有数（v2以降） | - |

---

## キャラクター（Characters）

### 構造

```json
{
  "key": "Traveler",
  "level": 80,
  "constellation": 6,
  "ascension": 6,
  "talent": {
    "auto": 1,
    "skill": 5,
    "burst": 5
  }
}
```

### フィールド

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `key` | string | キャラクター識別子（例："Traveler", "Fischl", "Nahida"） |
| `level` | number | キャラクターレベル（1-90） |
| `constellation` | number | 天賦レベル（0-6） |
| `ascension` | number | 突破段階（0-6） |
| `talent.auto` | number | 通常攻撃レベル（1-10） |
| `talent.skill` | number | スキルレベル（1-10） |
| `talent.burst` | number | 必殺技レベル（1-10） |

---

## 聖遺物（Artifacts）

聖遺物データは各装備の詳細を記録します。

### 基本構造

```json
{
  "setKey": "Thundersoother",
  "slotKey": "goblet",
  "level": 20,
  "rarity": 5,
  "mainStatKey": "def_",
  "location": "Xilonen",
  "lock": true,
  "substats": [],
  "totalRolls": 8,
  "astralMark": false,
  "elixerCrafted": false,
  "unactivatedSubstats": []
}
```

### フィールド詳細

#### 基本情報

| フィールド | 型 | 説明 | 例 |
|-----------|-----|------|-----|
| `setKey` | string | 聖遺物セットの識別子 | "Thundersoother", "NoblesseOblige", "GladiatorsFinale" |
| `slotKey` | string | 聖遺物スロット（5種類） | "flower", "plume", "sands", "goblet", "circlet" |
| `level` | number | 強化レベル（0-20） | 20 |
| `rarity` | number | レアリティ（3-5） | 5 |
| `mainStatKey` | string | メインステータスの種類 | "def_", "electro_dmg_", "critRate_" |
| `location` | string | 装備中のキャラクター名（未装備は空文字） | "Xilonen", "" |
| `lock` | boolean | ロック状態（ロック中=true） | true |

#### サブステータス関連

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `substats` | array | サブステータス配列（最大4個） |
| `totalRolls` | number | サブステータスのロール総数（強化回数）（0-12） |
| `unactivatedSubstats` | array | 未アクティブなサブステータス |

#### 特殊フラグ

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `astralMark` | boolean | 星芒マークの有無（v4.0以降） |
| `elixerCrafted` | boolean | 魔導選別で強化されたか |

### サブステータス（Substat）

```json
{
  "key": "atk",
  "value": 18.0,
  "initialValue": 18.0
}
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `key` | string | ステータス種別 |
| `value` | number | 現在の値 |
| `initialValue` | number | 初期値（ロール前の値） |

#### ステータスキーの種類

**数値型ステータス：**
- `hp`, `atk`, `def`
- `enerRech_`, `elemMas`

**パーセント型ステータス（`_`で終わる）：**
- `hp_`, `atk_`, `def_`
- `critRate_`, `critDMG_`
- `heal_` （ヒーリングボーナス）
- `phys_dmg_` （物理ダメージボーナス）
- 属性ダメージ: `pyro_dmg_`, `hydro_dmg_`, `electro_dmg_`, `cryo_dmg_`, `anemo_dmg_`, `geo_dmg_`, `dendro_dmg_`

### セットキーの例

- `PrayersForIllumination`
- `VermillionHereafter`
- `EchoesOfAnOfferingFull`
- `GladiatorsFinale`
- `NoblesseOblige`
- `Thundersoother`
- `CrimsonWitchOfFlames`
- `BlizzardStrayer`

### スロットキーの詳細

| スロットキー | 説明 | 部位 |
|------------|------|------|
| `flower` | 生の花 | 花 |
| `plume` | 羽毛 | 羽毛（ATK）|
| `sands` | 砂時計 | 砂時計（ボーナス） |
| `goblet` | 杯 | 杯（ボーナス） |
| `circlet` | 冠 | 冠/王冠（ボーナス） |

---

## 武器（Weapons）

### 構造

```json
{
  "key": "CrescentPike",
  "level": 80,
  "ascension": 5,
  "refinement": 2,
  "location": "Xilonen",
  "lock": true
}
```

### フィールド

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `key` | string | 武器の識別子（例："CrescentPike", "SkywardSpine"） |
| `level` | number | 武器レベル（1-90） |
| `ascension` | number | 突破段階（0-6、80/90と80/80を区別するために使用） |
| `refinement` | number | 精錬ランク（1-5） |
| `location` | string | 装備中のキャラクター名（未装備は空文字`""`) |
| `lock` | boolean | ロック状態（ロック中=true） |

---

## 素材（Materials）

### 構造

```json
{
  "materials": {
    "mora": 1000000,
    "primogem": 500,
    "characters": 25,
    "commonTalentLevelUpMaterial_1": 100
  }
}
```

### 説明

bas素材フィールドは、プレイヤーが保有している各種素材の数量を記録します。キーは素材の識別子、値は保有数です。

---

## バージョン情報

### Version 6（現在）
Genshin Optimizer v6.0.0以降で採用
- 完全な武器データ対応
- 素材データ対応
- 改善されたメタデータ

### Version 3
- サブステータスの詳細情報（初期値の記録）
- 星芒マークヒント（astralMark）
- 魔導選別フラグ（elixerCrafted）
- 未アクティブサブステデータ

### Version 2
- 素材データサポート

### Version 1以前
- 基本的なキャラクターと聖遺物情報のみ

---

## 使用例

```json
{
  "format": "GOOD",
  "version": 3,
  "source": "Irminsul",
  "characters": [
    {
      "key": "Fischl",
      "level": 90,
      "constellation": 6,
      "ascension": 6,
      "talent": {
        "auto": 8,
        "skill": 9,
        "burst": 10
      }
    }
  ],
  "artifacts": [
    {
      "setKey": "EchoesOfAnOfferingFull",
      "slotKey": "sands",
      "level": 20,
      "rarity": 5,
      "mainStatKey": "atk_",
      "location": "Fischl",
      "lock": true,
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
          "initialValue": 4.9
        },
        {
          "key": "def",
          "value": 16.0,
          "initialValue": 16.0
        }
      ],
      "totalRolls": 8,
      "astralMark": false,
      "elixerCrafted": false,
      "unactivatedSubstats": []
    }
  ]
}
```

---

## 注意事項

1. **ロール数の計算**
   - `totalRolls`はサブステータスの強化回数の合計ですが、**どのサブステータスが何回強化されたかは直接記録されていません**
   - 各サブステータスの強化されたロール数は、`initialValue`と`value`の差分から逆算する必要があります
   - 詳細な計算ロジックは、[サブステータス強化履歴の計算ロジック](Substat_Rolls_Calculation.md) を参照してください
   - 丸め誤差や複数の可能な解釈があるため、計算結果には多少の不確実性があります

2. **キャラクター場所（location）**
   - 聖遺物が装備されていない場合は空文字`""`
   - 複数キャラクターに同時装備はサポートされていません

3. **パーセント値**
   - `_`で終わるキーはパーセント値です（小数表記）
   - 例：`9.3`は9.3%を意味します

4. **ロック状態**
   - ロック（保護）されている聖遺物は`"lock": true`
   - ゲーム内で削除操作から守られます

