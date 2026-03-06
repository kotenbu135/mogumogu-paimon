import type { GoodFile } from './types'

/**
 * アップロードされた JSON が有効な GOOD フォーマットかを実行時に検証する。
 * TypeScript の型キャストの代替として、実際の値を確認する。
 */
export function validateGoodFile(json: unknown): json is GoodFile {
  if (typeof json !== 'object' || json === null || Array.isArray(json)) return false
  const obj = json as Record<string, unknown>

  if (obj.format !== 'GOOD') return false

  // artifacts は省略可能だが、存在する場合は配列であること
  if ('artifacts' in obj) {
    if (!Array.isArray(obj.artifacts)) return false
    for (const artifact of obj.artifacts) {
      if (!isValidArtifact(artifact)) return false
    }
  }

  return true
}

function isValidArtifact(artifact: unknown): boolean {
  if (typeof artifact !== 'object' || artifact === null || Array.isArray(artifact)) return false
  const obj = artifact as Record<string, unknown>

  // substats は配列であること
  if (!Array.isArray(obj.substats)) return false
  for (const substat of obj.substats) {
    if (!isValidSubstat(substat)) return false
  }

  // totalRolls が存在する場合は 0-12 の有限整数であること（DoS 対策）
  if ('totalRolls' in obj) {
    const r = obj.totalRolls
    if (typeof r !== 'number' || !isFinite(r) || r < 0 || r > 12 || !Number.isInteger(r)) {
      return false
    }
  }

  return true
}

function isValidSubstat(substat: unknown): boolean {
  if (typeof substat !== 'object' || substat === null || Array.isArray(substat)) return false
  const obj = substat as Record<string, unknown>

  // value は有限の非負数であること
  if (typeof obj.value !== 'number' || !isFinite(obj.value) || obj.value < 0) return false

  // initialValue が存在する場合も同様に検証
  if ('initialValue' in obj) {
    const iv = obj.initialValue
    if (typeof iv !== 'number' || !isFinite(iv) || iv < 0) return false
  }

  return true
}
