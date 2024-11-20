'use server'

import db from '@/lib/database'
import { TaskTemplate } from '@/types/activity/task'

export const getTaskTemplates = async () => {
  const taskTemplates = await db.query<TaskTemplate>({
    IndexName: 'type-index',
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeNames: {
      '#type': 'type'
    },
    ExpressionAttributeValues: {
      ':type': 'task-template'
    }
  })

  return taskTemplates
}

export const getTaskTemplateById = async (id: string) => {
  const taskTemplate = await db.query<TaskTemplate>({
    KeyConditionExpression: '#id = :id AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#sk': 'sk'
    },
    ExpressionAttributeValues: {
      ':id': id,
      ':sk': 'task-template#'
    }
  })

  if (taskTemplate.length === 0) {
    return null
  }

  return taskTemplate[0]
}

export const addTaskTemplate = async (template: TaskTemplate) => {
  await db.add(template)
  return template
}
