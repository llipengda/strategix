import Calendar from '@/app/(main)/schedule/calendar'

import AddPosts from './add-post'

const Page = async (props: PageProps) => {
  const p = await props.searchParams
  const year =
    p?.year === undefined
      ? new Date().getFullYear()
      : parseInt(p.year)
  const month =
    p?.month === undefined
      ? new Date().getMonth() + 1
      : parseInt(p.month)
  return (
    <div className='w-full h-full flex flex-col *:w-full gap-2'>
      <div className='flex flex-col aspect-video w-3/4 mx-auto dark:border-white/10 border-2 rounded-md p-2'>
        <Calendar year={year} month={month} />
      </div>
      <div className='flex flex-col gap-0.5 *:rounded-md'>
        <AddPosts />
      </div>
    </div>
  )
}
export default Page
