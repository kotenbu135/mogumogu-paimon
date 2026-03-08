'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import ArtifactCard from '@/components/ArtifactCard'
import type { ScoreTypeName, ArtifactSlotKey } from '@/lib/types'
import type { DisplayedEntry } from '@/hooks/useDisplayedArtifacts'

// カード最小幅とギャップ（card-grid の minmax(320px, 1fr) + gap: 1rem に合わせる）
const CARD_MIN_WIDTH = 320
const CARD_GAP = 16
// 行の推定高さ（カード本体 + ギャップ）
const ESTIMATED_ROW_HEIGHT = 300

interface VirtualArtifactGridProps {
  displayed: DisplayedEntry[]
  scoreType: ScoreTypeName
  equippedSetsMap: Map<string, string[]>
  onFilterBySet: (setKey: string) => void
  onFilterBySlot: (slotKey: ArtifactSlotKey) => void
}

/** 仮想スクロール対応のアーティファクトグリッド */
export default function VirtualArtifactGrid({
  displayed,
  scoreType,
  equippedSetsMap,
  onFilterBySet,
  onFilterBySlot,
}: VirtualArtifactGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columnCount, setColumnCount] = useState(3)
  const [scrollMargin, setScrollMargin] = useState(0)

  // コンテナ幅からカラム数を計算（CSS auto-fill minmax(320px,1fr) を再現）
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateLayout = () => {
      const width = el.getBoundingClientRect().width
      const cols = Math.max(1, Math.floor((width + CARD_GAP) / (CARD_MIN_WIDTH + CARD_GAP)))
      setColumnCount(cols)
      setScrollMargin(el.getBoundingClientRect().top + window.scrollY)
    }

    updateLayout()
    const resizeObserver = new ResizeObserver(updateLayout)
    resizeObserver.observe(el)
    window.addEventListener('scroll', updateLayout, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', updateLayout)
    }
  }, [])

  // アイテムを行単位にグルーピング
  const rows = useMemo(() => {
    const result: DisplayedEntry[][] = []
    for (let i = 0; i < displayed.length; i += columnCount) {
      result.push(displayed.slice(i, i + columnCount))
    }
    return result
  }, [displayed, columnCount])

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 3,
    scrollMargin,
  })

  return (
    <div ref={containerRef}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const rowItems = rows[virtualRow.index]
          const baseCardIdx = virtualRow.index * columnCount
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                gap: `${CARD_GAP}px`,
                paddingBottom: `${CARD_GAP}px`,
              }}
            >
              {rowItems.map(({ entry, reconRate, originalIndex }, colIdx) => (
                <ArtifactCard
                  key={originalIndex}
                  entry={entry}
                  scoreType={scoreType}
                  reconRate={reconRate}
                  onFilterBySet={onFilterBySet}
                  onFilterBySlot={onFilterBySlot}
                  equippedSetKeys={equippedSetsMap.get(entry.artifact.location) ?? []}
                  cardIndex={baseCardIdx + colIdx}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
