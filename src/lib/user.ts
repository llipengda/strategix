'use server'

import { CredentialsSignin } from 'next-auth'
import { redirect } from 'next/navigation'

import { z } from 'zod'

import { signIn } from '@/auth'
import { query } from '@/lib/database'
import type { User } from '@/types/user'

export const getUserByEmail = async (email: string | null | undefined) => {
  if (!email) {
    return null
  }

  const users = await query<User>({
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  })

  return users.length === 0 ? null : users[0]
}

export const authenticateByCredentials = async (
  callbackUrl: string | undefined = '/',
  _: unknown,
  formData: FormData
) => {
  const { success, data: email } = z
    .string()
    .email()
    .safeParse(formData.get('email'))

  if (!success) {
    return '邮箱格式不正确'
  }

  const password = formData.get('password') as string | undefined

  if (!password) {
    return '密码不能为空'
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl
    })
  } catch (e) {
    if (e instanceof CredentialsSignin) {
      return '邮箱或密码错误'
    } else {
      throw e
    }
  }
}
