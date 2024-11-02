'use client'

import { useEffect } from 'react'
import { useFormStatus } from 'react-dom'

import NProgress from 'nprogress'

type SubmitButtonProps = {
  text: string
  disabled?: boolean
  className?: string
}

const SubmitButton = ({
  text,
  className = '',
  disabled = false
}: SubmitButtonProps) => {
  const { pending } = useFormStatus()

  useEffect(() => {
    if (pending) {
      NProgress.start()
    } else {
      NProgress.done()
    }

    return () => {
      NProgress.done()
    }
  }, [pending])

  return (
    <button
      disabled={pending || disabled}
      type='submit'
      className={`w-full px-4 py-2 font-semibold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        pending || disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700'
      } ${className}`}
    >
      {pending ? '处理中...' : text}
    </button>
  )
}

export default SubmitButton
