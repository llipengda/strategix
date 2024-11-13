import { BsFillPinAngleFill } from 'react-icons/bs'

import DraggableScroll from '@/components/draggable-scroll'
import { localFormat } from '@/lib/time'
import type { Announcement as TAnnouncement } from '@/types/announcement'

interface AnnouncementProps {
  announcement: TAnnouncement
  draggable?: boolean
}

const Announcement: React.FC<AnnouncementProps> = ({
  announcement,
  draggable = true
}) => {
  const Wrapper = draggable ? DraggableScroll : Div

  return (
    <Wrapper className='bg-blue-50 relative dark:bg-slate-900 rounded-md h-full p-2 shadow-md min-w-[30%] max-h-56 overflow-y-auto'>
      {announcement.pin && (
        <BsFillPinAngleFill
          className='absolute top-1 right-1 text-blue-500 dark:text-slate-400 drop-shadow-lg'
          size={24}
        />
      )}
      <div>
        <p>{announcement.publisherName}</p>
        <p className='text-xs text-gray-700 dark:text-gray-300'>
          {localFormat(announcement.createdAt)}
        </p>
      </div>
      <div className='mt-2'>
        <p>{announcement.content}</p>
      </div>
      <div className='absolute bottom-0 right-0 px-2 py-1 rounded-tl-lg rounded-br-lg bg-red-500/80 text-white cursor-pointer hover:bg-red-600'>删除</div>
    </Wrapper>
  )
}

const Div: React.FC<React.PropsWithChildren> = props => {
  return <div {...props}>{props.children}</div>
}

export default Announcement
