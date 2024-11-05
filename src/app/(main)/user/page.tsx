import { MdDeleteForever, MdLogout } from 'react-icons/md'

import Link from 'next/link'

import UserInfo from '@/app/(main)/user/user-info'
import { getCurrentUser } from '@/lib/actions/user'

const Page = async () => {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return (
    <>
      <h1 className='text-title text-3xl'>
        欢迎，<span className='font-semibold'>{user.name}</span>
      </h1>
      <div className='flex flex-row w-full gap-6 max-md:flex-col'>
        <UserInfo user={user} currentUser={user} />
        <div className='flex gap-4 flex-col'>
          <Link
            className='flex gap-1 items-center justify-center flex-row mt-8 px-4 py-2 font-bold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap h-fit bg-blue-600 shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-2xl'
            href='/auth/signout'
          >
            <MdLogout />
            登出
          </Link>
          <Link
            className='flex gap-1 items-center justify-center flex-row px-4 py-2 font-bold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 whitespace-nowrap h-fit bg-red-600 shadow-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-2xl'
            href='/auth/delete-forever'
          >
            <MdDeleteForever />
            永久删除
          </Link>
        </div>
      </div>
    </>
  )
}

export default Page
