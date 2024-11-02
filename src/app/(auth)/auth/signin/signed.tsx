'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'nextjs-toploader/app'

const Signed = ({ callbackUrl }: { callbackUrl: string }) => {
  const [time, setTime] = useState(3)

  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => (prev - 1 < 0 ? 0 : prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (time === 0) {
      router.replace(callbackUrl)
    }
  }, [time])

  return (
    <>
      <h2 className='text-2xl font-bold text-center text-title'>您已登录</h2>
      <p className='text-center text-disabled'>
        {time} 秒后将自动跳转至上一页面
      </p>
    </>
  )
}

export default Signed
