import Link from 'next/link'

const Page = async (props: Page) => {
  const searchParams = await props.searchParams
  const error = searchParams?.error

  if (error === 'Verification') {
    return (
      <>
        <h2 className='text-2xl font-bold text-center text-title'>验证失败</h2>
        <p className='text-center text-md text-disabled'>
          此链接已失效。其已被使用，或已过期。
        </p>
        <Link
          className='mx-auto text-center block w-3/4 px-4 py-2 font-semibold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700'
          href='/'
        >
          返回首页
        </Link>
      </>
    )
  }

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-title'>错误</h2>
      <p className='text-center text-md text-disabled'>
        发生了未知错误。请稍后再试。
      </p>
      <Link
        className='mx-auto text-center block w-3/4 px-4 py-2 font-semibold text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700'
        href='/'
      >
        返回首页
      </Link>
    </>
  )
}

export default Page
