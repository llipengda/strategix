import React from 'react'

import SigninForm from '@/app/auth/signin/signin-form'

const Page = ({ searchParams }: Page) => {
  const callbackUrl = searchParams?.callbackUrl

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-title'>
        登入以使用更多功能
      </h2>
      <SigninForm callbackUrl={callbackUrl} />
    </>
  )
}

export default Page
