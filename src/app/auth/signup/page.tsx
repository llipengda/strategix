'use client'

import { useFormState } from 'react-dom'

import { Turnstile } from '@marsidev/react-turnstile'

import ErrorMessage from '@/components/error-message'
import SubmitButton from '@/components/submit-button'
import { authenticateByResend } from '@/lib/user'
import type SearchParams from '@/types/search-params'

const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  const callbackUrl = (searchParams.callbackUrl as string | undefined) || '/'

  const authenticate = authenticateByResend.bind(null, callbackUrl)

  const [error, dispatch] = useFormState(authenticate, undefined)

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-gray-800'>
        注册新用户
      </h2>
      <form className='space-y-4' action={dispatch}>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700'
        >
          电子邮箱
        </label>
        <input
          id='email'
          name='email'
          type='email'
          required
          className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
        />
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          options={{ size: 'flexible' }}
        />
        <ErrorMessage errorMessage={error} />
        <SubmitButton text='确定' />
      </form>
    </>
  )
}

export default Page
