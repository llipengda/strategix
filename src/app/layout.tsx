import type { Metadata } from 'next'
import NextTopLoader from 'nextjs-toploader'

import './globals.css'

export const metadata: Metadata = {
  title: 'Strategix',
  description: 'Strategix is a platform for managing your strategy'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='zh_cn'>
      <body className={`antialiased`}>
        <NextTopLoader />
        {children}
      </body>
    </html>
  )
}
