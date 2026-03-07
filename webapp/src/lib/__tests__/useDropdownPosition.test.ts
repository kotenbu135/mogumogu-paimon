// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, afterEach } from 'vitest'
import { useDropdownPosition } from '@/hooks/useDropdownPosition'

const makeBtnRef = (bottom: number, left: number) => ({
  current: {
    getBoundingClientRect: () => ({
      bottom,
      left,
      top: bottom - 30,
      right: left + 80,
      width: 80,
      height: 30,
    }),
  } as unknown as Element,
})

describe('useDropdownPosition', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('open=false のとき top/left は 0 のまま', () => {
    const btnRef = makeBtnRef(100, 200)
    const { result } = renderHook(() => useDropdownPosition(btnRef, false))
    expect(result.current.top).toBe(0)
    expect(result.current.left).toBe(0)
  })

  it('open=true のとき bottom+4 を top、left をそのまま返す', () => {
    const btnRef = makeBtnRef(100, 200)
    const { result } = renderHook(() => useDropdownPosition(btnRef, true))
    expect(result.current.top).toBe(104)
    expect(result.current.left).toBe(200)
  })

  it('open=true のときスクロールイベントで位置が更新される', () => {
    const btnRef = makeBtnRef(100, 200)
    const { result } = renderHook(() => useDropdownPosition(btnRef, true))
    expect(result.current.top).toBe(104)

    // スクロール後にボタン位置が変わった場合をシミュレート
    ;(btnRef.current as unknown as { getBoundingClientRect: () => Partial<DOMRect> }).getBoundingClientRect =
      () => ({ bottom: 50, left: 200 })

    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current.top).toBe(54)
  })

  it('open=true のときリサイズイベントで位置が更新される', () => {
    const btnRef = makeBtnRef(100, 200)
    const { result } = renderHook(() => useDropdownPosition(btnRef, true))

    ;(btnRef.current as unknown as { getBoundingClientRect: () => Partial<DOMRect> }).getBoundingClientRect =
      () => ({ bottom: 80, left: 300 })

    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current.top).toBe(84)
    expect(result.current.left).toBe(300)
  })

  it('アンマウント時にイベントリスナーが削除される', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const btnRef = makeBtnRef(100, 200)

    const { unmount } = renderHook(() => useDropdownPosition(btnRef, true))
    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true)
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('open が false に変わるとイベントリスナーが削除される', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const btnRef = makeBtnRef(100, 200)

    const { rerender } = renderHook(
      ({ open }: { open: boolean }) => useDropdownPosition(btnRef, open),
      { initialProps: { open: true } },
    )

    rerender({ open: false })

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true)
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
