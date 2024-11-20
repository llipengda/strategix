import type { Metadata } from 'next'
import NextTopLoader from 'nextjs-toploader'

import '@/app/globals.css'
import BreakpointDisplay from '@/components/breakpoint-display'

export const metadata: Metadata = {
  title: 'STRATEGIX',
  description: 'STRATEGIX is an AI-powered strategy management tool'
}

const isProduction = process.env.NODE_ENV === 'production'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='zh-Hans'>
      <body className='antialiased bg-page-bg relative'>
        {!isProduction && <BreakpointDisplay />}
        <NextTopLoader />
        <div id='modal-root' />
        {children}
      </body>
    </html>
  )
}
