import Link from 'next/link'

import { auth } from '@/auth'
import '@/lib/database'

export default async function Page() {
  const session = await auth()

  return (
    <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
      hello
      <pre className='break-all whitespace-pre-wrap'>{JSON.stringify(session, null, 2)}</pre>
      <Link href='/auth/signin'>signin</Link>
      <Link href='/auth/signout'>signout</Link>
    </main>
  )
}
