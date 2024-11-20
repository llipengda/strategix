import Content from '@/app/(main)/activity/new/content'
import { KeyContextProvider } from '@/app/(main)/activity/new/key-context'
import { getActivity } from '@/lib/actions/activity'
import { getTeam } from '@/lib/actions/team'
import type { Activity } from '@/types/activity/activity'
import type { Assignment } from '@/types/activity/assignment'
import type { Task } from '@/types/activity/task'

const Page: React.FC<PageProps> = async ({ searchParams }) => {
  const id = (await searchParams)?.id
  const sk = (await searchParams)?.sk

  const team = await getTeam()

  if (!team) {
    return <div>您不在任何团队中</div>
  }

  let activity: Activity | null = null
  let tasks: Task[] = []
  let assignments: Assignment[] = []

  if (id) {
    const fullActivity = await getActivity(id)

    const found = fullActivity.find(a => a.type === 'activity')
    tasks = fullActivity.filter(a => a.type === 'task')
    assignments = fullActivity.filter(a => a.type === 'assignment')

    if (found) {
      activity = found
    }
  }

  return (
    <div>
      <h1 className='text-3xl text-center font-semibold mb-14'>
        {id ? `${activity?.name} - 编辑草案` : '创建新活动'}
      </h1>
      <div className='space-y-8'>
        <KeyContextProvider initialKey={id && sk ? { id, sk } : undefined}>
          <Content
            activity={activity}
            team={team}
            tasks={tasks}
            assignments={assignments}
          />
        </KeyContextProvider>
      </div>
    </div>
  )
}

export default Page
