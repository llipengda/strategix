import { type NextRequest, NextResponse } from 'next/server'

import { generateSignedUrl } from '@/lib/b2'

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) => {
  const key = (await params).key
  const signedUrl = await generateSignedUrl(key, true)

  const noRedirect = req.nextUrl.searchParams.get('noRedirect') === 'true'

  if (noRedirect) {
    const data = await fetch(signedUrl)
    return new Response(data.body, {
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    })
  }

  return NextResponse.redirect(signedUrl)
}
