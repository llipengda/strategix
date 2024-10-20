import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import bcrypt from 'bcryptjs'

import { query } from '@/lib/database'
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

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user[0].password
        )

        if (!isValid) {
          return null
        }

        return user[0]
      },
    })
  ],
  callbacks: {
    jwt({token, user}) {
      if (user) {
        token.id = user.id!
        token.role = user.role
      }
      return token
    },
    session({session, token}) {
      session.user.id = token.id
      session.user.role = token.role
      return session
    }
  }
})
