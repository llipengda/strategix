'use client'

import { useEffect } from 'react'
import { FaGithub } from 'react-icons/fa'

import NProgress from 'nprogress'

import { gitHibSignin } from '@/lib/actions/user'

const GitHubSigninForm = ({ callbackUrl }: { callbackUrl: string }) => {
  useEffect(() => {
    return () => {
      if (NProgress.isStarted()) {
        NProgress.done()
      }
    }
  }, [])

  return (
    <>
      <form
        className='w-full'
        action={async () => {
          NProgress.start()
          await gitHibSignin(callbackUrl)
        }}
      >
        <button
          className='text-center w-full px-4 py-2 font-bold text-gray-500 bg-gray-300 rounded-md flex items-center justify-center gap-2 dark:bg-gray-600 dark:text-gray-200'
          type='submit'
        >
          <FaGithub className='text-xl' /> 通过 GitHub 登录
        </button>
      </form>
    </>
  )
}

export default GitHubSigninForm
