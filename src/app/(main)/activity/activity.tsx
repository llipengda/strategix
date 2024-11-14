import Link from 'next/link'

import Assignment from '@/app/(main)/activity/assignment'
import { auth } from '@/auth'
import { type BriefActivity, getAssignments } from '@/lib/actions/activity'
import { localFormat } from '@/lib/time'

interface ActivityProps {
  activity: BriefActivity
}

const stageMap = {
  draft: '草案',
  inProgress: '进行中',
  completed: '已完成',
  archived: '已归档'
}

const Activity: React.FC<ActivityProps> = async ({ activity }) => {
  const userId = (await auth())?.user.id

  if (!userId) {
    return null
  }

  const assignments = await getAssignments(activity.id, userId)

  const isDraft = activity.stage === 'draft'
  const isInProgress = activity.stage === 'inProgress'
  const isCompleted = activity.stage === 'completed'

  return (
    <Link
      className={`${
        isDraft
          ? 'bg-slate-300'
          : isInProgress
            ? 'bg-green-50'
            : isCompleted
              ? 'bg-blue-50'
              : 'bg-yellow-50'
      } w-full p-4 rounded-md shadow-md space-y-2 block`}
      href={`/activity/${activity.id}`}
    >
      <h2 className='text-xl font-bold'>
        <span
          className={`text-base p-1 rounded-md font-medium mr-2 ${
            isDraft
              ? 'bg-slate-200 text-slate-700'
              : isInProgress
                ? 'bg-green-100 text-green-700'
                : isCompleted
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {stageMap[activity.stage]}
        </span>
        {activity.name}
      </h2>
      <div>
        {!isCompleted ? '预计' : '已'}于{' '}
        {activity.time && localFormat(activity.time, 'yyyy-MM-dd')}
        {activity.timeRange && (
          <span>
            {localFormat(activity.timeRange[0], 'yyyy-MM-dd')} -{' '}
            {localFormat(activity.timeRange[1], 'yyyy-MM-dd')}
          </span>
        )}{' '}
        举办
      </div>
      {assignments.length > 0 && (
        <div className='bg-gray-100 p-2 rounded-md px-4'>
          <div className='font-bold border-b border-gray-500'>您的任务</div>
          <div className='space-y-2 mt-1'>
            {assignments.map((a, index) => (
              <Assignment key={index} assignment={a} />
            ))}
          </div>
        </div>
      )}
      <div className='text-gray-400 italic text-sm'>{activity.team}</div>
    </Link>
  )
}

export default Activity
