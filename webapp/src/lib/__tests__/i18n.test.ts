/**
 * i18n 多言語対応の整合性テスト
 * - 翻訳キーの網羅性・一致チェック
 */

import { describe, it, expect } from 'vitest'
import { ja } from '@/lib/i18n/ja'
import { en } from '@/lib/i18n/en'
import { ARTIFACT_SET_NAMES } from '@/lib/constants'

const constantsSetKeys = Object.keys(ARTIFACT_SET_NAMES).sort()
const enSetKeys = Object.keys(en.artifactSetNames).sort()
const jaSetKeys = Object.keys(ja.artifactSetNames).sort()

describe('artifactSetNames の整合性', () => {
  it('en.artifactSetNames が ARTIFACT_SET_NAMES の全キーを網羅している', () => {
    const missing = constantsSetKeys.filter((k) => !(k in en.artifactSetNames))
    expect(missing, `en.ts に未定義のセット名: ${missing.join(', ')}`).toHaveLength(0)
  })

  it('en.artifactSetNames に ARTIFACT_SET_NAMES 外のキーが存在しない', () => {
    const extra = enSetKeys.filter((k) => !(k in ARTIFACT_SET_NAMES))
    expect(extra, `ARTIFACT_SET_NAMES に存在しない en.ts のセット名: ${extra.join(', ')}`).toHaveLength(0)
  })

  it('en.artifactSetNames の全エントリが空文字でない', () => {
    for (const [key, value] of Object.entries(en.artifactSetNames)) {
      expect(value, `en.artifactSetNames["${key}"] が空`).toBeTruthy()
    }
  })

  it('ARTIFACT_SET_NAMES の全エントリが空文字でない', () => {
    for (const [key, value] of Object.entries(ARTIFACT_SET_NAMES)) {
      expect(value, `ARTIFACT_SET_NAMES["${key}"] が空`).toBeTruthy()
    }
  })

  it('ja.artifactSetNames は空（ARTIFACT_SET_NAMES をフォールバックとして使用する設計）', () => {
    expect(jaSetKeys).toHaveLength(0)
  })
})

describe('scoreFormulas の整合性', () => {
  it('ja と en で同じスコアタイプキーを持つ', () => {
    const jaKeys = Object.keys(ja.scoreFormulas).sort()
    const enKeys = Object.keys(en.scoreFormulas).sort()
    expect(jaKeys).toEqual(enKeys)
  })

  it('en.scoreFormulas の全エントリに label と formula が存在する', () => {
    for (const [type, entry] of Object.entries(en.scoreFormulas)) {
      expect(entry.label, `en.scoreFormulas["${type}"].label が空`).toBeTruthy()
      expect(entry.formula, `en.scoreFormulas["${type}"].formula が空`).toBeTruthy()
    }
  })
})

describe('setGroupLabels の整合性', () => {
  it('ja と en で同じグループラベルキーを持つ', () => {
    const jaKeys = Object.keys(ja.setGroupLabels).sort()
    const enKeys = Object.keys(en.setGroupLabels).sort()
    expect(jaKeys).toEqual(enKeys)
  })

  it('en.setGroupLabels の全エントリが空文字でない', () => {
    for (const [key, value] of Object.entries(en.setGroupLabels)) {
      expect(value, `en.setGroupLabels["${key}"] が空`).toBeTruthy()
    }
  })
})

describe('stats の整合性', () => {
  it('ja と en で同じステータスキーを持つ', () => {
    const jaKeys = Object.keys(ja.stats).sort()
    const enKeys = Object.keys(en.stats).sort()
    expect(jaKeys).toEqual(enKeys)
  })
})

describe('mainStatExtra の整合性', () => {
  it('ja と en で同じメインステ追加キーを持つ', () => {
    const jaKeys = Object.keys(ja.mainStatExtra).sort()
    const enKeys = Object.keys(en.mainStatExtra).sort()
    expect(jaKeys).toEqual(enKeys)
  })
})
