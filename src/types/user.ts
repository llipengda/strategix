import { v4 } from 'uuid'
import { z } from 'zod'

export const User = z.object({
  id: z
    .string()
    .startsWith('user-')
    .default(() => `user-${v4()}`),
  name: z.string(),
  email: z.string().email(),
  department: z.string().optional(),
  password: z.string().min(8),
  role: z.enum(['super-admin', 'admin', 'user']).default('user'),
  type: z.literal('user').default('user'),
  sk: z.string().default('null')
})

export type User = z.infer<typeof User>
