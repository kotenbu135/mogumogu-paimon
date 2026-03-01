import type { ArtifactSlotKey } from './types'
import { ARTIFACT_SET_NAMES, SLOT_NAMES } from './constants'

export interface ContextMenuItem {
  label: string
  onClick: () => void
}

/** キャラアイコンクリック時のコンテキストメニュー項目を生成する */
export function getCharContextMenuItems(
  equippedSetKeys: string[],
  onFilterBySet: (setKey: string) => void,
): ContextMenuItem[] {
  // キャラが装備しているセットを重複排除して日本語名付きで列挙
  const uniqueSets = [...new Set(equippedSetKeys)]
  return uniqueSets.map((setKey) => ({
    label: `セット: ${ARTIFACT_SET_NAMES[setKey] ?? setKey}`,
    onClick: () => onFilterBySet(setKey),
  }))
}

/** 聖遺物アイコンクリック時のコンテキストメニュー項目を生成する */
export function getContextMenuItems(
  setKey: string,
  slotKey: ArtifactSlotKey,
  onFilterBySet: (setKey: string) => void,
  onFilterBySlot: (slotKey: ArtifactSlotKey) => void,
): ContextMenuItem[] {
  const setName = ARTIFACT_SET_NAMES[setKey] ?? setKey
  const slotName = SLOT_NAMES[slotKey] ?? slotKey
  return [
    {
      label: `セット: ${setName}`,
      onClick: () => onFilterBySet(setKey),
    },
    {
      label: `部位: ${slotName}`,
      onClick: () => onFilterBySlot(slotKey),
    },
  ]
}
