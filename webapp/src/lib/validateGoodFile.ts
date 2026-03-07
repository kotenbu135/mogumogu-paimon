import type { GoodFile } from './types'

/**
 * アップロードされた JSON が有効な GOOD フォーマットかを検証する。
 * GOODファイルは機械的に出力されるため、フォーマット識別のみ確認する（O(1)）。
 */
export function validateGoodFile(json: unknown): json is GoodFile {
  if (typeof json !== 'object' || json === null || Array.isArray(json)) return false
  const obj = json as Record<string, unknown>

  if (obj.format !== 'GOOD') return false

  // artifacts は省略可能だが、存在する場合は配列であること
  if ('artifacts' in obj && !Array.isArray(obj.artifacts)) return false

  return true
}
