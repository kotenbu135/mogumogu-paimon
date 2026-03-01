'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SIDEBAR_ITEMS } from '@/lib/sidebarItems'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="sidebar">
      <ul className="sidebar-list">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`sidebar-link${isActive ? ' sidebar-link-active' : ''}`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
