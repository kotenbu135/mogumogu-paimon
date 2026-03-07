import { describe, it, expect } from 'vitest'
import { SIDEBAR_ITEMS } from '@/lib/sidebarItems'

describe('SIDEBAR_ITEMS', () => {
  it('6つのメニュー項目が定義されている', () => {
    expect(SIDEBAR_ITEMS).toHaveLength(6)
  })

  it('ホームが最初の項目である', () => {
    expect(SIDEBAR_ITEMS[0].labelKey).toBe('home')
    expect(SIDEBAR_ITEMS[0].href).toBe('/')
  })

  it('スコアについてが2番目の項目である', () => {
    expect(SIDEBAR_ITEMS[1].labelKey).toBe('aboutScore')
    expect(SIDEBAR_ITEMS[1].href).toBe('/about-score')
  })

  it('再構築についてが3番目の項目である', () => {
    expect(SIDEBAR_ITEMS[2].labelKey).toBe('aboutReconstruction')
    expect(SIDEBAR_ITEMS[2].href).toBe('/about-reconstruction')
  })

  it('使い方が4番目の項目である', () => {
    expect(SIDEBAR_ITEMS[3].labelKey).toBe('howToUse')
    expect(SIDEBAR_ITEMS[3].href).toBe('/how-to-use')
  })

  it('よくある質問が5番目の項目である', () => {
    expect(SIDEBAR_ITEMS[4].labelKey).toBe('faq')
    expect(SIDEBAR_ITEMS[4].href).toBe('/faq')
  })

  it('免責事項が最後の項目である', () => {
    expect(SIDEBAR_ITEMS[5].labelKey).toBe('disclaimer')
    expect(SIDEBAR_ITEMS[5].href).toBe('/disclaimer')
  })

  it('各項目にlabelKeyとhrefが存在する', () => {
    for (const item of SIDEBAR_ITEMS) {
      expect(item.labelKey).toBeTruthy()
      expect(item.href).toBeTruthy()
    }
  })
})
