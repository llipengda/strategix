import type { Metadata } from 'next'
import Image from 'next/image'
import NextTopLoader from 'nextjs-toploader'

import icon from '@/app/favicon.ico'
import '@/app/globals.css'
import NavLink from '@/components/nav-link'

export const metadata: Metadata = {
  title: 'Strategix',
  description: 'Strategix is a platform for managing your strategy'
}

const pages: {
  name: string
  url: string
}[] = [{ name: '团队', url: '/team' }]

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='zh_cn'>
      <body className='antialiased bg-page-bg'>
        <NextTopLoader />
        <div className='flex h-screen bg-page-bg max-w-[80%] mx-auto py-10'>
          <nav className='hidden md:block w-64'>
            <div className='p-4 flex items-center justify-start gap-4'>
              <Image src={icon} alt='icon' className='w-1/5' />
              <h1 className='text-lg font-semibold text-title'>STRATEGIX</h1>
            </div>

            <ul className='mt-6'>
              {pages.map(item => (
                <li key={item.url}>
                  <NavLink href={item.url}>{item.name}</NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className='w-px bg-gray-300 mx-4 dark:bg-gray-600 hidden md:block' />
          <div className='flex-1 p-6'>{children}</div>
        </div>
      </body>
    </html>
  )
}
