import db from '@/lib/database'
import type { Activity } from '@/types/activity/activity'
import type { Assignment } from '@/types/activity/assignment'
import type { Task } from '@/types/activity/task'

export const addActivity = async (activity: Activity) => {
  await db.add(activity)
}

export const addTasks = async (tasks: Task[]) => {
  if (tasks.length === 0) {
    return
  }

  if (tasks.length === 1) {
    await db.add(tasks[0])
    return
  }

  await db.batchAdd(tasks)
}

export const addAssignments = async (assignments: Assignment[]) => {
  if (assignments.length === 0) {
    return
  }

  if (assignments.length === 1) {
    await db.add(assignments[0])
    return
  }

  await db.batchAdd(assignments)
}

export type BriefActivity = Pick<
  Activity,
  'id' | 'name' | 'stage' | 'team' | 'time' | 'timeRange'
>

export const getBriefActivities = async () => {
  return await db.query<BriefActivity>({
    IndexName: 'type-index',
    KeyConditionExpression: '#type = :type',
    ProjectionExpression: '#id, #name, #stage, #team, #time, #timeRange',
    ExpressionAttributeNames: {
      '#type': 'type',
      '#id': 'id',
      '#name': 'name',
      '#stage': 'stage',
      '#team': 'team',
      '#time': 'time',
      '#timeRange': 'timeRange'
    },
    ExpressionAttributeValues: {
      ':type': 'activity'
    }
  })
}

export const getActivity = async (id: string) => {
  return await db.query<Activity | Task | Assignment>({
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id'
    },
    ExpressionAttributeValues: {
      ':id': id
    }
  })
}

export const getAssignments = async (activityId: string, userId: string) => {
  return await db.query<Assignment>({
    KeyConditionExpression: '#id = :id and begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#sk': 'sk'
    },
    ExpressionAttributeValues: {
      ':id': activityId,
      ':sk': `assignment#${userId}`
    }
  })
}

export const getTaskById = async (activityId: string, taskId: string) => {
  const tasks = await db.query<Task>({
    KeyConditionExpression: '#id = :id and #sk = :sk',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#sk': 'sk'
    },
    ExpressionAttributeValues: {
      ':id': activityId,
      ':sk': `task#${taskId}`
    }
  })

  if (tasks.length === 0) {
    return null
  }

  return tasks[0]
}

export const addFullActivity = async (
  activity: Activity,
  tasks: Task[],
  assignments: Assignment[]
) => {
  const promises = [
    addActivity(activity),
    addTasks(tasks),
    addAssignments(assignments)
  ]

  await Promise.all(promises)
}
