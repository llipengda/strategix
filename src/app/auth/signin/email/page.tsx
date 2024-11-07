import EmailForm from '@/components/email-form'

const Page = async (props: PageProps) => {
  const searchParams = await props.searchParams
  const callbackUrl = searchParams?.callbackUrl || '/'

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-title'>
        通过电子邮件登录
      </h2>
      <p className='text-center text-sm text-disabled'>
        如果您没有账号，此操作将使您<strong>注册</strong>新账号
      </p>
      <EmailForm callbackUrl={callbackUrl} />
    </>
  )
}

export default Page
