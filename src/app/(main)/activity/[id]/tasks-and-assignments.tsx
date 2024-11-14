import { localFormat } from '@/lib/time'
import type { Assignment } from '@/types/activity/assignment'
import type { Task } from '@/types/activity/task'

interface TasksAndAssignmentsProps {
  tasks: Task[]
  assignments: Assignment[]
}

const getMergedTasks = (tasks: Task[], assignments: Assignment[]) => {
  type MergedTask = Task & {
    managerId: string | null
    managerName: string | null
    users: { userId: string; userName: string }[]
  }

  const taskMap = tasks.reduce(
    (map, task) => {
      map[task.taskId] = {
        ...task,
        managerId: null,
        managerName: null,
        users: []
      }
      return map
    },
    {} as Record<string, MergedTask>
  )

  assignments.forEach(assignment => {
    const task = taskMap[assignment.taskId]
    if (task) {
      if (assignment.isManager) {
        task.managerId = assignment.managerId
        task.managerName = assignment.managerName
      } else {
        task.users.push({
          userId: assignment.userId,
          userName: assignment.userName
        })
      }
    }
  })

  return Object.values(taskMap)
}

const TasksAndAssignments: React.FC<TasksAndAssignmentsProps> = ({
  tasks,
  assignments
}) => {
  const mergedTasks = getMergedTasks(tasks, assignments)

  return (
    <div>
      <h2 className='text-xl font-bold'>活动分工</h2>
      <div className='overflow-x-auto p-3 mt-2'>
        <table className='w-full text-left border-collapse overflow-hidden rounded-lg'>
          <thead>
            <tr className='bg-blue-100 text-black'>
              <th className='py-4 px-6 font-semibold tracking-wider'>
                任务名称
              </th>
              <th className='py-4 px-6 font-semibold tracking-wider'>描述</th>
              <th className='py-4 px-6 font-semibold tracking-wider'>
                到期日期
              </th>
              <th className='py-4 px-6 font-semibold tracking-wider'>负责人</th>
              <th className='py-4 px-6 font-semibold tracking-wider'>分配</th>
            </tr>
          </thead>
          <tbody className='bg-gray-100'>
            {mergedTasks.map((task, index) => (
              <tr
                key={task.taskId}
                className={`border-b ${index % 2 === 0 ? 'bg-blue-50' : ''} hover:bg-blue-50 transition duration-300 ease-in-out`}
              >
                <td className='py-4 px-6 font-medium text-gray-800'>
                  {task.name}
                </td>
                <td className='py-4 px-6 text-gray-600'>{task.description}</td>
                <td className='py-4 px-6 text-gray-600'>
                  {localFormat(task.dueDate, 'yyyy-MM-dd HH:mm')}
                </td>
                <td className='py-4 px-6 text-gray-600'>
                  <span className='inline-block bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold shadow-sm'>
                    {task.managerName}
                  </span>
                </td>
                <td className='py-4 px-6 text-gray-600 space-x-2'>
                  {task.users.map(user => (
                    <span
                      key={user.userId}
                      className='inline-block bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold shadow-sm'
                    >
                      {user.userName}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TasksAndAssignments
