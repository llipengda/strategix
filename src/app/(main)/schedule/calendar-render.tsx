'use client'

import { IDateInfo } from '@/types/date-info'

const getHashColorByTeamName = (team: string) => {
  let hash = 0
  for (let i = 0; i < team.length; i++) {
    hash = team.charCodeAt(i) + (hash << 5) - hash
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).slice(-2)
  }
  // if(!window.matchMedia('(prefers-color-scheme: dark)').matches)
  //   color+='80'
  return (color += '70')
}
const getDayName = (day: number) => {
  switch (day) {
    case 0:
      return '日'
    case 1:
      return '一'
    case 2:
      return '二'
    case 3:
      return '三'
    case 4:
      return '四'
    case 5:
      return '五'
    case 6:
      return '六'
    default:
      return '未知'
  }
}
const CalendarRender = ({
  dateInfo,
  year,
  month
}: {
  dateInfo: IDateInfo[]
  year: number
  month: number
}) => {
  return (
    <div className=' w-full grid grid-cols-7 grid-rows-5 flex-grow gap-1 mt-4'>
      {dateInfo.map((v, index) => {
        return (
          <div
            className={`${v.date ? (v.day > 0 && v.day < 6 ? 'dark:bg-slate-800 bg-slate-200 ' : 'dark:bg-slate-700 bg-blue-100 ') : 'opacity-0'} rounded-md p-2 ${v.date === new Date().getDate() && new Date().getFullYear() === year && new Date().getMonth() + 1 === month ? ' animate-pulse bg-slate-300 border-black/10 dark:border-white/20 border-2' : ''}`}
            key={index}
          >
            <div>{getDayName(v.day)}</div>
            <div>{v.date}</div>
            <div className='flex flex-col gap-1'>
              {v.posts?.map((_v, index) => {
                return (
                  <div
                    key={index}
                    className={`text-sm py-0.5 px-1 rounded-sm`}
                    style={{ backgroundColor: getHashColorByTeamName(_v.team) }}
                  >
                    <p>
                      <span
                        className={`dark:bg-yellow-600/50 bg-yellow-400 rounded-sm text-sm ${_v.isFrontPage ? 'px-1 py-0.5 mr-1 ' : ''}`}
                      >
                        {_v.isFrontPage ? '版头' : ''}
                      </span>
                      <span
                        className={`dark:bg-green-800 bg-green-500 rounded-sm text-sm ${new Date(_v.publishDate).getTime() <= new Date().getTime() ? 'px-1 py-0.5 mr-1' : ''}`}
                      >
                        {new Date(_v.publishDate).getTime() <=
                        new Date().getTime()
                          ? '已推送'
                          : ''}
                      </span>
                      <span
                        className={
                          new Date(_v.publishDate) > new Date()
                            ? ''
                            : ' line-through'
                        }
                      >
                        {_v.title}
                      </span>
                    </p>
                    <p className='dark:bg-black/30 bg-white/35 w-fit py-0.5 px-1 rounded-md text-xs mt-0.5'>
                      {_v.team}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default CalendarRender
