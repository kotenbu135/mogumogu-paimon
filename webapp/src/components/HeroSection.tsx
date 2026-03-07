'use client'

import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import type { GoodFile, ScoreTypeName } from '@/lib/types'
import type { Translations } from '@/lib/i18n/types'

interface HeroSectionProps {
  onLoad: (data: GoodFile) => void
  t: Translations
  scoreTypeOptions: ScoreTypeName[]
}

/** アップロード画面（空状態）の Hero セクション */
export default function HeroSection({ onLoad, t, scoreTypeOptions }: HeroSectionProps) {
  const [selectedType, setSelectedType] = useState<ScoreTypeName | null>(null)

  return (
    <div className="hero-section">
      {/* ヒーロービジュアル: キャッチコピー */}
      <p className="hero-subtitle">原神の聖遺物スコアを一括評価</p>

      {/* アップロードゾーン */}
      <FileUpload onLoad={onLoad} />

      {/* スコア式カードグリッド */}
      <div className="score-card-section">
        <p className="score-card-title">{t.pages.aboutScore.formulaList.heading}</p>
        <div className="score-card-grid">
          {scoreTypeOptions.map((type) => (
            <button
              key={type}
              className={`score-formula-card ${selectedType === type ? 'score-formula-card-active' : ''}`}
              onClick={() => setSelectedType(selectedType === type ? null : type)}
            >
              <span className="score-formula-card-label">{t.scoreFormulas[type].label}</span>
              <span className="score-formula-card-formula">{t.scoreFormulas[type].formula}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
