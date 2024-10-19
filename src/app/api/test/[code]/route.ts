import type { NextRequest } from 'next/server'

import handle from '@/lib/handle'
import { Status } from '@/lib/response'
import type Params from '@/types/params'

export const GET = handle(
  (req: NextRequest, { params: { code } }: Params<{ code: number }>) => {
    return Status(code, `code is ${code}`)
  }
)
