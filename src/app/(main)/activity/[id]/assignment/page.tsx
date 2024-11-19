import Choice from '@/app/(main)/activity/[id]/assignment/choice'
import TasksSummary from '@/app/(main)/activity/[id]/assignment/task-summary'
import TasksAndAssignments from '@/app/(main)/activity/[id]/tasks-and-assignments'
import { auth } from '@/auth'
import { getActivity } from '@/lib/actions/activity'
import { role } from '@/lib/role'
import { getTasksByUser, mergeTasks } from '@/lib/task-process'

const Page: React.FC<PageProps> = async ({ params }) => {
  const id = (await params)?.id as string | undefined
  const session = await auth()

  if (!id || !session?.user) {
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
  const tasksByUser = getTasksByUser(mergedTasks)

  return (
    <div>
      <h1 className='text-3xl text-center font-semibold mb-14'>
        任务分配 - {activity.name}
      </h1>
      <TasksAndAssignments mergedTasks={mergedTasks} />
      <TasksSummary tasksByUser={tasksByUser} activityId={id} />
      {!role.admin(session.user) && (
        <Choice
          activityId={id}
          tasksByUser={tasksByUser}
          userId={session.user.id}
        />
      )}
      {role.admin(session.user) && (
        <button className='mt-8 bg-blue-500 w-full text-white px-4 py-2 rounded-md'>
          结束分配选择
        </button>
      )}
    </div>
  )
}

export default Page
