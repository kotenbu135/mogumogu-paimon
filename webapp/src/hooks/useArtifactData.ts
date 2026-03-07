import { useEffect, useState } from 'react'
import type { GoodFile, RankedArtifact, ReconstructionType, ScoreTypeName } from '@/lib/types'

/** GOODファイルを読み込んで★5聖遺物をランク付けする */
async function buildRankedList(data: GoodFile): Promise<RankedArtifact[]> {
  const { calculateScores, calculateAllScores, estimateRollCounts } = await import('@/lib/scoring')
  return data.artifacts
    .filter((a) => a.rarity === 5)
    .map((artifact) => {
      const { cvScore, bestScore, bestType } = calculateScores(artifact)
      const allScores = calculateAllScores(artifact)
      const rollCounts = estimateRollCounts(artifact)
      return { artifact, cvScore, bestScore, bestType, allScores, rollCounts }
    })
}

/** 聖遺物データの読み込みと再構築成功率の計算を管理するフック */
export function useArtifactData(scoreType: ScoreTypeName, reconType: ReconstructionType) {
  const [allRanked, setAllRanked] = useState<RankedArtifact[] | null>(null)
  const [reconRates, setReconRates] = useState<Map<number, number>>(new Map())

  async function handleLoad(data: GoodFile) {
    setAllRanked(await buildRankedList(data))
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
      for (let i = 0; i < allRanked.length; i++) {
        const e = allRanked[i]
        const rate = calculateReconstructionRate(e.artifact, e.rollCounts, scoreType, reconType)
        if (rate !== null) map.set(i, rate)
      }
      setReconRates(map)
    })
    return () => { cancelled = true }
  }, [allRanked, scoreType, reconType])

  return { allRanked, reconRates, handleLoad }
}
