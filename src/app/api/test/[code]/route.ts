import type { NextRequest } from 'next/server'

import handle from '@/lib/handle'
import { Status } from '@/lib/response'

export const GET = handle(
  (req: NextRequest, { params }) => {
    const code = Number(params?.code)
    return Status(code, `code is ${code}`)
  }
)
