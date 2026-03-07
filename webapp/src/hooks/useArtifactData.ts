import { useState } from 'react'
import type { GoodFile, RankedArtifact } from '@/lib/types'

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

/** 聖遺物データの読み込みを管理するフック（再構築成功率はフィルタ後に計算） */
export function useArtifactData() {
  const [allRanked, setAllRanked] = useState<RankedArtifact[] | null>(null)

  async function handleLoad(data: GoodFile) {
    setAllRanked(await buildRankedList(data))
  }

  return { allRanked, handleLoad }
}
