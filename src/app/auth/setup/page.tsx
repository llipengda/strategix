'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'

import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

import ErrorMessage from '@/components/error-message'
import SubmitButton from '@/components/submit-button'
import { addUser } from '@/lib/user'

const Page = () => {
  const callbackUrl = useSearchParams().get('callbackUrl') || '/'

  const { update } = useSession()

  const add = addUser.bind(undefined, callbackUrl, update)

  const [error, dispatch] = useFormState(add, undefined)

  const [checked, setChecked] = useState(true)

  const handleChange = () => setChecked(!checked)

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-gray-800'>
        完善您的信息
      </h2>
      <form className='space-y-4' action={dispatch}>
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700'
          >
            姓名
          </label>
          <input
            id='name'
            name='name'
            type='text'
            required
            className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        <div className='flex items-center'>
          <input
            id='usePassword'
            name='usePassword'
            type='checkbox'
            checked={checked}
            onChange={handleChange}
            className='h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
          />
          <label
            htmlFor='usePassword'
            className='ml-2 block text-sm text-gray-700'
          >
            <strong>创建密码</strong>以便今后使用密码登录（可选）
          </label>
        </div>

        {checked && (
          <>
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                密码
                <span className='text-sm text-gray-500 italic'>
                  &nbsp;* 至少 8 个字符
                </span>
              </label>
              <input
                id='password'
                name='password'
                type='password'
                className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              />
            </div>

            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700'
              >
                确认密码
              </label>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </>
        )}

        <ErrorMessage errorMessage={error} />
        <SubmitButton text='提交' />
      </form>
    </>
  )
}

export default Page
