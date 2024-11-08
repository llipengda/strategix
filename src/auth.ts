import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Resend from 'next-auth/providers/resend'
import { cookies } from 'next/headers'

import { DynamoDBAdapter } from '@auth/dynamodb-adapter'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
import { z } from 'zod'

import { getUserByEmail } from '@/lib/actions/user'
import db, { dbDocument } from '@/lib/database'
import { html, text } from '@/lib/email'
import type { User } from '@/types/role'

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async credentials => {
        const user = await db.query<User>({
          IndexName: 'email-index',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': credentials.email
          }
        })

        if (user.length === 0) {
          return null
        }

        const pwd = user[0].password

        if (!pwd) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          pwd
        )

        if (!isValid) {
          return null
        }

        return user[0]
      }
    }),
    Resend({
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier: to, url, provider }) {
        const emailType = (await cookies()).get('email-type')?.value ?? 'signup'
        const { host } = new URL(url)
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: provider.from,
            to,
            subject: `${emailType === 'signin' ? '登录到' : '注册'} ${host}`,
            html: html({ url, host, emailType }),
            text: text({ url, host, emailType })
          })
        })
        if (!res.ok) {
          throw new Error('Resend error: ' + JSON.stringify(await res.json()))
        }
      }
    }),
    GitHub({
      allowDangerousEmailAccountLinking: true
    })
  ],
  adapter: DynamoDBAdapter(dbDocument),
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (!user && token.email) {
        const dbUser = await getUserByEmail(token.email)
        if (dbUser) {
          user = dbUser
        }
      }
      if (user) {
        token.id = user.id || `user-${v4()}`
        token.role = user.role || 'temp-user'
        token.name = user.name || ''
      }
      if (trigger === 'update' && session) {
        const sessionParsed = await z
          .object({
            user: z.object({
              id: z.string(),
              role: z.enum([
                'super-admin',
                'admin',
                'manager',
                'user',
                'temp-user'
              ]),
              name: z.string()
            })
          })
          .parseAsync(session)

        token.id = sessionParsed.user.id
        token.role = sessionParsed.user.role
        token.name = sessionParsed.user.name
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      session.user.name = token.name
      return session
    },
    authorized({ auth }) {
      return !!auth?.user
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error'
  }
})
