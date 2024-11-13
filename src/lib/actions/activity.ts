import { revalidatePath } from 'next/cache'

import db from '@/lib/database'
import { Activity } from '@/types/activity/activity'
import type { Assignment } from '@/types/activity/assignment'
import type { Task } from '@/types/activity/task'

export const addActivity = async (activity: Activity) => {
  await db.add(activity)
  revalidatePath('/activity')
}

export const getActivities = async () => {
  return await db.query<Activity>({
    IndexName: 'type-index',
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeNames: {
      '#type': 'type'
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
