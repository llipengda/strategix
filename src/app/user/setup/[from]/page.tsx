import { redirect } from 'next/navigation'

import { auth } from '@/auth'

const Page = async ({
  params: { from }
}: {
  params: {
    from: string
  }
}) => {
  const session = await auth()

  return (
    <>
      <h1>Setup</h1>
      <h2>from: {from}</h2>
      <p>Set up your account</p>
      <form
        action={async () => {
          'use server'
          //await unstable_update({ user: { ...session?.user, role: 'user' } })
          redirect(decodeURIComponent(from))
        }}
      >
        <button type='submit'>Create Account</button>
      </form>
      <form action={async () => {
        'use server'
        //await unstable_update({ user: { ...session?.user, role: 'temp-user' } })
      }}>
        <button type='submit'>!!!!!!</button>
      </form>
    </>
  )
}

export default Page
