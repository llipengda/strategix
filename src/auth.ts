import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Resend from 'next-auth/providers/resend'
import { cookies } from 'next/headers'

import { DynamoDBAdapter } from '@auth/dynamodb-adapter'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'

import { dbDocument, query } from '@/lib/database'
import { html, text } from '@/lib/email'
import type { User } from '@/types/user'

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async credentials => {
        const user = await query<User>({
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
        const emailType = cookies().get('email-type')?.value || 'signup'
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
    })
  ],
  // @ts-expect-error i don't know why ts is complaining
  adapter: DynamoDBAdapter(dbDocument),
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id || `user-${v4()}`
        token.role = user.role || 'temp-user'
      }
      if (trigger === 'update' && session) {
        token.id = session.user.id
        token.role = session.user.role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      return session
    },
    authorized({ auth, request }) {
      if (auth?.user.role === 'temp-user') {
        const url = new URL(request.url)
        console.log(url.pathname)
      }

      return !!auth?.user
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    verifyRequest: '/auth/verify-request'
  }
})
