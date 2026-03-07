'use client'

import { useTranslation } from '@/lib/i18n'

export default function HowToUsePage() {
  const { t } = useTranslation()
  const p = t.pages.howToUse

  return (
    <div className="page-container">
      <h1 className="page-title">{p.title}</h1>

      <section className="content-section">
        <h2 className="section-title">{p.step1.heading}</h2>
        <p className="content-text">
          {p.step1.p1pre}
          <a
            href="https://konkers.github.io/irminsul/02-quickstart.html"
            target="_blank"
            rel="noopener noreferrer"
            className="content-link"
          >
            {p.step1.p1link}
          </a>
          {p.step1.p1post}
        </p>
        <p className="content-text">{p.step1.p2}</p>
        <p className="content-text">{p.step1.p3}</p>
        <ol className="content-list">
          <li>
            <a
              href="https://artiscan.ninjabay.org/#/about"
              target="_blank"
              rel="noopener noreferrer"
              className="content-link"
            >
              Artiscan
            </a>
          </li>
          <li>
            <a
              href="https://github.com/taiwenlee/Inventory_Kamera/blob/master/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="content-link"
            >
              Inventory Kamera
            </a>
          </li>
          <li>
            <a
              href="https://github.com/D1firehail/AdeptiScanner-GI/blob/master/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="content-link"
            >
              AdeptiScanner
            </a>
          </li>
        </ol>
      </section>

      <hr className="section-divider" />

      <section className="content-section">
        <h2 className="section-title">{p.step2.heading}</h2>
        <p className="content-text">{p.step2.p1}</p>
      </section>

      <hr className="section-divider" />

      <section className="content-section">
        <h2 className="section-title">{p.step3.heading}</h2>
        <p className="content-text">{p.step3.p1}</p>
        <p className="content-text">{p.step3.p2}</p>
        <p className="content-text">{p.step3.p3}</p>
      </section>
    </div>
  )
}
