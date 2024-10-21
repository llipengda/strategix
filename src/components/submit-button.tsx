'use client'

import { useFormStatus } from 'react-dom'

const SubmitButton = ({ text }: { text: string }) => {
  const { pending } = useFormStatus()

  return (
    <button
      disabled={pending}
      type='submit'
      className={`w-full px-4 py-2 font-semibold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        pending
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {pending ? '处理中...' : text}
    </button>
  )
}

export default SubmitButton
