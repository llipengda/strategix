'use client'

import { useActionState } from 'react'

import type { User } from 'next-auth'

import ErrorMessage from '@/components/error-message'
import Input from '@/components/input'
import SubmitButton from '@/components/submit-button'
import { createPostAction } from '@/lib/actions/post'
import { localFormat } from '@/lib/time'

const AddPosts = ({
  year,
  month,
  day,
  user
}: {
  year: number
  month: number
  day: number
  user: User
}) => {
  const superAdmin = user?.role === 'super-admin'

  const [errors, action] = useActionState(createPostAction, undefined)

  return (
    <form
      action={action}
      className='flex flex-col gap-2 w-2/5 h-fit dark:border-white/20 border-2 rounded-md p-6 max-md:w-full'
    >
      <h2 className='text-2xl font-bold text-center mb-3'>添加推送</h2>
      <div>
        <label htmlFor='title' className='text-label font-bold'>
          标题
        </label>
        <Input id='title' name='title' placeholder='标题' required />
      </div>
      <div>
        <label className={superAdmin ? '' : 'hidden'} htmlFor='team'>
          团队
        </label>
        {superAdmin ? (
          <Input id='team' name='team' placeholder='团队' required />
        ) : (
          <Input type='hidden' id='team' name='team' value={user?.team} />
        )}
      </div>
      <div>
        <label htmlFor='publishDate' className='text-label font-bold'>
          推送日期
        </label>
        <Input
          id='publishDate'
          name='publishDate'
          type='date'
          required
          defaultValue={localFormat(
            new Date(year, month - 1, day),
            'yyyy-MM-dd'
          )}
        />
      </div>
      <div className='flex items-center gap-1 mt-2'>
        <input id='isFrontPage' name='isFrontPage' type='checkbox' />
        头版推送
        <label htmlFor='isFrontPage'></label>
      </div>
      <ErrorMessage errorMessage={errors} />
      <SubmitButton text='添加推送' />
    </form>
  )
}
export default AddPosts
