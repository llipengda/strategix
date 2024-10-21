import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Resend from 'next-auth/providers/resend'

import { DynamoDBAdapter } from '@auth/dynamodb-adapter'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'

import { dbDocument, query } from '@/lib/database'
import type { User } from '@/types/user'

export const { handlers, signIn, signOut, auth } = NextAuth({
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
      from: 'no-reply@pdli.site'
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
    authorized({ auth }) {
      return !!auth?.user
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout'
  }
})
