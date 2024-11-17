import { notFound } from 'next/navigation'

import { getTaskById } from '@/lib/actions/activity'

import TaskForm from './task-form'

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams

  const id = searchParams?.id
  const taskId = searchParams?.taskId

  if (!id) {
    return notFound()
  }

  const task = taskId ? await getTaskById(id, taskId) : null

  return (
    <div>
      <h1 className='text-3xl font-semibold text-gray-800 mb-6'>创建任务</h1>
      <TaskForm id={id} task={task} />
    </div>
  )
}
