import { MdEdit } from 'react-icons/md'

import Link from 'next/link'

import Gantt from '@/app/(main)/activity/[id]/gantt'
import Section from '@/app/(main)/activity/[id]/section'
import TasksAndAssignments from '@/app/(main)/activity/[id]/tasks-and-assignments'
import { auth } from '@/auth'
import { getActivity } from '@/lib/actions/activity'
import { role } from '@/lib/role'
import { mergeTasks } from '@/lib/task-process'
import { localFormat } from '@/lib/time'

const Page: React.FC<PageProps> = async ({ params }) => {
  const user = (await auth())?.user

  const id = (await params)?.id as string | undefined

  if (!id) {
    return null
  }

  const fullActivity = await getActivity(id)

  const activity = fullActivity.find(a => a.type === 'activity')
  const tasks = fullActivity.filter(a => a.type === 'task')
  const assignments = fullActivity.filter(a => a.type === 'assignment')

  if (!activity) {
    return null
  }

  const mergedTasks = mergeTasks(tasks, assignments)

  return (
    <>
      <h1 className='text-3xl text-center font-semibold mb-14 flex items-center justify-center gap-2'>
        {activity.name}
        {activity.stage === 'draft' && '（草案）'}
        {role.admin(user) && (
          <Link
            href={`/activity/new?id=${encodeURIComponent(activity.id)}&sk=${encodeURIComponent(activity.sk)}`}
            className='text-blue-500'
          >
            <MdEdit />
          </Link>
        )}
      </h1>
      <div className='space-y-8'>
        <div id='time'>
          <h2 className='text-xl font-bold'>活动时间</h2>
          <div className='p-3'>
            {activity.time && (
              <p>{localFormat(activity.time, 'yyyy年MM月dd日 HH:mm')}</p>
            )}
            {activity.timeRange && (
              <p>
                {localFormat(activity.timeRange[0], 'yyyy年MM月dd日')} -{' '}
                {localFormat(activity.timeRange[1], 'yyyy年MM月dd日')}
              </p>
            )}
          </div>
        </div>
        {activity.sections.map((section, index) => (
          <Section key={index} section={section} />
        ))}
        <TasksAndAssignments mergedTasks={mergedTasks} />
        {activity.stage === 'preparing' && (
          <Link
            href={`/activity/${activity.id}/assignment`}
            className='bg-blue-500 text-white px-4 py-2 rounded-md block text-center text-lg font-semibold'
          >
            任务分配
          </Link>
        )}
        <div className='overflow-x-auto'>
          <Gantt tasks={mergedTasks} />
        </div>
      </div>
    </>
  )
}

export default Page
