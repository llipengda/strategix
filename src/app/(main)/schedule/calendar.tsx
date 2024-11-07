import { getPosts } from "@/lib/actions/post";
import { Post } from "@/types/post";
import MonthForm from "./month-form";
import CalendarRender from "./calendar-render";
import { IDateInfo } from "@/types/date-info";


const generateDateInfo = async (year: number, month: number) => {
  const postInfo: Post[] = await getPosts(year, month)
  const dateInfo: IDateInfo[] = []
  const getHowManyDate = (year: number, month: number) => {
    switch (month) {
      case 1: return 31;
      case 2:
        // 判断是否是闰年
        if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
          return 29;
        }
        return 28;
      case 3: return 31;
      case 4: return 30;
      case 5: return 31;
      case 6: return 30;
      case 7: return 31;
      case 8: return 31;
      case 9: return 30;
      case 10: return 31;
      case 11: return 30;
      case 12: return 31;
      default: return 30;
    }
  }
  const dateNum = getHowManyDate(year, month);
  const predays = new Date(year, month - 1, 1).getDay();
  for (let i = 1; i <= predays; i++)
    dateInfo.push({ day: i });
  for (let i = 0; i < dateNum; i++) {
    dateInfo.push({
      day: (predays + i) % 7,
      date: i + 1,
      posts: postInfo.filter(v => {
        const d = new Date(v.publishDate)
        return d.getDate() === i
      })
    });
  }
  return dateInfo
}



const Calendar = async ({ year, month }: { year: number, month: number }) => {

  const dateInfo = await generateDateInfo(year, month)

  return (
    <>
      <div className='font-bold text-2xl dark:bg-slate-800  py-1 px-2 rounded-md mb-2'>本月日历</div>
      <MonthForm year={year} month={month} />
      <CalendarRender dateInfo={dateInfo} year={year} month={month} />
    </>

  )
}

export default Calendar
