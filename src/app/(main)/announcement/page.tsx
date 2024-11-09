import Announcement from '@/app/(main)/announcement'
import { getAllAnnouncements } from '@/lib/actions/announcement'

const AnnouncementPage = async () => {
  const announcements = await getAllAnnouncements()

  if (announcements.length === 0) {
    return (
      <div className='w-full min-h-56 flex items-center justify-center'>
        <p className='text-center my-auto text-gray-400 italic'>暂时没有公告</p>
      </div>
    )
  }

  return (
    <div className='p-8 bg-white dark:bg-gray-900 rounded-md shadow-md'>
      <h1 className='text-3xl font-bold mb-6'>公告</h1>
      <div className='flex flex-col gap-4'>
        {announcements.map(a => (
          <Announcement key={a.id} announcement={a} draggable={false} />
        ))}
      </div>
    </div>
  )
}

export default AnnouncementPage
