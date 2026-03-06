'use client'

import type { ScoreTypeName } from '@/lib/types'
import { useTranslation } from '@/lib/i18n'

const SCORE_TYPE_OPTIONS: ScoreTypeName[] = [
  'CV', 'HP型', '攻撃型', '防御型', '熟知型', 'チャージ型', '最良型',
]

export default function AboutScorePage() {
  const { t } = useTranslation()
  const p = t.pages.aboutScore

  return (
    <div className="page-container">
      <h1 className="page-title">{p.title}</h1>

      <section className="content-section">
        <h2 className="section-title">{p.whatIsScore.heading}</h2>
        <p className="content-text">{p.whatIsScore.p1}</p>
        <p className="content-text">{p.whatIsScore.p2}</p>
      </section>

      <section className="content-section">
        <h2 className="section-title">{p.cv.heading}</h2>
        <p className="content-text">{p.cv.p1}</p>
        <div className="formula-block">
          <span className="formula-text">{p.cv.formula}</span>
        </div>
        <p className="content-text">{p.cv.p2}</p>
        <div className="score-tier-list">
          <div className="score-tier score-tier-red">{p.cv.tier55}</div>
          <div className="score-tier score-tier-orange">{p.cv.tier45}</div>
          <div className="score-tier score-tier-yellow">{p.cv.tier35}</div>
          <div className="score-tier score-tier-default">{p.cv.tierDefault}</div>
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">{p.formulaList.heading}</h2>
        <p className="content-text">{p.formulaList.p1}</p>
        <ul className="score-formulas-list about-formulas">
          {SCORE_TYPE_OPTIONS.map((type) => (
            <li key={type} className="score-formulas-item about-formulas-item">
              <span className="score-formulas-label">{t.scoreFormulas[type].label}</span>
              <span className="score-formulas-eq">=</span>
              <span className="score-formulas-formula">{t.scoreFormulas[type].formula}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="content-section">
        <h2 className="section-title">{p.mainStatFilter.heading}</h2>
        <p className="content-text">{p.mainStatFilter.p1}</p>
        <p className="content-text">{p.mainStatFilter.p2}</p>
        <table className="w-full text-sm border-collapse my-3">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left py-1 pr-4 font-medium">{p.mainStatFilter.tableHeaders.scoreType}</th>
              <th className="text-left py-1 font-medium">{p.mainStatFilter.tableHeaders.mainStat}</th>
            </tr>
          </thead>
          <tbody>
            {p.mainStatFilter.rows.map((row) => (
              <tr key={row.scoreType} className="border-b border-gray-700">
                <td className="py-1 pr-4">{row.scoreType}</td>
                <td className="py-1">{row.mainStat}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="content-text text-sm opacity-75">{p.mainStatFilter.note}</p>
      </section>
    </div>
  )
}
