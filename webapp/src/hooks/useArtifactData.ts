import { useEffect, useRef, useState } from 'react'
import type { GoodFile, RankedArtifact, ReconstructionType, ScoreTypeName } from '@/lib/types'

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

/** 聖遺物データの読み込みと再構築成功率のチャンク計算を管理するフック */
export function useArtifactData(scoreType: ScoreTypeName, reconType: ReconstructionType) {
  const [allRanked, setAllRanked] = useState<RankedArtifact[] | null>(null)
  const [reconRates, setReconRates] = useState<Map<number, number>>(new Map())

  // scoreType × reconType の組み合わせで計算済みの再構築率をキャッシュ
  const reconCacheRef = useRef<Map<string, Map<number, number>>>(new Map())
  // allRanked の参照を追跡してデータ変更時にキャッシュをクリア
  const cachedAllRankedRef = useRef<RankedArtifact[] | null>(null)

  async function handleLoad(data: GoodFile) {
    setAllRanked(await buildRankedList(data))
  }

  useEffect(() => {
    if (!allRanked) {
      reconCacheRef.current = new Map()
      cachedAllRankedRef.current = null
      setReconRates(new Map())
      return
    }

    // 新しいファイルが読み込まれたらキャッシュをクリア
    if (cachedAllRankedRef.current !== allRanked) {
      reconCacheRef.current = new Map()
      cachedAllRankedRef.current = allRanked
    }

    const cacheKey = `${scoreType}:${reconType}`
    const cached = reconCacheRef.current.get(cacheKey)
    if (cached) {
      // キャッシュ済みなら即時反映
      setReconRates(cached)
      return
    }

    let cancelled = false
    const CHUNK_SIZE = 100
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
          setReconRates(new Map(map))
          setTimeout(processChunk, 0)
        } else {
          // 計算完了時にキャッシュへ保存してから反映
          const finalMap = new Map(map)
          reconCacheRef.current.set(cacheKey, finalMap)
          setReconRates(finalMap)
        }
      }

      processChunk()
    })
    return () => { cancelled = true }
  }, [allRanked, scoreType, reconType])

  return { allRanked, reconRates, handleLoad }
}
