'use client'

import { useFormState } from 'react-dom'

import { useReCaptcha } from 'next-recaptcha-v3'

import ErrorMessage from '@/components/error-message'
import Input from '@/components/input'
import SubmitButton from '@/components/submit-button'
import { authenticateByResend } from '@/lib/actions/user'

const Page = ({ searchParams }: Page) => {
  const callbackUrl = searchParams?.callbackUrl || '/'

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
      <h2 className='text-2xl font-bold text-center text-title'>注册新用户</h2>
      <p className='text-center text-sm text-disabled'>
        如果您已经注册，此操作将使您<strong>登录</strong>到已有账号
      </p>
      <form className='space-y-4' action={dispatch}>
        <label htmlFor='email' className='block text-sm font-medium text-label'>
          电子邮箱
        </label>
        <Input
          id='email'
          name='email'
          type='email'
          autoComplete='email'
          required
        />
        <ErrorMessage errorMessage={error} />
        <SubmitButton text='确定' />
      </form>
    </>
  )
}

export default Page
