import { z } from 'zod'

const baseAssignment = {
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  dueDate: z.string().datetime(),
  completed: z.boolean(),
  type: z.literal('assignment').default('assignment'),
  sk: z.string().optional()
}

export const Assignment = z
  .discriminatedUnion('isManager', [
    z.object({
      ...baseAssignment,
      managerName: z.string().optional(),
      isManager: z.literal(false).default(false)
    }),
    z.object({
      ...baseAssignment,
      users: z.array(
        z.object({
          name: z.string(),
          id: z.string()
        })
      ),
      isManager: z.literal(true).default(true)
    })
  ])
  .transform(data => ({
    ...data,
    sk: `assignment#${data.id}#${data.taskId}`
  }))

export const AssignmentArray = Assignment.array()

export type Assignment = Expand<z.infer<typeof Assignment>>
