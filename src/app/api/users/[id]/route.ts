import type { NextRequest } from 'next/server'

import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb'
import { z } from 'zod'

import createUpdate from '@/lib/create-update'
import { del, get, query, update } from '@/lib/database'
import handle from '@/lib/handle'
import { BadRequest, Conflict, NoContent, NotFound, Ok } from '@/lib/response'
import type Params from '@/types/params'
import type { User } from '@/types/user'

export const GET = handle(
  async (req: NextRequest, { params: { id } }: Params<{ id: string }>) => {
    const res = await get<User>({ id, sk: 'null' })
    if (!res) {
      return NotFound('No such user')
    }
    return Ok({ ...res, password: undefined })
  }
)

export const PUT = handle(
  async (req: NextRequest, { params: { id } }: Params<{ id: string }>) => {
    const UpdateInput = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      department: z.string().optional(),
      role: z.enum(['super-admin', 'admin', 'user']).optional()
    })

    const { success, data, error } = UpdateInput.safeParse(await req.json())

    if (!success) {
      return BadRequest(error)
    }

    if (data.email) {
      const res = await query<User>({
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': data.email
        }
      })

      if (res.length > 0) {
        return Conflict('Email is already used')
      }
    }

    const [expression, attrs, values] = createUpdate(data)

    if (!expression) {
      return BadRequest('No data to update')
    }

    try {
      await update({
        Key: { id, sk: 'null' },
        UpdateExpression: expression,
        ExpressionAttributeNames: attrs,
        ExpressionAttributeValues: values,
        ConditionExpression: 'attribute_exists(id)'
      })
    } catch (e) {
      if (e instanceof ConditionalCheckFailedException) {
        return NotFound('No such user')
      } else {
        throw e
      }
    }

    return NoContent()
  }
)

export const DELETE = handle(
  async (req: NextRequest, { params: { id } }: Params<{ id: string }>) => {
    await del({ id, sk: 'null' })
    return NoContent()
  }
)
