import type { NextResponse } from 'next/server'

import { InternalServerError } from '@/lib/response'

const handle = <T extends unknown[]>(
  // eslint-disable-next-line no-unused-vars
  func: (...args: T) => NextResponse | Promise<NextResponse>
) => {
  return async (...args: T) => {
    try {
      return await func(...args)
    } catch (error) {
      console.error(error)
      return InternalServerError(error)
    }
  }
}

export default handle
