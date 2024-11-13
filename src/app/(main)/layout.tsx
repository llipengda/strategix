import Image from 'next/image'
import Link from 'next/link'

import MdNav from '@/app/(main)/md-nav'
import pages from '@/app/(main)/routes'
import icon from '@/app/favicon.ico'
import '@/app/globals.css'
import NavLink from '@/components/nav-link'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main>
      <div className='flex bg-page-bg mx-auto max-md:flex-col max-md:h-screen relative'>
        <div className='h-full w-[5%] max-md:hidden'></div>
        {/* > md */}
        <nav className='hidden md:block w-72 sticky top-0 h-screen'>
          <div className='border-r border-gray-300 dark:border-gray-700 py-10 pr-10 h-full'>
            <Link href='/'>
              <div className='p-4 flex items-center justify-start gap-4'>
                <Image src={icon} alt='icon' className='w-1/5' />
                <h1 className='text-lg font-semibold text-title'>STRATEGIX</h1>
              </div>
            </Link>
            <ul className='mt-6 gap-2 flex flex-col'>
              {pages.map(item => (
                <li key={item.url}>
                  <NavLink href={item.url}>{item.name}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        {/* < md */}
        <nav className='block md:hidden sticky top-0 overflow-y-visible z-40 bg-page-bg shadow-md'>
          <MdNav />
        </nav>
        <div className='flex-1 p-16 max-md:px-2 max-md:py-4 max-md:bg-page-bg bg-slate-50 dark:bg-slate-900'>
          {children}
        </div>
      </div>
    </main>
  )
}
