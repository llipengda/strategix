import { HiOutlineExternalLink } from 'react-icons/hi'

import Link from 'next/link'

import Schedules from '@/app/(main)/schedules'
import Card from '@/components/card'

const ScheduleCard = () => {
  return (
    <Card className='h-80 min-w-[360px] max-xl:min-w-[512px] max-lg:min-w-min max-lg:w-full flex flex-col'>
      <h1 className='text-2xl font-bold border-b-2 border-gray-200 pb-1 mb-2 flex items-center justify-between'>
        日程
        <Link href='/schedule' className='hover:text-blue-500'>
          <HiOutlineExternalLink />
        </Link>
      </h1>
      <Schedules />
    </Card>
  )
}

export default ScheduleCard
