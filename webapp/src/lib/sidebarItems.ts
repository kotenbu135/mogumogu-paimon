import type { Translations } from './i18n/types'

export type NavLabelKey = keyof Translations['nav']

export interface SidebarItem {
  labelKey: NavLabelKey
  href: string
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { labelKey: 'home', href: '/' },
  { labelKey: 'aboutScore', href: '/about-score' },
  { labelKey: 'aboutReconstruction', href: '/about-reconstruction' },
  { labelKey: 'howToUse', href: '/how-to-use' },
  { labelKey: 'faq', href: '/faq' },
  { labelKey: 'disclaimer', href: '/disclaimer' },
]
