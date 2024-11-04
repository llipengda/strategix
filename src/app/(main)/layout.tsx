import type { Metadata } from 'next'
import Image from 'next/image'
import NextTopLoader from 'nextjs-toploader'

import MdNav from '@/app/(main)/md-nav'
import pages from '@/app/(main)/pages'
import icon from '@/app/favicon.ico'
import '@/app/globals.css'
import NavLink from '@/components/nav-link'

export const metadata: Metadata = {
  title: 'Strategix',
  description: 'Strategix is a platform for managing your strategy'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='zh-Hans'>
      <body className='antialiased bg-page-bg'>
        <NextTopLoader />
        <main>
          <div className='flex bg-page-bg max-w-[80%] mx-auto max-md:flex-col max-md:h-screen relative'>
            {/* > md */}
            <nav className='hidden md:block w-72 sticky py-10 top-0 h-screen'>
              <div className='border-r border-gray-300 pr-10 h-full'>
                <div className='p-4 flex items-center justify-start gap-4'>
                  <Image src={icon} alt='icon' className='w-1/5' />
                  <h1 className='text-lg font-semibold text-title'>
                    STRATEGIX
                  </h1>
                </div>
                <ul className='mt-6'>
                  {pages.map(item => (
                    <li key={item.url}>
                      <NavLink href={item.url}>{item.name}</NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
            {/* < md */}
            <nav className='block md:hidden mt-10'>
              <MdNav />
            </nav>
            <div className='flex-1 p-6 py-16 pl-10 max-md:px-2'>{children}</div>
          </div>
        </main>
      </body>
    </html>
  )
}
