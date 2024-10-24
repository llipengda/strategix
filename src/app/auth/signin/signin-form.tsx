'use client'

import { useFormState } from 'react-dom'

import Link from 'next/link'

import ErrorMessage from '@/components/error-message'
import Input from '@/components/input'
import SubmitButton from '@/components/submit-button'
import { authenticateByCredentials } from '@/lib/actions/user'

export default function SigninForm({ callbackUrl }: { callbackUrl?: string }) {
  const [errorMessage, dispatch] = useFormState(
    authenticateByCredentials.bind(undefined, callbackUrl),
    undefined
  )
  return (
    <form className='space-y-4' action={dispatch}>
      <div>
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
      </div>

      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-label'
        >
          密码
        </label>
        <Input
          id='password'
          name='password'
          type='password'
          autoComplete='current-password'
          required
        />
      </div>

      <div className='flex items-center justify-between'>
        <Link
          href='#'
          className='text-sm font-semibold text-main hover:underline'
        >
          忘记密码？
        </Link>
        <p className='text-sm text-disabled'>
          没有账号？
          <Link
            href='/auth/signup'
            className='font-semibold text-main hover:underline'
          >
            注册
          </Link>
        </p>
      </div>

      <ErrorMessage errorMessage={errorMessage} />

      <SubmitButton text='登录' />
    </form>
  )
}
