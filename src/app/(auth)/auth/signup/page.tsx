import EmailForm from '@/components/email-form'

const Page = async (props: Page) => {
  const searchParams = await props.searchParams
  const callbackUrl = searchParams?.callbackUrl || '/'

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-title'>注册新用户</h2>
      <p className='text-center text-sm text-disabled'>
        如果您已经注册，此操作将使您<strong>登录</strong>到已有账号
      </p>
      <EmailForm callbackUrl={callbackUrl} />
    </>
  )
}

export default Page
