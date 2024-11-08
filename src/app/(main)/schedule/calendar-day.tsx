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
      className={`${v.date ? (isWorkday ? 'dark:bg-slate-800 bg-slate-200' : 'dark:bg-slate-700 bg-blue-100 ') : 'opacity-0'} transition-[height] duration-300 ease-in-out rounded-md w-[14.285%] min-h-28 h-auto relative overflow-hidden p-2 block ${isToday ? 'animate-pulse bg-slate-300 border-black/10 dark:border-white/20 border-2' : ''} ${v.date ? 'cursor-pointer' : 'cursor-default pointer-events-none'}`}
      key={index}
    >
      <div>{getDayName(v.day)}</div>
      <div>{v.date}</div>
      {v.posts && v.posts?.length > 1 && (
        <div className='absolute right-2 top-2 group-hover:opacity-0 transition-[opacity] duration-300 ease-in-out'>
          <span className='text-lg mr-1'>+{v.posts?.length - 1}</span>
          <span className='text-sm align-top'>个日程</span>
        </div>
      )}
      <div className='flex flex-col gap-1'>
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
                  <span className='dark:bg-yellow-600/50 bg-yellow-400 rounded-sm text-sm px-1 py-0.5 mr-1'>
                    头版
                  </span>
                )}
                <span className={!pushed ? '' : ' line-through'}>
                  {p.title}
                </span>
              </p>
              <p className='dark:bg-black/30 bg-white/35 w-fit py-0.5 px-1 rounded-md text-xs mt-0.5'>
                {p.team}
              </p>
              {pushed && (
                <div className='absolute right-1 top-1'>
                  <FaCheckCircle className='text-green-700' />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Link>
  )
}
