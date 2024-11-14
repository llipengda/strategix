import Section from '@/app/(main)/activity/[id]/section'
import TasksAndAssignments from '@/app/(main)/activity/[id]/tasks-and-assignments'
import { getActivity } from '@/lib/actions/activity'
import { localFormat } from '@/lib/time'

const Page: React.FC<PageProps> = async ({ params }) => {
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

  return (
    <>
      <h1 className='text-3xl text-center font-semibold mb-14'>
        {activity.name}
        {activity.stage === 'draft' && '（草案）'}
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
        <TasksAndAssignments tasks={tasks} assignments={assignments} />
      </div>
    </>
  )
}

export default Page
