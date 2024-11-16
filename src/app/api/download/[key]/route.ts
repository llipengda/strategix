import { type NextRequest, NextResponse } from 'next/server'

import { generateSignedUrl } from '@/lib/b2'

export const dynamic = 'force-static'

export const revalidate = 2592000

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) => {
  const key = (await params).key
  const signedUrl = await generateSignedUrl(key, true)

  const data = await fetch(signedUrl)
  return new Response(data.body, {
    headers: {
      ...Object.fromEntries(
        Array.from(data.headers.entries()).filter(
          ([key]) => !key.toLowerCase().includes('content-disposition')
        )
      ),
      'Content-Disposition': `attachment; filename="${encodeURIComponent(key.split('/').pop() || '')}"`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'X-Download-Options': 'noopen'
    }
  })
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}

export async function HEAD() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}
