import AddPosts from '@/app/(main)/schedule/@detail/[day]/add-post'
import Schedules from '@/app/(main)/schedule/@detail/[day]/schedules'
import { auth } from '@/auth'
import { localDate } from '@/lib/time'

const Page: React.FC<PageProps> = async ({ params }) => {
  const date = localDate()

  const year = Number((await params)?.year ?? date.getFullYear())

  const month = Number((await params)?.month ?? date.getMonth() + 1)

  const day = Number((await params)?.day ?? date.getDate())

  const user = (await auth())?.user

  return (
    <div
      id='detail'
      className='flex w-full h-full gap-8 max-md:gap-2 max-lg:flex-col'
    >
      <Schedules year={year} month={month} day={day} />
      <AddPosts year={year} month={month} day={day} user={user!} />
    </div>
  )
}

export default Page
