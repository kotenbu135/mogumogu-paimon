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
  return (
    <div className="hero-section">
      <FileUpload onLoad={onLoad} />
      {/* スコア計算式の説明 */}
      <div className="score-formulas">
        <p className="score-formulas-title">{t.pages.aboutScore.formulaList.heading}</p>
        <ul className="score-formulas-list">
          {scoreTypeOptions.map((type) => (
            <li key={type} className="score-formulas-item">
              <span className="score-formulas-label">{t.scoreFormulas[type].label}</span>
              <span className="score-formulas-eq">=</span>
              <span className="score-formulas-formula">{t.scoreFormulas[type].formula}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
