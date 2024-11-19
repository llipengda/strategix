import { auth } from '@/auth'
import { getGroupedPreferences } from '@/lib/actions/activity'
import { role } from '@/lib/role'
import { type TasksByUser } from '@/lib/task-process'
import { localFormat } from '@/lib/time'

interface TasksSummaryProps {
  tasksByUser: TasksByUser
  activityId: string
}

const TasksSummary: React.FC<TasksSummaryProps> = async ({
  tasksByUser,
  activityId
}) => {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  const isAdmin = role.admin(session.user)

  let groupedPreference: Record<string, number> = {}
  if (isAdmin) {
    groupedPreference = await getGroupedPreferences(activityId)
  }

  return (
    <div>
      <h2 className='text-xl font-bold mt-8'>分工小结</h2>
      <div className='overflow-x-auto p-3 mt-2'>
        <table className='w-full text-left border-collapse overflow-hidden rounded-lg'>
          <thead>
            <tr className='bg-blue-100 text-black'>
              <th className='py-4 px-6 font-semibold tracking-wider'>分配</th>
              <th className='py-4 px-6 font-semibold tracking-wider'>任务</th>
              <th className='py-4 px-6 font-semibold tracking-wider'>
                截止时间
              </th>
              {isAdmin && (
                <th className='py-4 px-6 font-semibold tracking-wider'>已选</th>
              )}
            </tr>
          </thead>
          <tbody className='bg-gray-100'>
            {Object.entries(tasksByUser).map(([userName, data], index) => (
              <tr
                key={userName}
                className={`border-b ${index % 2 === 0 ? 'bg-blue-50' : ''} hover:bg-blue-50 transition duration-300 ease-in-out ${data.isFake ? '' : '*:italic *:!text-gray-400'}`}
              >
                <td className='py-4 px-6 font-medium text-gray-800'>
                  {userName}
                </td>
                <td className='py-4 px-6 text-gray-600'>
                  {data.tasks.join('，')}
                </td>
                <td className='py-4 px-6 text-gray-600'>
                  {data.dueDates
                    .map(date => localFormat(date, 'yyyy-MM-dd HH:mm'))
                    .join('，')}
                </td>
                {isAdmin && (
                  <td className='py-4 px-6 text-gray-600'>
                    {groupedPreference[userName]
                      ? `${groupedPreference[userName]} / ${data.tasks.length}`
                      : ''}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TasksSummary
