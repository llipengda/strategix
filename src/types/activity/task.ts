import { v4 } from 'uuid'
import { z } from 'zod'

export const Task = z
  .object({
    id: z.string().uuid().default(v4),
    type: z.literal('task').default('task'),
    description: z.string(),
    references: z.array(z.string()).default([]),
    stages: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
          completed: z.boolean().default(false)
        })
      )
      .default([]),
    sk: z.string().optional()
  })
  .transform(data => ({
    ...data,
    sk: `task#${data.id}`
  }))

export type Task = Expand<z.infer<typeof Task>>
