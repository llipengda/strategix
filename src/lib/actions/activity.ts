'use server'

import { revalidatePath } from 'next/cache'

import { generateUpdateExpression } from '@auth/dynamodb-adapter'
import Ably from 'ably'

import { auth } from '@/auth'
import { getCurrentUser } from '@/lib/actions/user'
import db from '@/lib/database'
import { role } from '@/lib/role'
import { Activity, type Section } from '@/types/activity/activity'
import { Assignment } from '@/types/activity/assignment'
import type { Preference } from '@/types/activity/preference'
import { Task } from '@/types/activity/task'

export const addActivity = async (activity: Activity) => {
  await db.add(activity)
}

export const addTask = async (task: Task) => {
  const activity = await getActivity(task.id)

  if (!activity) {
    throw new Error('活动不存在')
  }

  await db.add(task)
}

export const updateTaskAction = async (
  key: { id: string; sk: string },
  task: Omit<Partial<Task>, 'id' | 'sk'>
) => {
  await db.update({
    Key: key,
    ...generateUpdateExpression(task)
  })

  revalidatePath(`/activity/${key.id}`)
  revalidatePath('/activity')
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

export const addAssignmentsAction = async (assignments: Assignment[]) => {
  await addAssignments(assignments)

  revalidatePath('/activity')
  revalidatePath(`/activity/${assignments[0].id}`)
}

export type BriefActivity = Pick<
  Activity,
  'id' | 'sk' | 'name' | 'stage' | 'team' | 'time' | 'timeRange'
>

export const getBriefActivities = async () => {
  return await db.query<BriefActivity>({
    IndexName: 'type-index',
    KeyConditionExpression: '#type = :type',
    ProjectionExpression: '#id, #sk, #name, #stage, #team, #time, #timeRange',
    ExpressionAttributeNames: {
      '#type': 'type',
      '#id': 'id',
      '#sk': 'sk',
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
      ':sk': `assignment#${activityId}#${userId}`
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
      ':sk': `task#${activityId}#${taskId}`
    }
  })

  if (tasks.length === 0) {
    return null
  }

  return tasks[0]
}

export const addNewDraftActivityAction = async (
  name: string,
  {
    time,
    timeRange
  }: {
    time?: Date
    timeRange?: [Date, Date]
  }
) => {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('请先登录')
  }

  role.ensure.admin(user)

  if (!time && !timeRange) {
    return {
      error: '时间不能为空'
    }
  }

  if (!!timeRange && timeRange[0] >= timeRange[1]) {
    return {
      error: '时间范围不合法'
    }
  }

  if (!user.team) {
    throw new Error('请先设置团队')
  }

  const activity = Activity.parse({
    name,
    time,
    timeRange,
    team: user.team,
    sections: []
  })

  await addActivity(activity)

  revalidatePath('/activity')

  return {
    key: {
      id: activity.id,
      sk: activity.sk
    }
  }
}

type UpdateActivity = Partial<Omit<Activity, 'id' | 'sk'>>

export const updateActivityAction = async (
  key: { id: string; sk: string },
  activity: UpdateActivity
) => {
  await db.update({
    Key: key,
    ...generateUpdateExpression(activity)
  })

  revalidatePath('/activity')
}

export const deleteAssignmentAction = async (key: {
  id: string
  sk: string
}) => {
  await db.del(key)

  revalidatePath(`/activity/${key.id}`)
  revalidatePath('/activity')
}

export const addOrUpdateSectionAction = async (
  key: { id: string; sk: string },
  id: string,
  section: Section
) => {
  const activity = await db.get<Activity>(key)

  if (!activity) {
    throw new Error('活动不存在')
  }

  const index = activity.sections?.findIndex(s => s.id === id) ?? -1

  if (index === -1) {
    if (!activity.sections) {
      activity.sections = []
    }
    activity.sections.push(section)
  } else {
    activity.sections[index] = section
  }

  await db.update({
    Key: key,
    ...generateUpdateExpression({ sections: activity.sections })
  })

  revalidatePath(`/activity/${key.id}`)
  revalidatePath('/activity/new')
  revalidatePath(`/activity/new?id=${key.id}&sk=${encodeURIComponent(key.sk)}`)
}

export const deleteSectionAction = async (
  key: { id: string; sk: string },
  id: string
) => {
  const activity = await db.get<Activity>(key)

  if (!activity) {
    throw new Error('活动不存在')
  }

  activity.sections = activity.sections?.filter(s => s.id !== id)

  await db.update({
    Key: key,
    ...generateUpdateExpression({ sections: activity.sections })
  })

  revalidatePath(`/activity/${key.id}`)
  revalidatePath('/activity/new')
  revalidatePath(`/activity/new?id=${key.id}&sk=${encodeURIComponent(key.sk)}`)
}

export const addPreferenceAction = async (preference: Preference) => {
  await db.add(preference)

  revalidatePath(`/activity/${preference.id}/assignment`)
}

export const getGroupedPreferences = async (activityId: string) => {
  const data = await db.query<Preference>({
    KeyConditionExpression: '#id = :id and begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#sk': 'sk'
    },
    ExpressionAttributeValues: {
      ':id': activityId,
      ':sk': `preference#`
    }
  })

  return data.reduce(
    (acc, cur) => {
      acc[cur.fakeAssignment] = (acc[cur.fakeAssignment] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
}

export const getMyPreferences = async (activityId: string) => {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('请先登录')
  }

  return await db.query<Preference>({
    KeyConditionExpression: '#id = :id and begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#sk': 'sk'
    },
    ExpressionAttributeValues: {
      ':id': activityId,
      ':sk': `preference#${session.user.id}`
    }
  })
}

export const deleteMyPreferences = async (activityId: string) => {
  const preferences = await getMyPreferences(activityId)
  await Promise.all(preferences.map(p => db.del({ id: p.id, sk: p.sk })))
}

export const endAssignmentPreferenceChoiceAction = async (key: {
  id: string
  sk: string
}) => {
  const activity = await db.get<Activity>(key)

  if (!activity) {
    throw new Error('活动不存在')
  }

  if (activity.stopPreferenceAssign) {
    return
  }

  const preferences = await db.query<Preference>({
    KeyConditionExpression: '#id = :id and begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#sk': 'sk'
    },
    ExpressionAttributeValues: {
      ':id': key.id,
      ':sk': `preference#`
    }
  })

  const allUsers = new Set(preferences.map(p => p.userId))

  if (allUsers.size !== activity.totalUsers) {
    throw new Error('有用户未完成选择')
  }

  await db.update({
    Key: key,
    ...generateUpdateExpression({ stopPreferenceAssign: true })
  })

  await PreferenceAssign(key.id, preferences)

  revalidatePath(`/activity/${key.id}`)
}

const PreferenceAssign = async (
  activityId: string,
  preferences: Preference[]
) => {
  const client = new Ably.Realtime(process.env.ABLY_API_KEY!)

  const channel = client.channels.get(`activity-${activityId}`)

  await channel.publish('stop-preference-assign', true)

  const groupByName = preferences.reduce(
    (acc, cur) => {
      acc[cur.fakeAssignment] = [...(acc[cur.fakeAssignment] || []), cur]
      return acc
    },
    {} as Record<string, Preference[]>
  )

  const tasks = await db.query<Task>({
    KeyConditionExpression: '#id = :id and begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#sk': 'sk'
    },
    ExpressionAttributeValues: {
      ':id': activityId,
      ':sk': `task#${activityId}`
    }
  })

  const fakeAssignmentToTaskId = tasks.reduce(
    (acc, cur) => {
      cur.fakeAssignedTo?.forEach(name => {
        acc[name] = cur.taskId
      })
      return acc
    },
    {} as Record<string, string>
  )

  const allUsers = new Set(preferences.map(p => p.userId))
  const allFakeAssignments = new Set(Object.keys(fakeAssignmentToTaskId))

  const assignments = []
  const assignedUsers = new Set()

  // Sort entries by number of preferences to handle most constrained first
  const sortedEntries = Object.entries(groupByName).sort(
    (a, b) => a[1].length - b[1].length
  )

  for (const [name, preferences] of sortedEntries) {
    // Filter out already assigned users
    const availablePreferences = preferences.filter(
      p => !assignedUsers.has(p.userId)
    )

    if (availablePreferences.length === 0) continue

    // Sort by preference score
    availablePreferences.sort((a, b) => b.preference - a.preference)
    const max = availablePreferences[0].preference

    // Get all preferences with max score
    const selected = availablePreferences.filter(p => p.preference === max)

    // Randomly select one
    const randomIndex = Math.floor(Math.random() * selected.length)
    const assignment = selected[randomIndex]

    // Track assigned user
    assignedUsers.add(assignment.userId)
    allUsers.delete(assignment.userId)
    allFakeAssignments.delete(name)

    assignments.push(
      Assignment.parse({
        id: activityId,
        taskId: fakeAssignmentToTaskId[name],
        isManager: false,
        userId: assignment.userId,
        userName: assignment.userName
      })
    )
  }

  const leftUsers = Array.from(allUsers)
  const leftFakeAssignments = Array.from(allFakeAssignments)

  console.assert(leftUsers.length === leftFakeAssignments.length)

  for (let i = 0; i < leftFakeAssignments.length; i++) {
    assignments.push(
      Assignment.parse({
        id: activityId,
        taskId: leftFakeAssignments[i],
        isManager: false,
        userId: leftUsers[i],
        userName: leftUsers[i]
      })
    )
  }

  await db.batchAdd(assignments)

  revalidatePath(`/activity/${activityId}`)
  revalidatePath('/activity')
  revalidatePath(`/activity/${activityId}/assignment`)

  await channel.publish('assignment-completed', true)
}
