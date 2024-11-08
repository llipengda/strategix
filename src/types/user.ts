import { v4 } from 'uuid'
import { z } from 'zod'

export const User = z.object({
  id: z
    .string()
    .startsWith('user-')
    .default(() => `user-${v4()}`),
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  role: z
    .enum(['super-admin', 'admin', 'manager', 'user', 'temp-user'])
    .default('user'),
  type: z.literal('user').default('user'),
  sk: z.string().default('null'),
  team: z.string().optional()
})

export type User = z.infer<typeof User>
