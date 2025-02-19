import { type Activity } from '@/types/activity/activity'
import type { Assignment } from '@/types/activity/assignment'
import type { Task, TaskTemplate } from '@/types/activity/task'
import type { Team } from '@/types/team'

// Helper functions for making API calls
export async function generateTaskTemplate(
  taskTemplate: TaskTemplate,
  additionalInfo: string
) {
  const response = await fetch('/ai', {
    method: 'POST',
    body: JSON.stringify({
      action: 'generateTaskTemplate',
      params: { taskTemplate, additionalInfo }
    })
  })
  return response.json() as Promise<string>
}

export async function generateActivity(
  activity: Partial<Activity>,
  additionalInfo: string
) {
  const response = await fetch('/ai', {
    method: 'POST',
    body: JSON.stringify({
      action: 'generateActivity',
      params: { activity, additionalInfo }
    })
  })
  return response.json() as Promise<string>
}

export async function continueGenerateActivity() {
  const response = await fetch('/ai', {
    method: 'POST',
    body: JSON.stringify({
      action: 'continueGenerateActivity',
      params: undefined
    })
  })
  return response.json() as Promise<string>
}

export async function generateTask(
  activity: Partial<Activity>,
  tasks: Task[],
  additionalInfo: string
) {
  const response = await fetch('/ai', {
    method: 'POST',
    body: JSON.stringify({
      action: 'generateTask',
      params: { activity, tasks, additionalInfo }
    })
  })
  return response.json() as Promise<string>
}

export async function continueGenerateTask() {
  const response = await fetch('/ai', {
    method: 'POST',
    body: JSON.stringify({
      action: 'continueGenerateTask',
      params: undefined
    })
  })
  return response.json() as Promise<string>
}

export async function generateAssignment(
  team: Team,
  tasks: Task[],
  assignments: Assignment[],
  additionalInfo: string
) {
  const response = await fetch('/ai', {
    method: 'POST',
    body: JSON.stringify({
      action: 'generateAssignment',
      params: { team, tasks, assignments, additionalInfo }
    })
  })
  return response.json() as Promise<string>
}

export async function continueGenerateAssignment() {
  const response = await fetch('/ai', {
    method: 'POST',
    body: JSON.stringify({
      action: 'continueGenerateAssignment',
      params: undefined
    })
  })
  return response.json() as Promise<string>
}
