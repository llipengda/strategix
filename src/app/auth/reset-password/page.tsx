import ResetForm from '@/app/auth/reset-password/reset-form'
import { auth } from '@/auth'

const Page = async (props: PageProps) => {
  const isReset = (await props.searchParams)?.isReset === 'true'

  const session = await auth()

  const email = session?.user?.email

  if (!email) {
    return null
  }

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-title'>
        {isReset ? '重设' : '设定'}密码
      </h2>
      <ResetForm email={email} />
    </>
  )
}

export default Page
