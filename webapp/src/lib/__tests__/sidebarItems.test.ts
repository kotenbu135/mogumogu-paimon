import { describe, it, expect } from 'vitest'
import { SIDEBAR_ITEMS } from '@/lib/sidebarItems'

describe('SIDEBAR_ITEMS', () => {
  it('5つのメニュー項目が定義されている', () => {
    expect(SIDEBAR_ITEMS).toHaveLength(5)
  })

  it('ホームが最初の項目である', () => {
    expect(SIDEBAR_ITEMS[0].label).toBe('ホーム')
    expect(SIDEBAR_ITEMS[0].href).toBe('/')
  })

  it('スコアについてが2番目の項目である', () => {
    expect(SIDEBAR_ITEMS[1].label).toBe('スコアについて')
    expect(SIDEBAR_ITEMS[1].href).toBe('/about-score')
  })

  it('使い方が3番目の項目である', () => {
    expect(SIDEBAR_ITEMS[2].label).toBe('使い方')
    expect(SIDEBAR_ITEMS[2].href).toBe('/how-to-use')
  })

  it('よくある質問が4番目の項目である', () => {
    expect(SIDEBAR_ITEMS[3].label).toBe('よくある質問')
    expect(SIDEBAR_ITEMS[3].href).toBe('/faq')
  })

  it('免責事項が最後の項目である', () => {
    expect(SIDEBAR_ITEMS[4].label).toBe('免責事項')
    expect(SIDEBAR_ITEMS[4].href).toBe('/disclaimer')
  })

  it('各項目にlabelとhrefが存在する', () => {
    for (const item of SIDEBAR_ITEMS) {
      expect(item.label).toBeTruthy()
      expect(item.href).toBeTruthy()
    }
  })
})
