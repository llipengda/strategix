import Announcement from '@/app/(main)/announcement'
import { getAllAnnouncements } from '@/lib/actions/announcement'
import { getCurrentUser } from '@/lib/actions/user'

import { AddAnnouncement } from './add-announcement'

const AnnouncementPage = async () => {
  const announcements = await getAllAnnouncements()
  const user = await getCurrentUser()
  const baseRight = user?.role === 'admin' || user?.role === 'super-admin'
  const queryDeleteRight = (publisherId?: string) => {
    if (user?.role === 'super-admin') return true
    if (user?.role === 'admin') return user.id === publisherId
    return false
  }

  return (
    <div className='flex max-lg:flex-col gap-8'>
      {announcements.length === 0 ? (
        <div
          className={`min-h-56 flex items-center justify-center ${baseRight ? 'w-3/5' : 'w-full'}`}
        >
          <p className='text-center my-auto text-gray-400 italic'>
            暂时没有公告
          </p>
        </div>
      ) : (
        <div
          className={`p-8 bg-white dark:bg-gray-900 rounded-md shadow-md max-lg:w-full ${baseRight ? 'w-3/5' : 'w-full'}`}
        >
          <h1 className='text-3xl font-bold mb-6'>公告</h1>
          <div className='flex flex-col gap-4'>
            {announcements.map(a => (
              <Announcement
                key={a.id}
                announcement={a}
                draggable={false}
                showDelete={queryDeleteRight(a.publisherId)}
              />
            ))}
          </div>
        </div>
      )}
      {baseRight && <AddAnnouncement user={user} />}
    </div>
  )
}

export default AnnouncementPage
