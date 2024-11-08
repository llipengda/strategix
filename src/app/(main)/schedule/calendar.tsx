import CalendarTitle from '@/app/(main)/schedule/calendar-title'

import CalendarRender from './calendar-render'

const Calendar = async ({ year, month }: { year: number; month: number }) => {
  return (
    <>
      <CalendarTitle year={year} month={month} />
      <CalendarRender year={year} month={month} />
    </>
  )
}

export default Calendar
