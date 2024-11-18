'use client'

import { use, useState } from 'react'

import { useRouter } from 'nextjs-toploader/app'

import { KeyContext } from '@/app/(main)/activity/new/key-context'
import { updateActivityAction } from '@/lib/actions/activity'

const Publish = () => {
  const { key } = use(KeyContext)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePublish = async () => {
    if (!key) return

    setIsLoading(true)

    await updateActivityAction(key, {
      stage: 'preparing'
    })

    setIsLoading(false)

    router.push('/activity')
  }

  return (
    <button
      className='mt-4 w-full bg-blue-500 text-white p-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-600'
      onClick={handlePublish}
      disabled={isLoading}
    >
      {isLoading ? '发布中...' : '发布'}
    </button>
  )
}

export default Publish
