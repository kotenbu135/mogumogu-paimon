import { useEffect, useState } from 'react'

interface DropdownPosition {
  top: number
  left: number
}

/**
 * ボタンの画面上の位置を追跡し、スクロール・リサイズ時に更新するフック。
 * ポータル経由でドロップダウンパネルを配置する際の位置計算に使用する。
 * @param btnRef 対象ボタンのref
 * @param open ドロップダウンが開いているか
 */
export function useDropdownPosition(
  btnRef: { current: Element | null },
  open: boolean,
): DropdownPosition {
  const [pos, setPos] = useState<DropdownPosition>({ top: 0, left: 0 })

  useEffect(() => {
    if (!open) return

    function update() {
      const rect = btnRef.current?.getBoundingClientRect()
      if (rect) {
        setPos({ top: rect.bottom + 4, left: rect.left })
      }
    }

    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, btnRef])

  return pos
}
