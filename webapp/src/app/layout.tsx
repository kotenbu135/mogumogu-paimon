import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { LanguageProvider } from '@/lib/i18n'

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
    <html lang="ja">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta name="referrer" content="no-referrer" />
      </head>
      <body>
        <LanguageProvider>
          <div className="app-layout">
            <Sidebar />
            <div className="main-area">
              {children}
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}
