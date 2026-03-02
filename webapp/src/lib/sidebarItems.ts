export interface SidebarItem {
  label: string
  href: string
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'ホーム', href: '/' },
  { label: 'スコアについて', href: '/about-score' },
  { label: '再構築について', href: '/about-reconstruction' },
  { label: '使い方', href: '/how-to-use' },
  { label: 'よくある質問', href: '/faq' },
  { label: '免責事項', href: '/disclaimer' },
]
