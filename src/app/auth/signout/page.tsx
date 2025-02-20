import React from 'react'

import { signOut } from '@/auth'
import SubmitButton from '@/components/submit-button'

const Page = async (props: PageProps) => {
  const searchParams = await props.searchParams
  const callbackUrl = searchParams?.callbackUrl || '/'

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-title'>
        确定要登出？
      </h2>
      <p className='text-center text-title'>您的登录状态将被清除</p>
      <form
        action={async () => {
          'use server'
          await signOut({ redirectTo: callbackUrl })
        }}
      >
        <SubmitButton text='确认登出' />
      </form>
    </>
  )
}

export default Page
