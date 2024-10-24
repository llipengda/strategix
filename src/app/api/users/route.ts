import bcrypt from 'bcryptjs'

import {add, query} from '@/lib/database'
import handle from '@/lib/handle'
import {BadRequest, Conflict, Created, Forbidden, NotFound, Ok} from '@/lib/response'
import {User} from '@/types/user'
import {getUserByEmail} from "@/lib/actions/user";

export const POST = handle(async req => {
  const { success, data, error } = User.safeParse(await req.json())

  if (!success) {
    return BadRequest(error)
  }

  if (data.role !== 'user') {
    return Forbidden('Only users can be created')
  }

  if (data.email !== req.auth?.user.email && req.auth?.user.role !== 'super-admin') {
    return Forbidden('Can only create user with your own email')
  }

  if (await getUserByEmail(data.email)) {
    return Conflict('Email already exists')
  }

  if (data.password) {
    const saltRounds = 10
    data.password = await bcrypt.hash(data.password, saltRounds)
  }

  await add(data)
  return Created()
})

export const GET = handle(async req => {
  if (req.nextUrl.searchParams.has('email')) {
    const email = req.nextUrl.searchParams.get('email')

    const res = await getUserByEmail(email!)

    if (!res) {
      return NotFound('No such user')
    }

    return Ok({ ...res, password: undefined })
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
}, 'admin')
