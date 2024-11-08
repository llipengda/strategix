import CalendarDay from '@/app/(main)/schedule/calendar-day'
import { getPosts } from '@/lib/actions/post'
import { IDateInfo } from '@/types/date-info'
import type { Post } from '@/types/post'

const generateDateInfo = async (year: number, month: number) => {
  const postInfo: Post[] = await getPosts(year, month)
  const dateInfo: IDateInfo[] = []
  const getHowManyDate = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }
  const dateNum = getHowManyDate(year, month)
  const preDays = new Date(year, month - 1, 1).getDay()
  for (let i = 1; i <= preDays; i++) dateInfo.push({ day: i })
  for (let i = 0; i < dateNum; i++) {
    const realDate = i + 1
    dateInfo.push({
      day: (preDays + i) % 7,
      date: realDate,
      posts: postInfo.filter(v => {
        const d = new Date(v.publishDate)
        return d.getDate() === realDate
      })
    })
  }
  const result: IDateInfo[][] = []
  let week: IDateInfo[] = []
  for (const info of dateInfo) {
    week.push(info)
    if (week.length === 7) {
      result.push(week)
      week = []
    }
  }
  if (week.length > 0) {
    result.push(week)
  }
  return result
}

const CalendarRender = async ({
  year,
  month
}: {
  year: number
  month: number
}) => {
  const dateInfo = await generateDateInfo(year, month)

  return (
    <div className=' w-full flex flex-col flex-grow gap-1 mt-4'>
      {dateInfo.map((vv, index) => {
        return (
          <div
            key={`row-${index}`}
            className='flex flex-row gap-1 hover:max-h-full max-h-28 transition-all duration-300 ease-in-out group'
          >
            {vv.map((v, index) => (
              <CalendarDay
                key={index}
                v={v}
                year={year}
                month={month}
                index={index}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
export default CalendarRender
