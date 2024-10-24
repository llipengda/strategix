'use client'

import { useFormState } from 'react-dom'

import { useReCaptcha } from 'next-recaptcha-v3'

import ErrorMessage from '@/components/error-message'
import Input from '@/components/input'
import SubmitButton from '@/components/submit-button'
import { authenticateByResend } from '@/lib/actions/user'

export default function EmailForm({ callbackUrl }: { callbackUrl: string }) {
  const { executeRecaptcha } = useReCaptcha()

  const added = async (_: unknown, formData: FormData) => {
    let gRecaptchaToken = ''
    if (executeRecaptcha) {
      gRecaptchaToken = await executeRecaptcha('contactMessage')
    }
    formData.set('captcha', gRecaptchaToken)

    return authenticateByResend(formData, callbackUrl)
  }

  const [error, dispatch] = useFormState(added, undefined)
  return (
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
  )
}
