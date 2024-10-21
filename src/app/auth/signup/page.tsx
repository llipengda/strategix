'use client'

import { useFormState } from 'react-dom'

import { useReCaptcha } from 'next-recaptcha-v3'

import ErrorMessage from '@/components/error-message'
import SubmitButton from '@/components/submit-button'
import { authenticateByResend } from '@/lib/user'
import type SearchParams from '@/types/search-params'

const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  const callbackUrl = (searchParams.callbackUrl as string | undefined) || '/'

  const authenticate = authenticateByResend.bind(null, callbackUrl)

  const { executeRecaptcha } = useReCaptcha()

  const added = async (_: unknown, formData: FormData) => {
    let gRecaptchaToken = ''
    if (executeRecaptcha) {
      gRecaptchaToken = await executeRecaptcha('contactMessage')
    }
    formData.set('captcha', gRecaptchaToken)

    return authenticate(_, formData)
  }

  const [error, dispatch] = useFormState(added, undefined)

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-gray-800'>
        注册新用户
      </h2>
      <p className='text-center text-sm text-gray-500'>
        如果您已经注册，此操作将使您<strong>登录</strong>到已有账号
      </p>
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
          autoComplete='email'
          required
          className='w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
        />
        <ErrorMessage errorMessage={error} />
        <SubmitButton text='确定' />
      </form>
    </>
  )
}

export default Page
