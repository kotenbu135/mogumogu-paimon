/**
 * クリックターゲットがドロップダウン（ボタン＋パネル）の外かどうかを返す
 * true → 外側クリック → ドロップダウンを閉じる
 */
export function isOutsideDropdown(
  target: Node,
  btnEl: Element | null,
  panelEl: Element | null,
): boolean {
  if (btnEl?.contains(target)) return false
  if (panelEl?.contains(target)) return false
  return true
}
