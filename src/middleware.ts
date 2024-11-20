import { auth } from '@/auth'

const allowed = [
  '/',
  '/auth/signin',
  '/auth/signin/email',
  '/auth/signup',
  '/auth/verify-request',
  '/auth/error'
]

const allowedTempUser = ['/auth/setup']

export default auth(req => {
  const { pathname } = req.nextUrl
  if (!req.auth && !allowed.includes(pathname)) {
    const newUrl = new URL(
      `/auth/signin?callbackUrl=${pathname}`,
      req.nextUrl.origin
    )
    return Response.redirect(newUrl)
  }

  if (
    req.auth?.user.role === 'temp-user' &&
    !allowedTempUser.includes(pathname)
  ) {
    const newUrl = new URL(
      `/auth/setup?callbackUrl=${pathname}`,
      req.nextUrl.origin
    )
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: [
    '/((?!api(?!/download)|_next/static|_next/image|favicon.ico|sw.*|sw[e]-worker.*|icon-.*|manifest.json).*)'
  ]
}
