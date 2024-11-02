'use client'

import { useEffect, useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import _pages from '@/app/(main)/pages'

const pages = [{ name: '首页', url: '/' }, ..._pages]

const MdNav = () => {
  const pathname = usePathname()

  const [open, setOpen] = useState(false)

  const current = pages.find(item => item.url === pathname)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <div
        className='flex flex-row items-center text-xl font-bold cursor-pointer'
        onClick={() => setOpen(!open)}
      >
        <IoIosArrowForward
          className={`transition-all duration-300 ease-in-out ${open ? 'rotate-90' : 'rotate-0'}`}
        />
        <h1 className='text-title ml-2'>{current?.name}</h1>
      </div>
      <div className='h-px bg-gray-300 my-2 dark:bg-gray-600' />
      <ul
        className={`transition-all duration-200 ease-in-out px-8 overflow-hidden ${open ? 'h-full' : 'h-0'}`}
      >
        {pages.map(item => (
          <li key={item.url}>
            <Link
              href={item.url}
              className={`flex flex-row items-center text-md my-2 border-b border-gray-300 p-1 px-2 text-title ${pathname === item.url ? 'font-bold' : ''}`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default MdNav
