import type { Metadata, Viewport } from 'next'
import NextTopLoader from 'nextjs-toploader'

import '@/app/globals.css'
import BreakpointDisplay from '@/components/breakpoint-display'

const APP_NAME = 'STRATEGIX'
const APP_DEFAULT_TITLE = 'STRATEGIX'
const APP_TITLE_TEMPLATE = '%s - STRATEGIX'
const APP_DESCRIPTION = 'STRATEGIX is an AI-powered strategy management tool'

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE
    // startupImage: []
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  }
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF'
}

const isProduction = process.env.NODE_ENV === 'production'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='zh-Hans'>
      <head />
      <body className='antialiased bg-page-bg relative'>
        {!isProduction && <BreakpointDisplay />}
        <NextTopLoader />
        <div id='modal-root' />
        {children}
      </body>
    </html>
  )
}
