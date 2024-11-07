import React from 'react'

import SubmitButton from '@/components/submit-button'
import { deleteUser } from '@/lib/actions/user'

const Page = () => {
  return (
    <>
      <h2 className='text-2xl font-bold text-center text-title !text-red-500'>
        要
        <b>
          <em>永久</em>
        </b>
        删除账号吗？
      </h2>
      <p className='text-center text-title'>
        此操作不可逆，您的账号数据将无法恢复
      </p>
      <form action={deleteUser}>
        <SubmitButton className='!bg-red-500' text='确认' />
      </form>
    </>
  )
}

export default Page
