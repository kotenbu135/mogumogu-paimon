import { useState } from 'react'
import type { GoodFile, RankedArtifact } from '@/lib/types'

const STORAGE_KEY = 'mogumogu-good-data'

/** GOODファイルを読み込んで★5聖遺物をランク付けする（チャンク処理でUIブロックを防ぐ） */
async function buildRankedList(data: GoodFile): Promise<RankedArtifact[]> {
  const { calculateScores, calculateAllScores, estimateRollCounts } = await import('@/lib/scoring')
  const artifacts = data.artifacts.filter((a) => a.rarity === 5)
  const result: RankedArtifact[] = []
  const CHUNK_SIZE = 100

  for (let i = 0; i < artifacts.length; i += CHUNK_SIZE) {
    const end = Math.min(i + CHUNK_SIZE, artifacts.length)
    for (let j = i; j < end; j++) {
      const artifact = artifacts[j]
      const { cvScore, bestScore, bestType } = calculateScores(artifact)
      const allScores = calculateAllScores(artifact)
      const rollCounts = estimateRollCounts(artifact)
      result.push({ artifact, cvScore, bestScore, bestType, allScores, rollCounts })
    }
    // イベントループに制御を返してUIの応答性を保つ
    if (end < artifacts.length) {
      await new Promise<void>((resolve) => setTimeout(resolve, 0))
    }
  }

  return result
}

/** localStorage から GoodFile を読み込む */
export function loadFromStorage(): GoodFile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' && parsed !== null &&
      'format' in parsed && (parsed as GoodFile).format === 'GOOD' &&
      'artifacts' in parsed && Array.isArray((parsed as GoodFile).artifacts)
    ) {
      return parsed as GoodFile
    }
    return null
  } catch {
    return null
  }
}

/** localStorage に GoodFile を保存する */
function saveToStorage(data: GoodFile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage の容量超過などは無視
  }
}

/** 聖遺物データの読み込みを管理するフック（再構築成功率はフィルタ後に計算） */
export function useArtifactData() {
  const [allRanked, setAllRanked] = useState<RankedArtifact[] | null>(null)

  async function handleLoad(data: GoodFile) {
    saveToStorage(data)
    setAllRanked(await buildRankedList(data))
  }

  return { allRanked, handleLoad }
}
