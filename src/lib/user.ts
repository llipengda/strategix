'use server'

import { CredentialsSignin } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { auth, signIn, unstable_update as update } from '@/auth'
import { add, query } from '@/lib/database'
import validateCaptcha from '@/lib/recaptcha'
import { User } from '@/types/user'

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

export const authenticateByResend = async (
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

  // if (
  //   !(await verifyTurnstile(
  //     formData.get('cf-turnstile-response') as string,
  //     headers().get('x-real-ip')!
  //   ))
  // ) {
  //   return '人机验证失败'
  // }

  if (!(await validateCaptcha(formData.get('captcha') as string))) {
    return '人机验证失败'
  }

  const user = await getUserByEmail(email)

  let url = callbackUrl

  if (!user) {
    url = `/auth/setup?callbackUrl=${callbackUrl}`
    cookies().set('email-type', 'signup')
  } else {
    cookies().set('email-type', 'signin')
  }

  try {
    await signIn('resend', {
      email,
      redirectTo: url
    })
  } catch (e) {
    throw e
  }
}

const userSetupSchema = z
  .object({
    name: z.string().min(1, { message: '姓名不能为空' }),
    usePassword: z.literal('on').optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional()
  })
  .superRefine((data, ctx) => {
    console.log(data)
    if (data.usePassword) {
      if (!data.password) {
        ctx.addIssue({
          path: ['password'],
          message: '勾选“创建密码”后，必须设置密码',
          code: 'custom'
        })
      }

      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          path: ['confirmPassword'],
          message: '密码不匹配',
          code: 'custom'
        })
      }

      if (data.password && data.password.length < 8) {
        ctx.addIssue({
          path: ['password'],
          message: '密码长度至少为8位',
          code: 'custom'
        })
      }
    }
  })

export const addUser = async (
  callbackUrl: string | undefined = '/',
  _: unknown,
  formData: FormData
) => {
  const { success, data, error } = userSetupSchema.safeParse(
    Object.fromEntries(formData)
  )

  if (!success) {
    return error.errors.flatMap(e => e.message).join('; ')
  }

  const email = (await auth())?.user.email

  if (!email) {
    throw new Error('未验证')
  }

  const user = await getUserByEmail(email)

  if (user) {
    throw new Error('用户已存在')
  }

  const { name, password } = data

  let hashedPassword: string | undefined

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10)
  }

  const newUser = User.parse({
    email,
    name,
    role: 'user',
    password: hashedPassword
  })

  await add(newUser)

  newUser.password = undefined

  update({
    user: {
      ...newUser
    }
  })

  revalidatePath(callbackUrl!)
  redirect(callbackUrl)
}
