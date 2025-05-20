'use server'

import { revalidatePath } from 'next/cache'

import { z } from 'zod'

import { auth } from '@/auth'
import createUpdate from '@/lib/create-update'
import db from '@/lib/database'
import { Role, role as checkRole, roleOrder } from '@/lib/role'
import type { Team } from '@/types/team'
import { type User } from '@/types/user'

export const getTeam = async () => {
  const session = await auth()

  if (!session) {
    throw new Error('no session')
  }

  const user = await db.get<User>({
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

  const members = await db.query<{
    id: string
    name: string
    role: Role
  }>({
    IndexName: 'team-index',
    KeyConditionExpression: 'team = :team and sk = :sk',
    ExpressionAttributeValues: {
      ':team': team,
      ':sk': 'null'
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
  } as Team
}

export const getUsersWithoutTeam = async () => {
  const user = (await auth())?.user

  checkRole.ensure.admin(user)

  const users = await db.query<User>({
    IndexName: 'type-index',
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeValues: {
      ':type': 'user'
    },
    ExpressionAttributeNames: {
      '#type': 'type'
    }
  })

  return users.filter(user => !user.team && !checkRole.superAdmin(user))
}

export const addUserToTeam = async (
  userId: string,
  team: string,
  role: string
) => {
  const user = (await auth())?.user

  checkRole.ensure.admin(user)

  await db.update({
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

  checkRole.ensure.admin(user)

  if (userId === user?.id) {
    if (!checkRole.superAdmin(user)) {
      throw new Error('Cannot remove yourself')
    }
  }

  await db.update({
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

export const getAllTeams = async () => {
  const user = (await auth())?.user

  checkRole.ensure.superAdmin(user)

  const users = await db.query<User>({
    IndexName: 'type-index',
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeValues: {
      ':type': 'user'
    },
    ExpressionAttributeNames: {
      '#type': 'type'
    }
  })

  const teams = users.reduce(
    (acc, user) => {
      if (!user.team) {
        return acc
      }

      if (!acc[user.team]) {
        acc[user.team] = []
      }

      acc[user.team].push(user)

      return acc
    },
    {} as Record<string, User[]>
  )

  return Object.entries(teams).map(([team, members]) => ({
    teamName: team,
    members: members.sort((a, b) => {
      return roleOrder[b.role] - roleOrder[a.role]
    })
  })) as Team[]
}

export const addTeam = async (teamName: string, userId: string) => {
  const user = (await auth())?.user

  checkRole.ensure.superAdmin(user)

  await addUserToTeam(userId, teamName, 'admin')

  revalidatePath('/team')
}

export const addTeamAction = async (formData: FormData) => {
  const teamName = z.string().parse(formData.get('teamName'))
  const userId = z.string().parse(formData.get('user'))

  if (!teamName || !userId) {
    return
  }

  await addTeam(teamName, userId)
}
