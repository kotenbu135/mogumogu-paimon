'use client'

import { useTranslation } from '@/lib/i18n'

export default function AboutReconstructionPage() {
  const { t } = useTranslation()
  const p = t.pages.aboutReconstruction

  return (
    <div className="page-container">
      <h1 className="page-title">{p.title}</h1>

      <section className="content-section">
        <h2 className="section-title">{p.whatIs.heading}</h2>
        <p className="content-text">{p.whatIs.p1}</p>
        <p className="content-text">{p.whatIs.p2}</p>
      </section>

      <section className="content-section">
        <h2 className="section-title">{p.types.heading}</h2>
        <p className="content-text">{p.types.p1}</p>
        <ul className="content-list">
          <li><strong>{p.types.normal.split(' — ')[0]}</strong> — {p.types.normal.split(' — ')[1]}</li>
          <li><strong>{p.types.advanced.split(' — ')[0]}</strong> — {p.types.advanced.split(' — ')[1]}</li>
          <li><strong>{p.types.absolute.split(' — ')[0]}</strong> — {p.types.absolute.split(' — ')[1]}</li>
        </ul>
        <p className="content-text">{p.types.p2}</p>
      </section>

      <section className="content-section">
        <h2 className="section-title">{p.successRate.heading}</h2>
        <p className="content-text">{p.successRate.p1}</p>
        <ol className="content-list">
          {p.successRate.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <p className="content-text">{p.successRate.p2}</p>
      </section>

      <section className="content-section">
        <h2 className="section-title">{p.guarantee.heading}</h2>
        <p className="content-text">{p.guarantee.p1}</p>
        <ul className="content-list">
          <li><strong>{p.guarantee.basic.split(' — ')[0]}</strong> — {p.guarantee.basic.split(' — ').slice(1).join(' — ')}</li>
          <li><strong>{p.guarantee.circlet.split(' — ')[0]}</strong> — {p.guarantee.circlet.split(' — ').slice(1).join(' — ')}</li>
          <li><strong>{p.guarantee.cvCirclet.split(' — ')[0]}</strong> — {p.guarantee.cvCirclet.split(' — ').slice(1).join(' — ')}</li>
        </ul>
      </section>

      <section className="content-section">
        <h2 className="section-title">{p.precision.heading}</h2>
        <p className="content-text">{p.precision.p1}</p>
        <ul className="content-list">
          {p.precision.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
        <p className="content-text">{p.precision.p2}</p>
      </section>
    </div>
  )
}
