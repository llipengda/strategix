import { z } from 'zod'

const baseAssignment = {
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  type: z.literal('assignment').default('assignment'),
  sk: z.string().optional()
}

export const Assignment = z
  .discriminatedUnion('isManager', [
    z.object({
      ...baseAssignment,
      userName: z.string(),
      userId: z.string(),
      isManager: z.literal(false).default(false)
    }),
    z.object({
      ...baseAssignment,
      managerName: z.string(),
      managerId: z.string(),
      isManager: z.literal(true).default(true)
    })
  ])
  .transform(data => ({
    ...data,
    sk: `assignment#${data.isManager ? data.managerId : data.userId}#${data.id}#${data.taskId}#${data.isManager}`
  }))

export const AssignmentArray = Assignment.array()

export type Assignment = Expand<z.infer<typeof Assignment>>
