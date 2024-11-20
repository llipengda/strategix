import { v4 } from 'uuid'
import { z } from 'zod'

export const TaskTemplate = z
  .object({
    id: z.string().uuid().default(v4),
    name: z.string(),
    description: z.string(),
    requiredPeople: z.number(),
    references: z.array(z.string()).default([]),
    stages: z
      .array(
        z.object({
          id: z.string().uuid().default(v4),
          name: z.string(),
          approval: z
            .enum(['none', 'manager', 'admin', 'super-admin'])
            .default('none'),
          assignedTo: z.array(z.number()).default([]),
          content: z.string()
        })
      )
      .default([]),
    type: z.literal('task-template').default('task-template')
  })
  .transform(data => ({
    ...data,
    sk: `task-template#${data.id}`
  }))

export const Task = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    taskId: z.string().uuid().default(v4),
    dueDate: z.date().transform(v => v.toISOString()),
    type: z.literal('task').default('task'),
    description: z.string(),
    references: z.array(z.string()).default([]),
    requiredPeople: z.number(),
    stages: z
      .array(
        z.object({
          id: z.string().uuid(),
          name: z.string(),
          approval: z
            .enum(['none', 'manager', 'admin', 'super-admin'])
            .default('none'),
          content: z.string(),
          assignedTo: z.array(z.number()).default([]),
          completed: z.boolean().default(false)
        })
      )
      .default([]),
    fakeAssignedTo: z.array(z.string()).optional(),
    sk: z.string().optional()
  })
  .transform(data => ({
    ...data,
    sk: `task#${data.id}#${data.taskId}`
  }))

export type TaskTemplate = Expand<z.infer<typeof TaskTemplate>>
export type TaskTemplateStage = Expand<TaskTemplate['stages'][number]>

export type Task = Expand<z.infer<typeof Task>>
export type Stage = Expand<Task['stages'][number]>
