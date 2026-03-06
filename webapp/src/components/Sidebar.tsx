'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SIDEBAR_ITEMS } from '@/lib/sidebarItems'
import { useTranslation } from '@/lib/i18n'

/** SIDEBAR_ITEMS の href → 翻訳キーのマッピング */
const NAV_LABEL_KEYS: Record<string, keyof ReturnType<typeof useTranslation>['t']['nav']> = {
  '/': 'home',
  '/about-score': 'aboutScore',
  '/about-reconstruction': 'aboutReconstruction',
  '/how-to-use': 'howToUse',
  '/faq': 'faq',
  '/disclaimer': 'disclaimer',
}

export default function Sidebar() {
  const pathname = usePathname()
  const { t, lang, setLang } = useTranslation()

  return (
    <nav className="sidebar">
      <ul className="sidebar-list">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const labelKey = NAV_LABEL_KEYS[item.href]
          const label = labelKey ? t.nav[labelKey] : item.label
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`sidebar-link${isActive ? ' sidebar-link-active' : ''}`}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="lang-toggle">
        <button
          type="button"
          className={`lang-btn${lang === 'ja' ? ' lang-btn-active' : ''}`}
          onClick={() => setLang('ja')}
          aria-pressed={lang === 'ja'}
        >
          JA
        </button>
        <button
          type="button"
          className={`lang-btn${lang === 'en' ? ' lang-btn-active' : ''}`}
          onClick={() => setLang('en')}
          aria-pressed={lang === 'en'}
        >
          EN
        </button>
      </div>
    </nav>
  )
}
