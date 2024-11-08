import Calendar from '@/app/(main)/schedule/calendar'
import { localDate } from '@/lib/time'

const Page = async (props: PageProps) => {
  const p = await props.searchParams
  const year = p?.year ?? localDate().getFullYear()
  const month = p?.month ?? localDate().getMonth() + 1

  return <Calendar year={Number(year)} month={Number(month)} />
}

export default Page
