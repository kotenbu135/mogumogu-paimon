import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { LanguageProvider } from '@/lib/i18n'
import HeroUIProviderWrapper from '@/components/HeroUIProviderWrapper'

// weight: 400 のみプリロード対象（LCP/FCP改善のため）
const notoSansJPRegular = Noto_Sans_JP({
  weight: ['400'],
  subsets: ['latin'],
  preload: true,
  variable: '--font-noto-sans-jp',
  display: 'swap',
})

// 600/700 はプリロード対象外（初期表示に不要なため）
const notoSansJPBold = Noto_Sans_JP({
  weight: ['600', '700'],
  subsets: ['latin'],
  preload: false,
  variable: '--font-noto-sans-jp',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'もぐもぐパイモン - 聖遺物スコア -',
  description: 'GOODフォーマットの聖遺物データをスコア順に表示する',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`dark ${notoSansJPRegular.variable} ${notoSansJPBold.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';" />
<meta name="referrer" content="no-referrer" />
      </head>
      <body>
        <HeroUIProviderWrapper>
          <LanguageProvider>
            <div className="app-layout">
              <Sidebar />
              <div className="main-area">
                {children}
              </div>
            </div>
          </LanguageProvider>
        </HeroUIProviderWrapper>
      </body>
    </html>
  )
}
