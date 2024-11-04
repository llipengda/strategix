import UserInfo from '@/app/(main)/user/user-info'
import { getCurrentUser } from '@/lib/actions/user'

const Page = async () => {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return (
    <>
      <h1 className='text-title text-3xl'>
        欢迎，<span className='font-semibold'>{user.name}</span>
      </h1>
      <UserInfo user={user} currentUser={user} />
    </>
  )
}

export default Page
