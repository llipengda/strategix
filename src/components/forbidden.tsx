'use client'

import { useRouter } from 'nextjs-toploader/app'

import NProgress from 'nprogress'

const Forbidden = () => {
  const router = useRouter()

  const back = () => {
    NProgress.start()
    router.back()
  }

  return (
    <div className='flex items-center justify-center h-full'>
      <div className='text-center p-8 bg-transparent rounded-lg -mt-40'>
        <h1 className='text-6xl font-bold text-red-500'>403</h1>
        <h2 className='mt-4 text-2xl font-semibold text-gray-800'>拒绝访问</h2>
        <p className='mt-2 text-gray-600'>您没有权限访问此页面</p>
        <button
          className='inline-block mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-200'
          onClick={back}
        >
          返回
        </button>
      </div>
    </div>
  )
}

export default Forbidden
