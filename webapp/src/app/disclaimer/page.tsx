'use client'

import { useTranslation } from '@/lib/i18n'

export default function DisclaimerPage() {
  const { t } = useTranslation()
  const p = t.pages.disclaimer

  return (
    <div className="page-container">
      <h1 className="page-title">{p.title}</h1>

      <section className="content-section">
        <h2 className="section-title">{p.responsibility.heading}</h2>
        <p className="content-text">{p.responsibility.p1}</p>
        <p className="content-text">{p.responsibility.p2}</p>
        <p className="content-text">{p.responsibility.p3}</p>
      </section>

      <hr className="section-divider" />

      <section className="content-section">
        <h2 className="section-title">{p.disclaimer.heading}</h2>
        <p className="content-text">{p.disclaimer.p1}</p>
      </section>
    </div>
  )
}
