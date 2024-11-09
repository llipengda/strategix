import { FaCheckCircle } from 'react-icons/fa'

import Link from 'next/link'

import { getDayName, getHashColorByTeamName } from '@/lib/schedule'
import type { IDateInfo } from '@/types/date-info'

export default function CalendarDay(props: {
  v: IDateInfo
  year: number
  month: number
  index: number
}) {
  const { v, year, month, index } = props

  const isToday =
    v.date === new Date().getDate() &&
    new Date().getFullYear() === year &&
    new Date().getMonth() + 1 === month
  const isWorkday = v.day > 0 && v.day < 6

  return (
    <Link
      href={`/schedule/${v.date}?year=${year}&month=${month}#detail`}
      className={`${v.date ? (isWorkday ? 'dark:bg-slate-800 bg-slate-200' : 'dark:bg-slate-700 bg-blue-100 ') : 'opacity-0'} transition-[height] duration-300 ease-in-out rounded-md w-[14.285%] min-h-28 max-sm:min-h-16 max-lg:md:min-h-16 h-auto relative overflow-hidden p-2 block ${isToday ? 'animate-pulse bg-slate-300 border-black/10 dark:border-white/20 border-2' : ''} ${v.date ? 'cursor-pointer' : 'cursor-default pointer-events-none'}`}
      key={index}
    >
      <div className='max-sm:text-xs max-lg:md:text-xs'>
        {getDayName(v.day)}
      </div>
      <div className='max-sm:text-xs max-lg:md:text-xs'>{v.date}</div>
      {v.posts && v.posts?.length > 1 && (
        <div className='absolute right-2 top-2 group-hover:opacity-0 transition-[opacity] duration-300 ease-in-out max-sm:hidden max-lg:md:hidden'>
          <span className='text-lg lg:mr-1'>+{v.posts?.length - 1}</span>
          <span className='text-sm align-top max-xl:hidden'>个日程</span>
        </div>
      )}
      {v.posts && v.posts?.length > 0 && (
        <div className='absolute right-1 bottom-1 rounded-full bg-red-500 dark:bg-red-800 text-xs text-white w-4 text-center max-sm:block max-lg:md:block hidden'>
          {v.posts?.length}
        </div>
      )}
      <div className='flex flex-col gap-1 max-sm:hidden max-lg:md:hidden'>
        {v.posts?.map((p, index) => {
          const pushed =
            new Date(p.publishDate).getTime() <= new Date().getTime()
          return (
            <div
              key={index}
              className='text-sm py-0.5 px-1 rounded-sm relative'
              style={{
                backgroundColor: getHashColorByTeamName(p.team)
              }}
            >
              <p>
                {p.isFrontPage && (
                  <span className='dark:bg-yellow-600/50 bg-yellow-400 rounded-sm text-sm px-1 py-0.5 mr-1 max-md:text-xs'>
                    头版
                  </span>
                )}
                <span
                  className={`${!pushed ? '' : ' line-through'} max-lg:hidden break-words`}
                >
                  {p.title}
                </span>
              </p>
              <p className='dark:bg-black/30 bg-white/35 w-fit py-0.5 px-1 rounded-md text-xs mt-0.5'>
                {p.team}
              </p>
              {pushed && (
                <div className='absolute right-1 top-1'>
                  <FaCheckCircle className='text-green-600 bg-white rounded-full' />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Link>
  )
}
