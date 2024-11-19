import { NextResponse } from 'next/server'

import Ably from 'ably'

import { auth } from '@/auth'

export const revalidate = 0

export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = new Ably.Rest(process.env.ABLY_API_KEY!)
  const tokenRequestData = await client.auth.requestToken({
    clientId: session.user.id
  })
  return NextResponse.json(tokenRequestData)
}
