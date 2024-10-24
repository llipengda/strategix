import { SessionProvider } from 'next-auth/react'

const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default Layout
