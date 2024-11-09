import type { User } from '@/types/user'

export type Role = User['role']

export const roleOrder = {
  'super-admin': 4,
  admin: 3,
  manager: 2,
  user: 1,
  'temp-user': 0
} as const

export const roleMap = {
  'super-admin': '超级管理员',
  admin: '负责人',
  manager: '管理员',
  user: '普通用户',
  'temp-user': '临时用户'
} as const

type MinimalUserWithRole = { role: Role }

export const role = {
  superAdmin: (user?: MinimalUserWithRole) =>
    !!user && roleOrder[user.role] >= roleOrder['super-admin'],
  admin: (user?: MinimalUserWithRole) =>
    !!user && roleOrder[user.role] >= roleOrder.admin,
  manager: (user?: MinimalUserWithRole) =>
    !!user && roleOrder[user.role] >= roleOrder.manager,
  user: (user?: MinimalUserWithRole) =>
    !!user && roleOrder[user.role] >= roleOrder.user,
  tempUser: (user?: MinimalUserWithRole) =>
    !!user && roleOrder[user.role] >= roleOrder['temp-user'],

  ensure: {
    superAdmin: (user?: MinimalUserWithRole) => {
      if (!role.superAdmin(user)) {
        throw new Error('This action requires at least super-admin role.')
      }
    },
    admin: (user?: MinimalUserWithRole) => {
      if (!role.admin(user)) {
        throw new Error('This action requires at least admin role.')
      }
    },
    manager: (user?: MinimalUserWithRole) => {
      if (!role.manager(user)) {
        throw new Error('This action requires at least manager role.')
      }
    },
    user: (user?: MinimalUserWithRole) => {
      if (!role.user(user)) {
        throw new Error('This action requires at least user role.')
      }
    },
    tempUser: (user?: MinimalUserWithRole) => {
      if (!role.tempUser(user)) {
        throw new Error('This action requires at least temp-user role.')
      }
    }
  },

  map:
    (_user?: MinimalUserWithRole) =>
    <T>({
      superAdmin,
      admin,
      manager,
      user,
      tempUser,
      default: _default
    }: {
      superAdmin?: () => T
      admin?: () => T
      manager?: () => T
      user?: () => T
      tempUser?: () => T
      default: () => T
    }) => {
      if (role.superAdmin(_user)) {
        return superAdmin?.()
      }

      if (role.admin(_user)) {
        return admin?.()
      }

      if (role.manager(_user)) {
        return manager?.()
      }

      if (role.user(_user)) {
        return user?.()
      }

      if (role.tempUser(_user)) {
        return tempUser?.()
      }

      return _default()
    }
}
