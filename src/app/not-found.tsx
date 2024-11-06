import Link from 'next/link'

const NotFound = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='text-center p-8 bg-transparent rounded-lg -mt-40'>
        <h1 className='text-6xl font-bold text-blue-500'>404</h1>
        <h2 className='mt-4 text-2xl font-semibold text-gray-800'>NOT FOUND</h2>
        <p className='mt-2 text-gray-600'>页面不存在</p>
        <Link
          className='inline-block mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-200'
          href='/'
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}

export default NotFound
