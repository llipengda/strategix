'use server'

import { auth } from '@/auth'
import { get, query } from '@/lib/database'
import type { Role, User } from '@/types/user'

const getTeam = async () => {
  const session = await auth()

  if (!session) {
    throw new Error('no session')
  }

  const user = await get<User>({
    id: session.user.id
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
    ProjectionExpression: 'id, name, role'
  })

  return {
    teamName: team,
    members
  }
}
