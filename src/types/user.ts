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
  password: z.string().optional(),
  role: z
    .enum(['super-admin', 'admin', 'manager', 'user', 'temp-user'])
    .default('user'),
  type: z.literal('user').default('user'),
  sk: z.string().default('null'),
  team: z.string().optional()
})

export type User = z.infer<typeof User>

export type Role = User['role']

export const roleOrder = {
  'super-admin': 4,
  admin: 3,
  manager: 2,
  user: 1,
  'temp-user': 0
} as const

type MinimalUserWithRole = { role: Role }
export const role = {
  superAdmin: (user?: MinimalUserWithRole) => !!user && roleOrder[user.role] >= roleOrder['super-admin'],
  admin: (user?: MinimalUserWithRole) => !!user && roleOrder[user.role] >= roleOrder.admin,
  manager: (user?: MinimalUserWithRole) => !!user && roleOrder[user.role] >= roleOrder.manager,
  user: (user?: MinimalUserWithRole) => !!user && roleOrder[user.role] >= roleOrder.user,
  tempUser: (user?: MinimalUserWithRole) => !!user && roleOrder[user.role] >= roleOrder['temp-user']
}
