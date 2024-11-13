import { getTaskById } from '@/lib/actions/activity'
import { localFormat } from '@/lib/time'
import { Assignment as TAssignment } from '@/types/activity/assignment'
import type { Task } from '@/types/activity/task'

interface AssignmentProps {
  assignment: TAssignment
}

const getAllAndCompleteStages = (task: Task) => {
  const stages = task.stages

  if (stages.length === 0) {
    return [0, 0]
  }

  const allStages = stages.length
  const completedStages = stages.filter(stage => stage.completed).length

  return [allStages, completedStages]
}

const Assignment: React.FC<AssignmentProps> = async ({ assignment }) => {
  const task = await getTaskById(assignment.id, assignment.taskId)

  if (!task) {
    return null
  }

  const [allStages, completedStages] = getAllAndCompleteStages(task)

  return (
    <div className='flex gap-3 border-b border-gray-300 last:border-none'>
      <div className='font-bold min-w-[10%]'>{task.name}</div>
      <div className='min-w-[25%]'>截止时间：{localFormat(task.dueDate)}</div>
      <div className='min-w-[10%]'>
        进度：{completedStages}/{allStages}
      </div>
    </div>
  )
}

export default Assignment
