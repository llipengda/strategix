'use client'

import { useEffect, useState } from 'react'
import ContentLoader from 'react-content-loader'

import dynamic from 'next/dynamic'

import Card from '@/components/card'

import './time-card.css'

const Clock = dynamic(() => import('react-clock'), {
  ssr: false,
  loading: () => (
    <ContentLoader speed={2} width={200} height={200}>
      <circle r={80} cx={100} cy={100} />
    </ContentLoader>
  )
})

const TimeCard = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Card className='min-w-[512px] max-lg:min-w-min max-lg:w-full'>
      <div className='flex items-center justify-center gap-10 p-4 px-6 flex-row max-lg:flex-col'>
        <Clock value={time} size={200} />
        <div className='flex gap-1 flex-col items-center -mt-4'>
          <p className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-1'>
            {time.getFullYear()}年{time.getMonth() + 1}月{time.getDate()}日
          </p>
          <p className='text-5xl text-gray-900 dark:text-gray-100 font-semibold'>
            <time suppressHydrationWarning>{time.toLocaleTimeString()}</time>
          </p>
        </div>
      </div>
    </Card>
  )
}

export default TimeCard
