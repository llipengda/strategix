'use client'

import { useActionState } from 'react'

import ErrorMessage from '@/components/error-message'
import Input from '@/components/input'
import SubmitButton from '@/components/submit-button'
import { resetPasswordAction } from '@/lib/actions/user'

export default function ResetForm({ email }: { email: string }) {
  const [error, dispatch] = useActionState(resetPasswordAction, undefined)

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
          readOnly
          value={email}
        />
      </div>

      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-label'
        >
          密码
          <span className='text-sm text-disabled italic'>
            &nbsp;* 至少 8 个字符
          </span>
        </label>
        <Input
          id='password'
          name='password'
          type='password'
          autoComplete='new-password'
        />
      </div>

      <div>
        <label
          htmlFor='confirmPassword'
          className='block text-sm font-medium text-label'
        >
          确认密码
        </label>
        <Input
          id='confirmPassword'
          name='confirmPassword'
          type='password'
          autoComplete='new-password'
        />
      </div>

      <ErrorMessage errorMessage={error} />
      <SubmitButton text='提交' />
    </form>
  )
}
