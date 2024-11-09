'use server'

import { CredentialsSignin } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { auth, signIn, signOut, unstable_update as update } from '@/auth'
import createUpdate from '@/lib/create-update'
import db from '@/lib/database'
import validateCaptcha from '@/lib/recaptcha'
import { User } from '@/types/user'

export const getUserByEmail = async (email: string | null | undefined) => {
  if (!email) {
    return null
  }

  const users = await db.query<User>({
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
  formData: FormData,
  callbackUrl: string | undefined = '/'
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

  const cookieStore = await cookies()

  if (!user) {
    url = `/auth/setup?callbackUrl=${callbackUrl}`
    cookieStore.set('email-type', 'signup')
  } else {
    cookieStore.set('email-type', 'signin')
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
    name: z.string().trim().min(1, { message: '姓名不能为空' }),
    usePassword: z.literal('on').optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional()
  })
  .superRefine((data, ctx) => {
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

  await db.add(newUser)

  newUser.password = undefined

  await update({
    user: {
      ...newUser
    }
  })

  revalidatePath(callbackUrl)
  redirect(callbackUrl)
}

export async function gitHibSignin(url: string) {
  await signIn('github', {
    redirectTo: url
  })
}

export async function getCurrentUser() {
  const session = await auth()

  if (!session) {
    return null
  }

  const user = await db.get<User>({
    id: session.user.id,
    sk: 'null'
  })

  if (!user) {
    return null
  }

  user.password = !!user.password ? 'has-password' : undefined

  return user
}

const userUpdateSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, { message: '姓名不能为空' }),
  role: z
    .enum(['super-admin', 'admin', 'manager', 'user', 'temp-user'])
    .optional(),
  originalRole: z.enum(['super-admin', 'admin', 'manager', 'user', 'temp-user'])
})

export const updateUser = async (formData: FormData) => {
  const user = userUpdateSchema.parse(Object.fromEntries(formData))

  await db.update({
    Key: {
      id: user.id,
      sk: 'null'
    },
    ...createUpdate({ name: user.name, role: user.role || user.originalRole })
  })

  revalidatePath('/user')
}

export const getUser = async (id: string) => {
  return db.get<User>({
    id,
    sk: 'null'
  })
}

export const deleteUser = async () => {
  const id = (await auth())?.user.id

  if (!id) {
    throw new Error('未验证')
  }

  await db.del({
    id,
    sk: 'null'
  })

  await signOut({ redirect: true, redirectTo: '/' })

  revalidatePath('/')
}

const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, { message: '密码长度至少为8位' }),
    confirmPassword: z.string().min(8, { message: '密码长度至少为8位' })
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        message: '密码不匹配',
        code: 'custom'
      })
    }
  })

export const resetPasswordAction = async (_: unknown, formData: FormData) => {
  const { success, data, error } = resetPasswordSchema.safeParse(
    Object.fromEntries(formData)
  )

  if (!success) {
    return error.errors.flatMap(e => e.message).join('; ')
  }

  const user = await getUserByEmail(data.email)

  if (!user) {
    return '用户不存在'
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)

  await db.update({
    Key: {
      id: user.id,
      sk: 'null'
    },
    ...createUpdate({ password: hashedPassword })
  })

  revalidatePath('/auth/signin')
  revalidatePath('/user')
  redirect('/user')
}
