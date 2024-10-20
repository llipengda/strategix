import type { NextRequest } from 'next/server'

import bcrypt from 'bcryptjs'

import { add, query } from '@/lib/database'
import handle from '@/lib/handle'
import { BadRequest, Conflict, Created, InternalServerError, NotFound, Ok } from '@/lib/response'
import { User } from '@/types/user'

export const POST = handle(async (req: NextRequest) => {
  const { success, data, error } = User.safeParse(await req.json())

  if (!success) {
    return BadRequest(error)
  }

  const res = await query<User>({
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': data.email
    }
  })

  if (res.length > 0) {
    return Conflict('User already exists')
  }

  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(data.password, saltRounds)

  data.password = hashedPassword

  await add(data)
  return Created()
})

export const GET = handle(async (req: NextRequest) => {
  if (req.nextUrl.searchParams.has('email')) {
    const email = req.nextUrl.searchParams.get('email')
    const res = await query<User>({
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    })

    if (res.length === 0) {
      return NotFound('No such user')
    }

    if (res.length > 1) {
      return InternalServerError('Multiple users found')
    }

    return Ok({ ...res[0], password: undefined })
  }

  const users = await query<User>({
    IndexName: 'type-index',
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeNames: {
      '#type': 'type'
    },
    ExpressionAttributeValues: {
      ':type': 'user'
    }
  })
  return Ok(users.map(u => ({ ...u, password: undefined })))
})
