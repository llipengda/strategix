import React from 'react'

import { signOut } from '@/auth'
import type SearchParams from '@/types/search-params'
import SubmitButton from '@/components/submit-button'

const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  const callbackUrl = (searchParams.callbackUrl || '/') as string

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-gray-800'>确定要登出？</h2>
      <p className='text-center'>您的登录状态将被清除</p>
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
