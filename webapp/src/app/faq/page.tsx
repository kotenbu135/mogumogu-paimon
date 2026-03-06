'use client'

import { useTranslation } from '@/lib/i18n'

export default function FaqPage() {
  const { t } = useTranslation()
  const p = t.pages.faq

  return (
    <div className="page-container">
      <h1 className="page-title">{p.title}</h1>

      <section className="content-section">
        <h3 className="subsection-title">{p.q1.q}</h3>
        <p className="content-text">{p.q1.a}</p>
        <p className="content-text">
          <a
            href="https://frzyc.github.io/genshin-optimizer/#/doc"
            target="_blank"
            rel="noopener noreferrer"
            className="content-link"
          >
            {p.q1.refLabel}
          </a>
        </p>
      </section>

      <section className="content-section">
        <h3 className="subsection-title">{p.q2.q}</h3>
        <p className="content-text">{p.q2.a}</p>
      </section>
    </div>
  )
}
