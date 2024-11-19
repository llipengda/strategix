import { MdAdd } from 'react-icons/md'

import Link from 'next/link'

import Activity from '@/app/(main)/activity/activity'
import { getBriefActivities } from '@/lib/actions/activity'

const Page = async () => {
  const activities = await getBriefActivities()

  return (
    <div className='flex max-lg:flex-col gap-8'>
      <div className='p-8 bg-white dark:bg-gray-900 rounded-md shadow-md w-full max-lg:w-full'>
        <h1 className='text-3xl font-bold mb-6 flex items-center justify-between'>
          活动
          <Link
            href='/activity/new'
            className='bg-blue-500 text-xl text-white px-4 py-2 rounded-md flex items-center gap-2'
          >
            <MdAdd />
            新建活动
          </Link>
        </h1>
        {activities.length === 0 ? (
          <div className='w-full min-h-56 flex items-center justify-center'>
            <p className='text-center my-auto text-gray-400 italic'>
              暂时没有活动
            </p>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            {activities.map(a => (
              <Activity key={a.id} activity={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
