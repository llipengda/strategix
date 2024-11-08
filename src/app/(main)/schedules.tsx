import DraggableScroll from '@/components/draggable-scroll'
import { getSchedulesStartingToday } from '@/lib/actions/schedule'
import { getHashColorByTeamName } from '@/lib/schedule'
import { localFormat } from '@/lib/time'
import { Post as TPost } from '@/types/post'

const Schedules = async () => {
  const schedules = await getSchedulesStartingToday()

  return (
    <div className='relative flex-grow'>
      <DraggableScroll className='overflow-y-auto inset-0 absolute flex flex-col gap-1'>
        {schedules.map(schedule => (
          <Post key={schedule.id} post={schedule} />
        ))}
      </DraggableScroll>
    </div>
  )
}

const Post = ({ post }: { post: TPost }) => {
  return (
    <div className='flex flex-col gap-1 bg-gray-100 dark:bg-gray-900 rounded-md p-2'>
      <p className='text-sm font-bold'>
        {localFormat(post.publishDate, 'yyyy-MM-dd')}
      </p>
      <p className='text-lg font-bold'>
        <span className='bg-blue-300 dark:bg-blue-600 rounded-md p-1 text-sm text-gray-700 dark:text-slate-100 mr-1'>
          推送
        </span>
        <span
          className='rounded-md p-1 text-sm text-black dark:text-slate-100 mr-1'
          style={{ backgroundColor: getHashColorByTeamName(post.team) }}
        >
          {post.team}
        </span>
        {post.title}
      </p>
    </div>
  )
}

export default Schedules
