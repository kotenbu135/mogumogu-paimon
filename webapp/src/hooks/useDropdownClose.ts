import { useEffect } from 'react'
import { isOutsideDropdown } from '@/lib/dropdownUtils'

interface DropdownEntry {
  open: boolean
  close: () => void
  btnRef: { current: Element | null }
  panelRef: { current: Element | null }
}

/**
 * 外側クリック・Escキーでドロップダウンを閉じる共通フック
 * @param dropdowns 管理対象のドロップダウン一覧
 */
export function useDropdownClose(dropdowns: DropdownEntry[]): void {
  const anyOpen = dropdowns.some((d) => d.open)

  useEffect(() => {
    if (!anyOpen) return

    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      for (const { open, close, btnRef, panelRef } of dropdowns) {
        if (open && isOutsideDropdown(target, btnRef.current, panelRef.current)) {
          close()
        }
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        for (const { close } of dropdowns) {
          close()
        }
      }
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anyOpen])
}
