import { auth } from '@/auth'

const allowed = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/verify-request',
  '/auth/signin/email'
]

const allowedTempUser = ['/auth/setup']

export default auth(req => {
  const { pathname } = req.nextUrl
  if (!req.auth && !allowed.includes(pathname)) {
    const newUrl = new URL('/auth/signin', req.nextUrl.origin)
    return Response.redirect(newUrl)
  }

  if (
    req.auth?.user.role === 'temp-user' &&
    !allowedTempUser.includes(pathname)
  ) {
    const newUrl = new URL('/auth/setup', req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
