import Announcement from '@/app/(main)/announcement'
import DraggableScroll from '@/components/draggable-scroll'
import { getAllAnnouncements } from '@/lib/actions/announcement'

const Announcements = async () => {
  const announcements = await getAllAnnouncements()

  if (announcements.length === 0) {
    return (
      <div className='w-full min-h-56 flex items-center justify-center'>
        <p className='text-center my-auto text-gray-400 italic'>暂时没有公告</p>
      </div>
    )
  }

  return (
    <div className='relative flex-grow'>
      <DraggableScroll className='flex overflow-x-auto mt-2 gap-3 absolute inset-0 first:-ml-3 select-none'>
        {announcements.map(a => (
          <Announcement key={a.id} announcement={a} />
        ))}
      </DraggableScroll>
    </div>
  )
}

export default Announcements
