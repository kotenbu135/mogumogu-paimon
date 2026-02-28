import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '聖遺物スコアランキング',
  description: 'GOODフォーマットの聖遺物データをスコア順に表示する',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
