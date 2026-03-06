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
