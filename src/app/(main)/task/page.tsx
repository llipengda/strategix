import { MdAdd } from 'react-icons/md'

import Link from 'next/link'

import { getTaskTemplates } from '@/lib/actions/task'

import Task from './task'

const Page = async () => {
  const tasks = await getTaskTemplates()

  return (
    <div className='flex max-lg:flex-col gap-8'>
      <div className='p-8 bg-white dark:bg-gray-900 rounded-md shadow-md w-full max-lg:w-full'>
        <h1 className='text-3xl font-bold mb-6 flex items-center justify-between'>
          任务模板
          <Link
            href='/task/new'
            className='bg-blue-500 text-xl text-white px-4 py-2 rounded-md flex items-center gap-2'
          >
            <MdAdd />
            新建任务模板
          </Link>
        </h1>
        {tasks.length === 0 ? (
          <div className='w-full min-h-56 flex items-center justify-center'>
            <p className='text-center my-auto text-gray-400 italic'>
              暂时没有任务模板
            </p>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            {tasks.map(t => (
              <Task key={t.id} task={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
