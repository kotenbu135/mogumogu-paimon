# GOOD形式 聖遺物仕様書

## 概要

このドキュメントでは、GOOD形式における聖遺物（Artifact）データの詳細な仕様を説明します。

## 聖遺物データ構造

### 完全な例

```json
{
  "setKey": "Thundersoother",
  "slotKey": "goblet",
  "level": 20,
  "rarity": 5,
  "mainStatKey": "def_",
  "location": "Xilonen",
  "lock": true,
  "substats": [
    {
      "key": "atk",
      "value": 18.0,
      "initialValue": 18.0
    },
    {
      "key": "def",
      "value": 74.0,
      "initialValue": 21.0
    }
  ],
  "totalRolls": 8,
  "astralMark": false,
  "elixerCrafted": false,
  "unactivatedSubstats": []
}
```

---

## フィールド詳細説明

### 1. setKey（聖遺物セット）

聖遺物セットの一意な識別子です。ゲーム内での聖遺物セット名に対応します。

**形式:** camelCase（キャメルケース）

**説明:**
- 値はゲーム内の聖遺物セット毎に定義された定数です
- 詳細なセットキー一覧は、本ドキュメントの末尾「ArtifactSetKey 完全リスト」を参照してください

### 2. slotKey（聖遺物スロット）

聖遺物が装備されるスロット位置を指定します。5種類の固定値があります。

**有効な値：**

```
"flower"    // 生の花（HP固定）
"plume"     // 羽毛（ATK固定）
"sands"     // 砂時計（ボーナスステータス）
"goblet"    // 杯（ボーナスステータス）
"circlet"   // 冠（ボーナスステータス）
```

**各スロットのメインステータス：**

| スロット | デフォルト | 可能なメインステ |
|---------|-----------|-----------------|
| flower | HP | HP（固定） |
| plume | ATK | ATK（固定） |
| sands | DEF+ | DEF%, ATK%, HP%, ER, EM |
| goblet | 元素D+ | 元素Dあり、物理D, HP%, ATK%, DEF%, EM, ER |
| circlet | CR% | CR%, CD%, ヒーリング力, HP%, ATK%, DEF%, EM |

### 3. level（強化レベル）

聖遺物を強化した現在のレベルです。

**有効な値:** `0` ～ `20`
- `0`: 強化なし
- `20`: 最大強化
- 各4レベル強化でサブステータスが1個追加

**レベルとロール数の関係：**
- Lv 0-3: サブステータス3個（1ロール）
- Lv 4-7: サブステータス3個（2ロール）
- Lv 8-11: サブステータス3個（3ロール）
- Lv 12-15: サブステータス4個（4ロール）
- Lv 16-19: サブステータス4個（5ロール）
- Lv 20: サブステータス4個（6ロール）

### 4. rarity（レアリティ）

聖遺物のレアリティ（品質）ランクを示します。

**有効な値:** `1`, `2`, `3`, `4`, `5`
- `1-2`: 通常品（初期段階のみ）
- `3`: 3つ星（通常品）
- `4`: 4つ星（稀少品）
- `5`: 5つ星（最稀少品）

**注記：**
- ゲーム内実装では主に3-5が使用されます
- エンドゲームコンテンツでは5つ星推奨

### 5. mainStatKey（メインステータス）

聖遺物のメインステータスの種類を指定します。

**メインステータスキー一覧：**

| キー | 説明 | パーセンテージ | スロット |
|-----|------|--------------|--------|
| `hp` | HPの固定値 | いいえ | flower |
| `atk` | 攻撃ATKの固定値 | いいえ | plume |
| `hp_` | HP上昇% | はい | sands, goblet, circlet |
| `atk_` | ATK上昇% | はい | sands, goblet, circlet |
| `def_` | DEF上昇% | はい | sands, goblet, circlet |
| `enerRech_` | エネルギーチャージ% | はい | sands |
| `elemMas` | 元素熟知（固定値） | いいえ | sands |
| `pyro_dmg_` | 炎元素ダメージ% | はい | goblet |
| `hydro_dmg_` | 水元素ダメージ% | はい | goblet |
| `electro_dmg_` | 雷元素ダメージ% | はい | goblet |
| `cryo_dmg_` | 氷元素ダメージ% | はい | goblet |
| `anemo_dmg_` | 風元素ダメージ% | はい | goblet |
| `geo_dmg_` | 岩元素ダメージ% | はい | goblet |
| `dendro_dmg_` | 草元素ダメージ% | はい | goblet |
| `phys_dmg_` | 物理ダメージ% | はい | goblet |
| `critRate_` | 会心率% | はい | circlet |
| `critDMG_` | 会心ダメージ% | はい | circlet |
| `heal_` | ヒーリング力% | はい | circlet |

### 6. location（装備位置）

聖遺物が現在装備されているキャラクターの名前、または未装備を示します。

**形式:** 
- キャラクター装備時: `"Xilonen"`, `"Fischl"` など
- 未装備時: `""` （空文字列）

**重要な注意点：**
- 複数キャラクターへの同時装備はサポートされていません
- 値はゲーム内のキャラクター識別子と一致する必要があります

### 7. lock（ロック状態）

聖遺物が保護（ロック）されているかを示します。

**有効な値:** 
- `true`: ロック中（ゲーム内で削除/強化不可）
- `false`: ロック解除

**使用例：**
```json
"lock": true  // この聖遺物は保護されている
```

### 8. substats（サブステータス配列）

聖遺物に付与されたサブステータスの詳細情報です。最大4個まで。

**構造：**
```json
"substats": [
  {
    "key": "atk",
    "value": 18.0,
    "initialValue": 18.0
  },
  {
    "key": "def",
    "value": 74.0,
    "initialValue": 21.0
  },
  {
    "key": "enerRech_",
    "value": 9.1,
    "initialValue": 4.5
  },
  {
    "key": "critRate_",
    "value": 3.1,
    "initialValue": 3.1
  }
]
```

#### substat.key（サブステータスキー）

サブステータスの種類です。メインステータスと異なり、より多くの種類が可能です。

**有効なサブステータスキー：**

| キー | 説明 | パーセント | 推奨範囲 |
|-----|------|----------|---------|
| `hp` | HP(固定値) | いいえ | 209-239 |
| `atk` | ATK(固定値) | いいえ | 14-19 |
| `def` | DEF(固定値) | いいえ | 16-21 |
| `hp_` | HP上昇% | はい | 4.08-4.66 |
| `atk_` | ATK上昇% | はい | 4.08-4.66 |
| `def_` | DEF上昇% | はい | 5.1-5.83 |
| `enerRech_` | エネルギーチャージ% | はい | 4.53-5.18 |
| `elemMas` | 元素熟知(固定値) | いいえ | 16-19 |
| `critRate_` | 会心率% | はい | 2.72-3.11 |
| `critDMG_` | 会心ダメージ% | はい | 5.44-6.22 |

#### substat.value（現在値）

強化後の現在のサブステータス値です。

**例：**
- `18.0`: 攻撃力18ポイント
- `9.1`: エネルギーチャージ9.1%

#### substat.initialValue（初期値）

ゲーム内での初期サブステータス値です。強化前の値です。

**用途：** 
何回のロール強化が行われたかの計算に使用
```
ロール数 = (value - initialValue) / ロール時増加量
```

**例：**
- `initialValue: 21.0`, `value: 74.0` → Lv20で3回ロール強化されたことがわかる

### 9. totalRolls（ロール総数）

サブステータスが何回強化されたかを記録します。**初期ロールを含む総ロール数**です。

**有効な値:**
- `3-9` : 有効な5☆聖遺物の範囲
- レアリティ3-4☆はより低い値の場合もあります

**説明：**
- 初期ロール（Lv0での3つのサブステータス）を含む
- Lv4,8,12,16,20での強化による新規サブステ追加を含む
- 5☆聖遺物の場合、最小3ロール（強化なし）→最大9ロール（完全強化）

**例：**
```json
{
  "level": 20,
  "rarity": 5,
  "totalRolls": 8,
  "substats": [...]
}
```

### 10. astralMark（星芒マーク）

ゲーム内でお気に入り（星マーク）として設定されているかを示すフラグです。

**有効な値:** 
- `true`: お気に入り星マークが付与されている
- `false`: マークなし

**説明:**
- バージョン3.1で導入された機能
- ゲーム内では「お気に入り」として表示され、視覚的に識別可能
- Genshin Optimizerなどのツールでフィルタリングに使用可能
- 任意フィールド（オプション）

### 11. elixerCrafted（魔導選別フラグ）

聖遺物が「魔導選別」機能を使用して精製されたかを示します。

**有効な値:**
- `true`: 魔導選別機能で精製・強化された
- `false`: 通常の入手・強化

**説明:**
- バージョン4.0で導入された機能
- 魔導選別で精製された聖遺物は：
  - メインステータス + 最初の2つのサブステータスに2ロール追加保証
  - 確定したサブステータスを持つため、より予測可能
- 任意フィールド（オプション）

### 12. unactivatedSubstats（未アクティブサブステータス）

将来的に追加される可能性のあるサブステータスの予約リストです。

**形式：**
```json
"unactivatedSubstats": [
  {
    "key": "hp_",
    "initialValue": 4.08
  }
]
```

**説明：**
- Lv4,8,12,16,20でサブステータスが追加される際の候補
- 初期段階では非表示だったサブステが、強化時に「アクティブ化」される際に使用
- 通常は実装が限定的で、ほぼ空配列の場合が多い
- 任意フィールド（オプション）

---

## ステータスキーの完全リスト

### 固定値ステータス（パーセント記号なし）

- `hp`: HP補正値
- `atk`: 与ダメージ補正値
- `def`: 防御力補正値
- `elemMas`: 元素熟知

### パーセントステータス（`_`で終わる）

#### 割合増加系
- `hp_`: HP上昇%
- `atk_`: 攻撃力上昇%
- `def_`: 防御力上昇%

#### 会心系
- `critRate_`: 会心率%
- `critDMG_`: 会心ダメージ%

#### チャージ系
- `enerRech_`: エネルギーチャージ%

#### ダメージボーナス系
- `phys_dmg_`: 物理ダメージボーナス%
- `pyro_dmg_`: 炎元素ダメージボーナス%
- `hydro_dmg_`: 水元素ダメージボーナス%
- `electro_dmg_`: 雷元素ダメージボーナス%
- `cryo_dmg_`: 氷元素ダメージボーナス%
- `anemo_dmg_`: 風元素ダメージボーナス%
- `geo_dmg_`: 岩元素ダメージボーナス%
- `dendro_dmg_`: 草元素ダメージボーナス%

#### その他ボーナス
- `heal_`: ヒーリング力%

---

## データ形式の制約と検証ルール

### 型チェック

```
setKey: string (camelCase)
slotKey: enum ["flower", "plume", "sands", "goblet", "circlet"]
level: integer, 0 <= level <= 20
rarity: integer, rarity in [3, 4, 5]
mainStatKey: string (有効なメインステータス)
location: string (キャラクター名またはnull/"")
lock: boolean
substats: array, array.length <= 4
totalRolls: integer, 0 <= totalRolls <= 12
astralMark: boolean
elixerCrafted: boolean
unactivatedSubstats: array
```

### サブステータス検証

```javascript
substats.forEach(substat => {
  // キーは有効なサブステータスの中から
  // valueは非負の数値
  // initialValueはvalueより小さい（強化前の値）
  value >= initialValue
})
```

**重要な注釈**: GOOD形式は各聖遺物の`totalRolls`（合計強化回数）を記録しますが、どのサブステータスが何回強化されたかの詳細は記録されません。サブステータスの個別の強化回数を計算する必要がある場合は、[サブステータスロール計算ドキュメント](Substat_Rolls_Calculation.md)を参照してください。この計算により、各サブステータスの値から逆算して強化履歴を推測することができます。

### スロット別制約

#### flower と plume
- mainStatKey は固定値のみ（`hp`, `atk`）

#### sands
- mainStatKey は `hp_`, `atk_`, `def_`, `enerRech_`, `elemMas` のいずれか

#### goblet
- 元素ダメージボーナス、物理ダメージ、または汎用ステータス

#### circlet
- `critRate_`, `critDMG_`, `heal_`、または汎用ステータス

---

## 実装ガイドライン

### データの読み込み時

1. フォーマットバージョンを確認
2. 予期しないフィールドは無視
3. 必須フィールドが欠落している場合はエラーハンドリング

### データの保存時

1. すべての必須フィールドを含める
2. `substats` 配列の要素数を検証
3. `totalRolls` の値が妥当か確認

### 互換性

- Version 3への準拠を推奨
- 旧バージョンからの自動アップグレード機能を実装する場合がある

---

## 参考：サンプル聖遺物

### 完璧な聖遺物例

```json
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
```

### 未装備，未強化の聖遺物例

```json
{
  "setKey": "VermillionHereafter",
  "slotKey": "flower",
  "level": 0,
  "rarity": 5,
  "mainStatKey": "hp",
  "location": "",
  "lock": false,
  "substats": [
    {
      "key": "atk_",
      "value": 5.3,
      "initialValue": 5.3
    },
    {
      "key": "elemMas",
      "value": 19,
      "initialValue": 19
    },
    {
      "key": "critRate_",
      "value": 3.1,
      "initialValue": 3.1
    }
  ],
  "totalRolls": 0,
  "astralMark": false,
  "elixerCrafted": false,
  "unactivatedSubstats": []
}
```

---

## ArtifactSetKey 完全リスト

聖遺物セットの全種類を記載します。`setKey`には以下の値を指定してください（camelCase）。

```
ADayCarvedFromRisingWinds         // 風立ちの日
Adventurer                        // 冒険者
ArchaicPetra                      // 悠久の磐岩
AubadeOfMorningstarAndMoon        // 暁の星と月の歌
Berserker                         // 狂戦士
BlizzardStrayer                   // 氷風を彷徨う勇士
BloodstainedChivalry              // 血染めの騎士道
BraveHeart                        // 勇士の心
CrimsonWitchOfFlames              // 燃え盛る炎の魔女
DeepwoodMemories                  // 深林の記憶
DefendersWill                     // 守護の心
DesertPavilionChronicle           // 砂上の楼閣の史話
EchoesOfAnOffering                // 来歆の余響
EmblemOfSeveredFate               // 絶縁の旗印
FinaleOfTheDeepGalleries          // 深廊の終曲
FlowerOfParadiseLost              // 楽園の絶花
FragmentOfHarmonicWhimsy          // 諧律奇想の断章
Gambler                           // 博徒
GildedDreams                      // 金メッキの夢
GladiatorsFinale                  // 剣闘士のフィナーレ
GoldenTroupe                      // 黄金の劇団
HeartOfDepth                      // 沈淪の心
HuskOfOpulentDreams               // 華館夢醒形骸記
Instructor                        // 教官
Lavawalker                        // 烈火を渡る賢者
LongNightsOath                    // 長き夜の誓い
LuckyDog                          // 幸運
MaidenBeloved                     // 愛される少女
MarechausseeHunter                // ファントムハンター
MartialArtist                     // 武人
NightOfTheSkysUnveiling           // 天穹の顕現せし夜
NighttimeWhispersInTheEchoingWoods // 残響の森で囁かれる夜話
NoblesseOblige                    // 旧貴族のしつけ
NymphsDream                       // 水仙の夢
ObsidianCodex                     // 黒曜の秘典
OceanHuedClam                     // 海染硨磲
PaleFlame                         // 蒼白の炎
PrayersForDestiny                 // 水祭りの人
PrayersForIllumination            // 火祭りの人
PrayersForWisdom                  // 雷祭りの人
PrayersToSpringtime               // 氷祭りの人
ResolutionOfSojourner             // 旅人の心
RetracingBolide                   // 逆飛びの流星
Scholar                           // 学者
ScrollOfTheHeroOfCinderCity       // 灰燼の都に立つ英雄の絵巻
ShimenawasReminiscence            // 追憶のしめ縄
SilkenMoonsSerenade               // 月を紡ぐ夜の歌
SongOfDaysPast                    // 在りし日の歌
TenacityOfTheMillelith            // 千岩牢固
TheExile                          // 亡命者
ThunderingFury                    // 雷のような怒り
Thundersoother                    // 雷を鎮める尊者
TinyMiracle                       // 奇跡
TravelingDoctor                   // 医者
UnfinishedReverie                 // 遂げられなかった想い
VermillionHereafter               // 辰砂往生録
ViridescentVenerer                // 翠緑の影
VourukashasGlow                   // 花海甘露の光
WanderersTroupe                   // 大地を流浪する楽団
```
