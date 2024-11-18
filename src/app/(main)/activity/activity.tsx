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
  preparing: '筹备中',
  inProgress: '进行中',
  completed: '已完成',
  archived: '已归档'
}

const backgroundMap = {
  draft: 'bg-slate-300',
  preparing: 'bg-purple-50',
  inProgress: 'bg-green-50',
  completed: 'bg-blue-50',
  archived: 'bg-yellow-50'
}

const spanClassMap = {
  draft: 'bg-slate-200 text-slate-700',
  preparing: 'bg-purple-200 text-purple-700',
  inProgress: 'bg-green-200 text-green-700',
  completed: 'bg-blue-200 text-blue-700',
  archived: 'bg-yellow-200 text-yellow-700'
}

const Activity: React.FC<ActivityProps> = async ({ activity }) => {
  const userId = (await auth())?.user.id

  if (!userId) {
    return null
  }

  const assignments = await getAssignments(activity.id, userId)

  const isDraft = activity.stage === 'draft'
  const isCompleted = activity.stage === 'completed'

  return (
    <Link
      className={`${backgroundMap[activity.stage]} w-full p-4 rounded-md shadow-md space-y-2 block`}
      href={
        isDraft
          ? `/activity/new?id=${activity.id}&sk=${encodeURIComponent(activity.sk)}`
          : `/activity/${activity.id}`
      }
    >
      <h2 className='text-xl font-bold'>
        <span
          className={`text-base p-1 rounded-md font-medium mr-2 ${spanClassMap[activity.stage]}`}
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
