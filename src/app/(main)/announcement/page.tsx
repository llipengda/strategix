import Announcement from '@/app/(main)/announcement'
import { getAllAnnouncements } from '@/lib/actions/announcement'
import { getCurrentUser } from '@/lib/actions/user'

import { AddAnnouncement } from './add-announcement'

const AnnouncementPage = async () => {
  const announcements = await getAllAnnouncements()
  const user = await getCurrentUser()
  return (
    <div className='flex max-lg:flex-col gap-8'>
      {announcements.length === 0 ? (
        <div className='w-full min-h-56 flex items-center justify-center'>
          <p className='text-center my-auto text-gray-400 italic'>
            暂时没有公告
          </p>
        </div>
      ) : (
        <div className='p-8 bg-white dark:bg-gray-900 rounded-md shadow-md w-3/5 max-lg:w-full'>
          <h1 className='text-3xl font-bold mb-6'>公告</h1>
          <div className='flex flex-col gap-4'>
            {announcements.map(a => (
              <Announcement key={a.id} announcement={a} draggable={false} />
            ))}
          </div>
        </div>
      )}
      <AddAnnouncement user={user} />
    </div>
  )
}

export default AnnouncementPage
