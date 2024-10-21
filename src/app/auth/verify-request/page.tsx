import { cookies } from 'next/headers'

const Page = () => {
  const emailType = cookies().get('email-type')?.value || 'signup'

  const type = emailType === 'signup' ? '注册' : '登录'

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-gray-800'>
        请检查您的电子邮箱
      </h2>
      <p className='text-center'>
        一封带有{type}链接的邮件已发送到您的邮箱
      </p>
      <p className='text-center text-gray-400'>您现在可以关闭此页面</p>
    </>
  )
}

export default Page
