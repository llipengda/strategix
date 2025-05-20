import type { DefaultSession, Session } from 'next-auth'
import 'next-auth/jwt'
import type { NextRequest } from 'next/server'

import { type User as TUser } from '@/types/user'

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      role: TUser['role']
      team?: string
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user']
  }

  interface User {
    role?: TUser['role']
    team?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: TUser['role']
    team?: string
  }
}

export interface NextAuthRequest extends NextRequest {
  auth: Session | null
}

export type AppRouteHandlerFnContext = {
  params?: Record<string, string | string[]>
}

export type AppRouteHandlerFn = (
  /**
   * Incoming request object.
   */
  req: NextRequest,
  /**
   * Context properties on the request (including the parameters if this was a
   * dynamic route).
   */
  ctx: AppRouteHandlerFnContext
) => void | Response | Promise<void | Response>
