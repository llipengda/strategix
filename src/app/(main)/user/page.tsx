import { MdDeleteForever, MdLogout, MdOutlineSecurity } from 'react-icons/md'

import Link from 'next/link'

import UserInfo from '@/app/(main)/user/user-info'
import Card from '@/components/card'
import { getCurrentUser } from '@/lib/actions/user'

const Page = async () => {
  const user = await getCurrentUser()

  const hasPassword = !!user?.password

  if (!user) {
    return null
  }

  return (
    <>
      <h1 className='text-title text-3xl'>
        欢迎，<span className='font-semibold'>{user.name}</span>
      </h1>
      <div className='flex flex-row w-full gap-6 max-lg:flex-col max-lg:gap-4'>
        <UserInfo user={user} currentUser={user} />
        <Card
          hoverAnimation={false}
          className='flex flex-col mt-8 max-lg:mt-0 !p-0 h-fit border-2 shadow-none bg-slate-50 dark:bg-slate-900 overflow-hidden dark:border-white/10 *:dark:border-white/10'
        >
          <Link
            className='flex gap-4 items-center border-b-2 p-4 px-8 hover:text-white hover:bg-blue-500 transition-colors ease-in-out hover:font-bold'
            href='/auth/signout'
          >
            <MdLogout className='text-xl' />
            登出
          </Link>
          <Link
            className='flex gap-4 items-center border-b-2 p-4 px-8 hover:text-white hover:bg-blue-500 transition-colors ease-in-out hover:font-bold'
            href={`/auth/reset-password?reset=${hasPassword}`}
          >
            <MdOutlineSecurity className='text-xl' />
            {hasPassword ? '重设' : '设置'}密码
          </Link>
          <Link
            className='flex gap-4 items-center p-4 px-8 hover:text-white hover:bg-red-500 transition-colors ease-in-out hover:font-bold'
            href='/auth/unregister'
          >
            <MdDeleteForever className='text-xl' />
            永久删除
          </Link>
        </Card>
      </div>
    </>
  )
}

export default Page
