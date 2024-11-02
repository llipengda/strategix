'use server'

import { revalidatePath } from 'next/cache'

import { z } from 'zod'

import { auth } from '@/auth'
import createUpdate from '@/lib/create-update'
import { get, query, update } from '@/lib/database'
import {
  type Role,
  type User,
  role as checkRole,
  roleOrder
} from '@/types/user'

export const getTeam = async () => {
  const session = await auth()

  if (!session) {
    throw new Error('no session')
  }

  const user = await get<User>({
    id: session.user.id,
    sk: 'null'
  })

  if (!user) {
    throw new Error('no user')
  }

  const team = user.team

  if (!team) {
    return null
  }

  const members = await query<{
    id: string
    name: string
    role: Role
  }>({
    IndexName: 'team-index',
    KeyConditionExpression: 'team = :team',
    ExpressionAttributeValues: {
      ':team': team
    },
    ProjectionExpression: 'id, #name, #role',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#role': 'role'
    }
  })

  members.sort((a, b) => {
    return roleOrder[b.role] - roleOrder[a.role]
  })

  return {
    teamName: team,
    members
  }
}

export const getUsersWithoutTeam = async () => {
  const user = (await auth())?.user

  if (!checkRole.admin(user)) {
    throw new Error('Forbidden')
  }

  const users = await query<User>({
    IndexName: 'type-index',
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeValues: {
      ':type': 'user'
    },
    ExpressionAttributeNames: {
      '#type': 'type'
    }
  })

  return users.filter(user => !user.team)
}

export const addUserToTeam = async (
  userId: string,
  team: string,
  role: string
) => {
  const user = (await auth())?.user

  if (!checkRole.admin(user)) {
    throw new Error('Forbidden')
  }

  await update({
    Key: {
      id: userId,
      sk: 'null'
    },
    ...createUpdate({
      team,
      role
    })
  })
}

export const addUserToTeamAction = async (
  teamName: string,
  formData: FormData
) => {
  const userId = z.string().parse(formData.get('user'))
  const role = z.enum(['user', 'manager']).parse(formData.get('role'))

  if (!userId || !role) {
    return
  }

  await addUserToTeam(userId, teamName, role)

  revalidatePath('/team')
}

export const removeUserFromTeam = async (userId: string) => {
  const user = (await auth())?.user

  if (!checkRole.admin(user)) {
    throw new Error('Forbidden')
  }

  if (userId === user?.id) {
    throw new Error('Cannot remove yourself')
  }

  await update({
    Key: {
      id: userId,
      sk: 'null'
    },
    UpdateExpression: 'REMOVE #team SET #role = :role',
    ExpressionAttributeNames: {
      '#role': 'role',
      '#team': 'team'
    },
    ExpressionAttributeValues: {
      ':role': 'user'
    }
  })

  revalidatePath('/team')
}
