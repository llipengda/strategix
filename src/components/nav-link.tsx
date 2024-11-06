'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavLink = ({
  children,
  href
}: Readonly<{
  children: React.ReactNode
  href: string
}>) => {
  const pathname = usePathname()

  const isActive = pathname.split('/')[1] === href.slice(1)

  return (
    <Link
      href={href}
      className={`flex items-center p-4 text-label hover:bg-gray-200 hover:font-semibold rounded-md transition duration-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700 font-semibold' : ''}`}
    >
      {children}
    </Link>
  )
}

export default NavLink
