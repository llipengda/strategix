import { HiOutlineExternalLink } from 'react-icons/hi'

import Link from 'next/link'

import Announcements from '@/app/(main)/announcements'
import Card from '@/components/card'

const AnnouncementCard = () => {
  return (
    <Card className='min-w-[512px] max-lg:min-w-min max-lg:w-full min-h-80 py-4 flex flex-col pb-0'>
      <h1 className='text-2xl font-bold border-b-2 border-gray-200 pb-1 mb-2 flex items-center justify-between'>
        公告
        <Link href='/announcement' className='hover:text-blue-500'>
          <HiOutlineExternalLink />
        </Link>
      </h1>
      <Announcements />
    </Card>
  )
}

export default AnnouncementCard
