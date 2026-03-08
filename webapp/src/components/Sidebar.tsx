'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@heroui/react'
import { SIDEBAR_ITEMS } from '@/lib/sidebarItems'
import { useTranslation } from '@/lib/i18n'

export default function Sidebar() {
  const pathname = usePathname()
  const { t, lang, setLang } = useTranslation()

  return (
    <nav className="sidebar">
      <ul className="sidebar-list">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const label = t.nav[item.labelKey]
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
        <Button
          type="button"
          variant="bordered"
          size="sm"
          className={`lang-btn${lang === 'ja' ? ' lang-btn-active' : ''}`}
          onPress={() => setLang('ja')}
          aria-pressed={lang === 'ja'}
        >
          JA
        </Button>
        <Button
          type="button"
          variant="bordered"
          size="sm"
          className={`lang-btn${lang === 'en' ? ' lang-btn-active' : ''}`}
          onPress={() => setLang('en')}
          aria-pressed={lang === 'en'}
        >
          EN
        </Button>
      </div>
    </nav>
  )
}
