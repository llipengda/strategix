import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

import Link from 'next/link'

import { local } from '@/lib/time'

interface CalendarTitleProps {
  year: number
  month: number
}

const CalendarTitle: React.FC<CalendarTitleProps> = ({ year, month }) => {
  const preMonth = () => {
    const date = local(new Date(year, month - 1, 1))
    date.setMonth(date.getMonth() - 1)
    const newYear = date.getFullYear()
    const newMonth = date.getMonth() + 1
    return `/schedule?year=${newYear}&month=${newMonth}`
  }

  const nextMonth = () => {
    const date = local(new Date(year, month - 1, 1))
    date.setMonth(date.getMonth() + 1)
    const newYear = date.getFullYear()
    const newMonth = date.getMonth() + 1
    return `/schedule?year=${newYear}&month=${newMonth}`
  }

  return (
    <div className='flex items-center justify-center gap-3'>
      <Link href={preMonth()}>
        <IoIosArrowBack className='cursor-pointer' />
      </Link>
      <div className='font-bold text-2xl dark:bg-slate-800 text-center py-1 px-2 rounded-md'>
        {year} 年 {month} 月
      </div>
      <Link href={nextMonth()}>
        <IoIosArrowForward className='cursor-pointer' />
      </Link>
    </div>
  )
}

export default CalendarTitle
