/**
 * i18n 翻訳キー一致テスト
 *
 * 英語（en）と日本語（ja）翻訳の構造一致・値の完全性を検証する。
 * TypeScript の型チェックに加え、実行時に全キーが存在し空文字でないことを確認する。
 */

import { describe, it, expect } from 'vitest'
import { ja } from '@/lib/i18n/ja'
import { en } from '@/lib/i18n/en'

/**
 * オブジェクトのリーフキーを再帰的に収集する。
 * 配列は各要素のキーではなく "配列インデックス" として扱う。
 * @param skipKeys - 収集をスキップするトップレベルキー名
 */
function collectLeafPaths(obj: unknown, prefix = '', skipKeys: string[] = []): string[] {
  if (obj === null || typeof obj !== 'object') return [prefix]
  if (Array.isArray(obj)) {
    // 配列は長さと各要素の型のみ確認するため、代表パスとして記録
    return [prefix + '[]']
  }
  const paths: string[] = []
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key
    // スキップ対象キーは除外
    if (skipKeys.some((sk) => path === sk || path.startsWith(sk + '.'))) continue
    paths.push(...collectLeafPaths(value, path, skipKeys))
  }
  return paths
}

/**
 * オブジェクト内のすべての文字列値を再帰的に収集する（パスつき）。
 * 配列要素も含む。
 * @param skipPaths - 収集をスキップするパスのプレフィックス
 */
function collectStringEntries(
  obj: unknown,
  prefix = '',
  skipPaths: string[] = [],
): { path: string; value: string }[] {
  if (typeof obj === 'string') return [{ path: prefix, value: obj }]
  if (obj === null || typeof obj !== 'object') return []
  if (Array.isArray(obj)) {
    return obj.flatMap((v, i) =>
      collectStringEntries(v, `${prefix}[${i}]`, skipPaths)
    )
  }
  return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (skipPaths.some((sp) => path === sp || path.startsWith(sp + '.'))) return []
    return collectStringEntries(value, path, skipPaths)
  })
}

describe('i18n - 翻訳の構造一致', () => {
  it('en と ja のリーフキーが一致する（意図的スパースフィールドを除く）', () => {
    // artifactSetNames は「上書き用スパースマップ」のため ja は空が正常
    const skipKeys = ['lang', 'artifactSetNames']
    const jaPaths = collectLeafPaths(ja, '', skipKeys)
    const enPaths = collectLeafPaths(en, '', skipKeys)

    const missingInEn = jaPaths.filter((p) => !enPaths.includes(p))
    const missingInJa = enPaths.filter((p) => !jaPaths.includes(p))

    expect(missingInEn).toEqual([])
    expect(missingInJa).toEqual([])
  })

  it('en と ja の最上位キーが一致する', () => {
    const jaKeys = Object.keys(ja).sort()
    const enKeys = Object.keys(en).sort()
    expect(jaKeys).toEqual(enKeys)
  })
})

describe('i18n - 値の完全性', () => {
  it('ja の文字列値が空文字でない（言語構造上の意図的空文字を除く）', () => {
    // p1pre / p1post は日本語では文の前後が不要なため空文字が正常
    const skipPaths = ['pages.howToUse.step1.p1pre', 'pages.howToUse.step1.p1post']
    const entries = collectStringEntries(ja, '', skipPaths)
    const empty = entries.filter((e) => e.value.trim() === '')
    expect(empty.map((e) => e.path)).toEqual([])
  })

  it('en の全文字列値が空文字でない', () => {
    const entries = collectStringEntries(en)
    const empty = entries.filter((e) => e.value.trim() === '')
    expect(empty.map((e) => e.path)).toEqual([])
  })
})

describe('i18n - 言語設定', () => {
  it('ja.lang が "ja" である', () => {
    expect(ja.lang).toBe('ja')
  })

  it('en.lang が "en" である', () => {
    expect(en.lang).toBe('en')
  })
})

describe('i18n - nav キーの一致', () => {
  it('nav の全キーが en と ja で一致する', () => {
    expect(Object.keys(en.nav).sort()).toEqual(Object.keys(ja.nav).sort())
  })
})

describe('i18n - stats キーの一致', () => {
  it('stats の全キーが en と ja で一致する', () => {
    expect(Object.keys(en.stats).sort()).toEqual(Object.keys(ja.stats).sort())
  })
})

describe('i18n - scoreFormulas キーの一致', () => {
  it('scoreFormulas の全スコアタイプキーが en と ja で一致する', () => {
    expect(Object.keys(en.scoreFormulas).sort()).toEqual(Object.keys(ja.scoreFormulas).sort())
  })

  it('scoreFormulas の各エントリが label と formula を持つ', () => {
    for (const [key, entry] of Object.entries(en.scoreFormulas)) {
      expect(entry).toHaveProperty('label')
      expect(entry).toHaveProperty('formula')
      expect(entry.label.trim()).not.toBe('')
      expect(entry.formula.trim()).not.toBe('')
      const jaEntry = ja.scoreFormulas[key as keyof typeof ja.scoreFormulas]
      expect(jaEntry).toHaveProperty('label')
      expect(jaEntry).toHaveProperty('formula')
    }
  })
})

describe('i18n - reconTypes キーの一致', () => {
  it('reconTypes の全キーが en と ja で一致する', () => {
    expect(Object.keys(en.reconTypes).sort()).toEqual(Object.keys(ja.reconTypes).sort())
  })
})
