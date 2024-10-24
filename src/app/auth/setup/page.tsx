'use client'

import { use, useActionState, useState } from 'react'

import { useSession } from 'next-auth/react'

import ErrorMessage from '@/components/error-message'
import Input from '@/components/input'
import SubmitButton from '@/components/submit-button'
import { addUser } from '@/lib/actions/user'

const Page = (props: Page) => {
  const searchParams = use(props.searchParams!)
  const [error, dispatch] = useActionState(
    addUser.bind(undefined, searchParams?.callbackUrl),
    undefined
  )

  const [checked, setChecked] = useState(true)

  const handleChange = () => setChecked(!checked)

  const { data: session } = useSession()

  const email = session?.user?.email || ''

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-title'>
        完善您的信息
      </h2>
      <form className='space-y-4' action={dispatch}>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-label'
          >
            电子邮箱
          </label>
          <Input
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            required
            disabled
            value={email}
          />
        </div>

        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-label'
          >
            姓名
          </label>
          <Input
            id='name'
            name='name'
            type='text'
            autoComplete='name'
            required
          />
        </div>

        <div className='flex items-center'>
          <input
            id='usePassword'
            name='usePassword'
            type='checkbox'
            checked={checked}
            onChange={handleChange}
            className='h-4 w-4 text-main border-input-bd rounded'
          />
          <label
            htmlFor='usePassword'
            className='ml-2 block text-sm text-title'
          >
            <strong>创建密码</strong>以便今后使用密码登录（可选）
          </label>
        </div>

        {checked && (
          <>
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
          </>
        )}

        <ErrorMessage errorMessage={error} />
        <SubmitButton text='提交' />
      </form>
    </>
  )
}

export default Page
