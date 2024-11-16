import { type NextRequest, NextResponse } from 'next/server'

import { generateSignedUrl } from '@/lib/b2'

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) => {
  const key = (await params).key
  const signedUrl = await generateSignedUrl(key, true)

  const noRedirect = req.nextUrl.searchParams.get('noRedirect') === 'true'
  const noDownload = req.nextUrl.searchParams.get('noDownload') === 'true'

  if (noRedirect) {
    const data = await fetch(signedUrl)
    if (noDownload) {
      return new Response(data.body)
    }
    return new Response(data.body, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${decodeURIComponent(key.split('/').pop() || '')}"`
      }
    })
  }

  return NextResponse.redirect(signedUrl)
}
