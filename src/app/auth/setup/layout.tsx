import { Suspense } from 'react'

import { SessionProvider } from 'next-auth/react'

const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <SessionProvider>
      <Suspense>{children}</Suspense>
    </SessionProvider>
  )
}

export default Layout
