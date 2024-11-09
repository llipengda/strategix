'use client'

import { useEffect, useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import _pages from '@/app/(main)/pages'
import { createPortal } from 'react-dom'

const pages = [{ name: '首页', url: '/' }, ..._pages]

const MdNav = () => {
  const pathname = usePathname()

  const [open, setOpen] = useState(false)

  const current = pages.find(item => item.url === pathname)

  const menuSwitcher = () => {
    console.log('open', open)
    setOpen(!open)
  }

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <div
        className='flex flex-row items-center text-xl font-bold cursor-pointer'
        onClick={menuSwitcher}
      >
        <IoIosArrowForward
          className={`transition-all duration-200 ease-in-out ml-2 my-2 ${open ? 'rotate-90' : 'rotate-0'}`}
        />
        <h1 className='text-title ml-2 my-2'>{current?.name}</h1>
      </div>

            <div className={`h-[100vh] absolute w-full z-50 bg-black/50 my-2 dark:bg-black/70 ${open ? '' : 'hidden'}`} onClick={menuSwitcher} />
            <ul
              className={`pt-4 absolute -ml-[60%] left-0 z-50 w-[60%] h-[100vh] bg-page-bg transition-all duration-200 ease-in-out px-4 overflow-hidden ${open ? 'translate-x-full' : '-translate-x-full'}`}
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
