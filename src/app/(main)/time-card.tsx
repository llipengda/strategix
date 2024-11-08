'use client'

import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import { ClockFallback } from '@/app/(main)/fallbacks'
import Card from '@/components/card'
import { localDate } from '@/lib/time'

import './time-card.css'

const Clock = dynamic(() => import('react-clock'), {
  ssr: false,
  loading: () => <ClockFallback />
})

const TimeCard = () => {
  const [time, setTime] = useState(localDate())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(localDate())
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
            <time suppressHydrationWarning>
              {time.toLocaleTimeString('zh-CN')}
            </time>
          </p>
        </div>
      </div>
    </Card>
  )
}

export default TimeCard
