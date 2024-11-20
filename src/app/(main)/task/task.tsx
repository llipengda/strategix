import Link from 'next/link'

import type { TaskTemplate } from '@/types/activity/task'

interface TaskProps {
  task: TaskTemplate
}

export default function Task({ task }: TaskProps) {
  return (
    <Link
      href={`/task/new?id=${task.id}`}
      className='p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700'
    >
      <h3 className='text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100'>
        {task.name}
      </h3>
      <div className='flex gap-6 text-gray-600 dark:text-gray-400'>
        <div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg'>
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
            />
          </svg>
          <span className='font-medium'>{task.requiredPeople}</span>
          <span>人</span>
        </div>
        <div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg'>
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
            />
          </svg>
          <span className='font-medium'>{task.stages.length}</span>
          <span>个流程</span>
        </div>
      </div>
    </Link>
  )
}
