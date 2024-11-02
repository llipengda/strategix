import React from 'react'
import { MdEmail } from 'react-icons/md'

import Link from 'next/link'

import GitHubSigninForm from './github-signin-form'
import Signed from './signed'
import SigninForm from './signin-form'
import { auth } from '@/auth'

const Page = async (props: Page) => {
  const searchParams = await props.searchParams
  const callbackUrl = searchParams?.callbackUrl || '/'

  const session = await auth()

  if (session?.user) {
    return <Signed callbackUrl={callbackUrl} />
  }

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-title'>
        登入以使用更多功能
      </h2>
      <SigninForm callbackUrl={callbackUrl} />
      <div className='relative my-8'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gray-300 dark:border-gray-500'></div>
        </div>
        <div className='relative flex justify-center'>
          <span className='bg-card-bg px-4 text-gray-500'>或</span>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <Link
          className='text-center w-full px-4 py-2 font-bold text-gray-500 bg-gray-300 rounded-md flex items-center justify-center gap-2 dark:bg-gray-600 dark:text-gray-200'
          href={`/auth/signin/email?callbackUrl=${callbackUrl}`}
        >
          <MdEmail className='text-xl' /> 通过电子邮件登录
        </Link>
        <GitHubSigninForm callbackUrl={callbackUrl} />
      </div>
    </>
  )
}

export default Page
