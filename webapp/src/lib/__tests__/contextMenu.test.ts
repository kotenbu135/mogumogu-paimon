import { describe, it, expect, vi } from 'vitest'
import { clampMenuPosition, getContextMenuItems } from '@/lib/contextMenu'
import type { ArtifactSlotKey } from '@/lib/types'

describe('clampMenuPosition', () => {
  it('メニューが収まる場合は座標をそのまま返す', () => {
    expect(clampMenuPosition(100, 200, 120, 80, 1280, 720)).toEqual({ left: 100, top: 200 })
  })

  it('右端からはみ出す場合は left を調整する', () => {
    // x=1200, menuWidth=120, viewport=1280 → left=1160
    expect(clampMenuPosition(1200, 100, 120, 80, 1280, 720)).toEqual({ left: 1160, top: 100 })
  })

  it('下端からはみ出す場合は top を調整する', () => {
    // y=680, menuHeight=80, viewport=720 → top=640
    expect(clampMenuPosition(100, 680, 120, 80, 1280, 720)).toEqual({ left: 100, top: 640 })
  })

  it('右端と下端の両方からはみ出す場合は両方調整する', () => {
    expect(clampMenuPosition(1200, 680, 120, 80, 1280, 720)).toEqual({ left: 1160, top: 640 })
  })

  it('メニュー幅がビューポートより大きい場合は left を 0 にする', () => {
    expect(clampMenuPosition(100, 100, 2000, 80, 1280, 720)).toEqual({ left: 0, top: 100 })
  })
})

describe('getContextMenuItems', () => {
  it('2つのメニュー項目を返す', () => {
    const items = getContextMenuItems('GladiatorsFinale', 'flower', vi.fn(), vi.fn())
    expect(items).toHaveLength(2)
  })

  it('セットフィルタ項目のラベルにセット名が含まれる', () => {
    const items = getContextMenuItems('GladiatorsFinale', 'flower', vi.fn(), vi.fn())
    const setItem = items[0]
    expect(setItem.label).toContain('セット')
  })

  it('部位フィルタ項目のラベルに部位名が含まれる', () => {
    const items = getContextMenuItems('GladiatorsFinale', 'flower', vi.fn(), vi.fn())
    const slotItem = items[1]
    expect(slotItem.label).toContain('部位')
  })

  it('セットフィルタ項目をクリックすると onFilterBySet が呼ばれる', () => {
    const onFilterBySet = vi.fn()
    const onFilterBySlot = vi.fn()
    const items = getContextMenuItems('GladiatorsFinale', 'flower', onFilterBySet, onFilterBySlot)

    items[0].onClick()

    expect(onFilterBySet).toHaveBeenCalledOnce()
    expect(onFilterBySet).toHaveBeenCalledWith('GladiatorsFinale')
    expect(onFilterBySlot).not.toHaveBeenCalled()
  })

  it('部位フィルタ項目をクリックすると onFilterBySlot が呼ばれる', () => {
    const onFilterBySet = vi.fn()
    const onFilterBySlot = vi.fn()
    const items = getContextMenuItems('GladiatorsFinale', 'flower', onFilterBySet, onFilterBySlot)

    items[1].onClick()

    expect(onFilterBySlot).toHaveBeenCalledOnce()
    expect(onFilterBySlot).toHaveBeenCalledWith('flower' as ArtifactSlotKey)
    expect(onFilterBySet).not.toHaveBeenCalled()
  })

  it('異なるセットキーと部位キーでも正しく動作する', () => {
    const onFilterBySet = vi.fn()
    const onFilterBySlot = vi.fn()
    const items = getContextMenuItems('NoblesseOblige', 'circlet', onFilterBySet, onFilterBySlot)

    items[0].onClick()
    items[1].onClick()

    expect(onFilterBySet).toHaveBeenCalledWith('NoblesseOblige')
    expect(onFilterBySlot).toHaveBeenCalledWith('circlet' as ArtifactSlotKey)
  })
})
