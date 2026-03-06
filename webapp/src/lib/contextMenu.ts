import type { ArtifactSlotKey } from './types'
import { ARTIFACT_SET_NAMES, SLOT_NAMES } from './constants'

/** メニューがビューポート内に収まるよう座標をクランプする */
export function clampMenuPosition(
  x: number,
  y: number,
  menuWidth: number,
  menuHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): { left: number; top: number } {
  return {
    left: Math.min(x, Math.max(0, viewportWidth - menuWidth)),
    top: Math.min(y, Math.max(0, viewportHeight - menuHeight)),
  }
}

export interface ContextMenuItem {
  label: string
  onClick: () => void
}

export interface ContextMenuLabels {
  setPrefix?: string
  slotPrefix?: string
  setNames?: Record<string, string>
  slotNames?: Partial<Record<ArtifactSlotKey, string>>
}

/** キャラアイコンクリック時のコンテキストメニュー項目を生成する */
export function getCharContextMenuItems(
  equippedSetKeys: string[],
  onFilterBySet: (setKey: string) => void,
  labels?: Pick<ContextMenuLabels, 'setPrefix' | 'setNames'>,
): ContextMenuItem[] {
  const setPrefix = labels?.setPrefix ?? 'セット'
  const uniqueSets = [...new Set(equippedSetKeys)]
  return uniqueSets.map((setKey) => {
    const name = labels?.setNames?.[setKey] ?? ARTIFACT_SET_NAMES[setKey] ?? setKey
    return {
      label: `${setPrefix}: ${name}`,
      onClick: () => onFilterBySet(setKey),
    }
  })
}

/** 聖遺物アイコンクリック時のコンテキストメニュー項目を生成する */
export function getContextMenuItems(
  setKey: string,
  slotKey: ArtifactSlotKey,
  onFilterBySet: (setKey: string) => void,
  onFilterBySlot: (slotKey: ArtifactSlotKey) => void,
  labels?: ContextMenuLabels,
): ContextMenuItem[] {
  const setPrefix = labels?.setPrefix ?? 'セット'
  const slotPrefix = labels?.slotPrefix ?? '部位'
  const setName = labels?.setNames?.[setKey] ?? ARTIFACT_SET_NAMES[setKey] ?? setKey
  const slotName = labels?.slotNames?.[slotKey] ?? SLOT_NAMES[slotKey] ?? slotKey
  return [
    {
      label: `${setPrefix}: ${setName}`,
      onClick: () => onFilterBySet(setKey),
    },
    {
      label: `${slotPrefix}: ${slotName}`,
      onClick: () => onFilterBySlot(slotKey),
    },
  ]
}
