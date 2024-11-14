import { BsFillPinAngleFill } from 'react-icons/bs'

import { DeleteButton } from '@/components/delete-button'
import DraggableScroll from '@/components/draggable-scroll'
import { deleteAnnouncementAction } from '@/lib/actions/announcement'
import { localFormat } from '@/lib/time'
import { Announcement as TAnnouncement } from '@/types/announcement'

interface AnnouncementProps {
  announcement: TAnnouncement
  showDelete: boolean
  draggable?: boolean
}

const Announcement: React.FC<AnnouncementProps> = ({
  announcement,
  showDelete,
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
      {
        showDelete  && (
          <form action={deleteAnnouncementAction.bind(null, announcement)}>
            <DeleteButton />
          </form>
        )
      }
    </Wrapper>
  )
}

const Div: React.FC<React.PropsWithChildren> = props => {
  return <div {...props}>{props.children}</div>
}

export default Announcement
