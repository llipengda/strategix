import { auth } from '@/auth'
import { Forbidden, InternalServerError, Unauthorized } from '@/lib/response'
import type {
  AppRouteHandlerFn,
  AppRouteHandlerFnContext,
  NextAuthRequest
} from '@/types/auth'
import type { User } from '@/types/user'

type Level = User['role'] | 'noauth'

const levelMap = {
  noauth: 0,
  'temp-user': 1,
  user: 1,
  admin: 2,
  'super-admin': 3
}

/**
 * @deprecated no need to use api route anymore
 */
const handle = (
  func: (
    req: NextAuthRequest,
    ctx: AppRouteHandlerFnContext
  ) => ReturnType<AppRouteHandlerFn>,
  level: Level = 'user'
) => {
  return auth(async (req, ctx) => {
    if (level !== 'noauth') {
      if (!req.auth) {
        return Unauthorized('Unauthorized')
      }
      if (levelMap[req.auth.user.role] < levelMap[level]) {
        return Forbidden('No permission')
      }
    }
    try {
      return await func(req, ctx)
    } catch (error) {
      console.error(error)
      return InternalServerError(error)
    }
  })
}

export default handle
