// @vitest-environment jsdom
import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDropdownClose } from '@/hooks/useDropdownClose'

const makeEl = (contains: boolean) =>
  ({ contains: () => contains }) as unknown as Element

const makeRef = (contains: boolean) => ({ current: makeEl(contains) })

const makeDropdown = (
  open: boolean,
  opts: { btnContains?: boolean; panelContains?: boolean } = {},
) => ({
  open,
  close: vi.fn(),
  btnRef: makeRef(opts.btnContains ?? false),
  panelRef: makeRef(opts.panelContains ?? false),
})

describe('useDropdownClose', () => {
  let addSpy: ReturnType<typeof vi.spyOn>
  let removeSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    addSpy = vi.spyOn(document, 'addEventListener')
    removeSpy = vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    addSpy.mockRestore()
    removeSpy.mockRestore()
  })

  it('ドロップダウンが閉じている場合は mousedown イベントリスナーを追加しない', () => {
    const dropdown = makeDropdown(false)

    renderHook(() => useDropdownClose([dropdown]))

    expect(addSpy).not.toHaveBeenCalledWith('mousedown', expect.any(Function))
    expect(addSpy).not.toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('ドロップダウンが開いている場合は mousedown / keydown イベントリスナーを追加する', () => {
    const dropdown = makeDropdown(true)

    renderHook(() => useDropdownClose([dropdown]))

    expect(addSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('外側クリックで対象ドロップダウンの close が呼ばれる', () => {
    const dropdown = makeDropdown(true, { btnContains: false, panelContains: false })

    renderHook(() => useDropdownClose([dropdown]))
    document.dispatchEvent(new MouseEvent('mousedown'))

    expect(dropdown.close).toHaveBeenCalledTimes(1)
  })

  it('内側クリック（ボタン）で close が呼ばれない', () => {
    const dropdown = makeDropdown(true, { btnContains: true, panelContains: false })

    renderHook(() => useDropdownClose([dropdown]))
    document.dispatchEvent(new MouseEvent('mousedown'))

    expect(dropdown.close).not.toHaveBeenCalled()
  })

  it('内側クリック（パネル）で close が呼ばれない', () => {
    const dropdown = makeDropdown(true, { btnContains: false, panelContains: true })

    renderHook(() => useDropdownClose([dropdown]))
    document.dispatchEvent(new MouseEvent('mousedown'))

    expect(dropdown.close).not.toHaveBeenCalled()
  })

  it('Escキー押下で全ドロップダウンの close が呼ばれる', () => {
    const dropdown1 = makeDropdown(true)
    const dropdown2 = makeDropdown(false)

    renderHook(() => useDropdownClose([dropdown1, dropdown2]))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(dropdown1.close).toHaveBeenCalledTimes(1)
    expect(dropdown2.close).toHaveBeenCalledTimes(1)
  })

  it('Escape 以外のキーでは close が呼ばれない', () => {
    const dropdown = makeDropdown(true)

    renderHook(() => useDropdownClose([dropdown]))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))

    expect(dropdown.close).not.toHaveBeenCalled()
  })

  it('アンマウント時にイベントリスナーが削除される', () => {
    const dropdown = makeDropdown(true)

    const { unmount } = renderHook(() => useDropdownClose([dropdown]))
    unmount()

    expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })
})
