import { describe, expect, it } from 'vitest'
import { isOutsideDropdown } from '@/lib/dropdownUtils'

const makeEl = (contains: boolean) =>
  ({ contains: () => contains }) as unknown as Element

describe('isOutsideDropdown', () => {
  it('ボタン内クリックのとき false を返す', () => {
    const target = {} as Node
    expect(isOutsideDropdown(target, makeEl(true), makeEl(false))).toBe(false)
  })

  it('パネル内クリックのとき false を返す', () => {
    const target = {} as Node
    expect(isOutsideDropdown(target, makeEl(false), makeEl(true))).toBe(false)
  })

  it('ボタンもパネルも外のクリックのとき true を返す', () => {
    const target = {} as Node
    expect(isOutsideDropdown(target, makeEl(false), makeEl(false))).toBe(true)
  })

  it('btnEl が null のとき true を返す（panelEl が外の場合）', () => {
    const target = {} as Node
    expect(isOutsideDropdown(target, null, makeEl(false))).toBe(true)
  })

  it('panelEl が null のとき true を返す（btnEl が外の場合）', () => {
    const target = {} as Node
    expect(isOutsideDropdown(target, makeEl(false), null)).toBe(true)
  })

  it('btnEl も panelEl も null のとき true を返す', () => {
    const target = {} as Node
    expect(isOutsideDropdown(target, null, null)).toBe(true)
  })
})
