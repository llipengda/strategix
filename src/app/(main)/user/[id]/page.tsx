import { notFound } from 'next/navigation'

import UserInfo from '@/app/(main)/user/user-info'
import Forbidden from '@/components/forbidden'
import { getCurrentUser, getUser } from '@/lib/actions/user'
import { role } from '@/lib/role'

const Page = async ({ params }: Page) => {
  const id = (await params)?.id as string | undefined

  if (!id) {
    return notFound()
  }

  const currentUser = (await getCurrentUser())!

  if (!role.admin(currentUser)) {
    return <Forbidden />
  }

  const user = await getUser(id)

  if (!user) {
    return notFound()
  }

  return <UserInfo user={user} currentUser={currentUser} />
}

export default Page
