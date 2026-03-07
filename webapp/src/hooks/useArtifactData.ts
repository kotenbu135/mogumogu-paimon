import { useEffect, useState } from 'react'
import type { GoodFile, RankedArtifact, ReconstructionType, ScoreTypeName } from '@/lib/types'

const CHUNK_SIZE = 50

/**
 * GOODファイルを読み込んで★5聖遺物をランク付けする
 * チャンク処理でUIをブロックしない（大きいファイルでも操作可能）
 */
async function buildRankedList(data: GoodFile): Promise<RankedArtifact[]> {
  const { calculateScores, calculateAllScores, estimateRollCounts } = await import('@/lib/scoring')
  const filtered = data.artifacts.filter((a) => a.rarity === 5)
  const results: RankedArtifact[] = []

  for (let i = 0; i < filtered.length; i += CHUNK_SIZE) {
    const end = Math.min(i + CHUNK_SIZE, filtered.length)
    for (let j = i; j < end; j++) {
      const artifact = filtered[j]
      const { cvScore, bestScore, bestType } = calculateScores(artifact)
      const allScores = calculateAllScores(artifact)
      const rollCounts = estimateRollCounts(artifact)
      results.push({ artifact, cvScore, bestScore, bestType, allScores, rollCounts })
    }
    // ブラウザに描画の機会を与える
    await new Promise<void>((resolve) => setTimeout(resolve, 0))
  }

  return results
}

/** 聖遺物データの読み込みと再構築成功率のチャンク計算を管理するフック */
export function useArtifactData(scoreType: ScoreTypeName, reconType: ReconstructionType) {
  const [allRanked, setAllRanked] = useState<RankedArtifact[] | null>(null)
  const [reconRates, setReconRates] = useState<Map<number, number>>(new Map())
  const [isLoading, setIsLoading] = useState(false)

  async function handleLoad(data: GoodFile) {
    setIsLoading(true)
    setAllRanked(await buildRankedList(data))
    setIsLoading(false)
  }

  useEffect(() => {
    if (!allRanked) {
      setReconRates(new Map())
      return
    }
    let cancelled = false
    import('@/lib/reconstruction').then(({ calculateReconstructionRate }) => {
      if (cancelled) return
      const map = new Map<number, number>()
      let idx = 0

      function processChunk() {
        if (cancelled) return
        const end = Math.min(idx + CHUNK_SIZE, allRanked!.length)
        for (; idx < end; idx++) {
          const e = allRanked![idx]
          const rate = calculateReconstructionRate(e.artifact, e.rollCounts, scoreType, reconType)
          if (rate !== null) map.set(idx, rate)
        }
        if (idx < allRanked!.length) {
          setTimeout(processChunk, 0)
        } else {
          // 全計算完了後に一括更新（途中更新による表示乱れを防ぐ）
          setReconRates(new Map(map))
        }
      }

      processChunk()
    })
    return () => { cancelled = true }
  }, [allRanked, scoreType, reconType])

  return { allRanked, reconRates, handleLoad, isLoading }
}
