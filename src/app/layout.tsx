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
      <head>
        <meta name='application-name' content='STRATEGIX' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='STRATEGIX' />
        <meta name='description' content='STRATEGIX' />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='theme-color' content='#000000' />
        <link
          rel='icon'
          type='image/png'
          sizes='192x192'
          href='/icon-192x192.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='512x512'
          href='/icon-512x512.png'
        />
        <link rel='manifest' href='/manifest.json' />
        <link rel='shortcut icon' href='/favicon.ico' />
      </head>
      <body className='antialiased bg-page-bg relative'>
        {!isProduction && <BreakpointDisplay />}
        <NextTopLoader />
        <div id='modal-root' />
        {children}
      </body>
    </html>
  )
}
