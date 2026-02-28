import { describe, it, expect, vi } from 'vitest'
import { getContextMenuItems } from '@/lib/contextMenu'
import type { ArtifactSlotKey } from '@/lib/types'

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
