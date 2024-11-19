'use client'

import { use, useState } from 'react'

import { useRouter } from 'nextjs-toploader/app'

import { KeyContext } from '@/app/(main)/activity/new/key-context'
import { updateActivityAction } from '@/lib/actions/activity'
import type { Activity } from '@/types/activity/activity'

const Publish = ({ stage }: { stage: Activity['stage'] }) => {
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
      className='mt-4 w-full bg-blue-500 text-white p-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-600'
      onClick={handlePublish}
      disabled={isLoading || stage !== 'draft'}
    >
      {stage === 'draft' ? <>{isLoading ? '发布中...' : '发布'}</> : '已发布'}
    </button>
  )
}

export default Publish
