import EditNameAndTime from '@/app/(main)/activity/new/edit-name-and-time'
import Edits from '@/app/(main)/activity/new/edits'
import { KeyContextProvider } from '@/app/(main)/activity/new/key-context'
import { getActivity } from '@/lib/actions/activity'
import type { Activity } from '@/types/activity/activity'

const Page: React.FC<PageProps> = async ({ searchParams }) => {
  const id = (await searchParams)?.id
  const sk = (await searchParams)?.sk

  let activity: Activity | null = null

  if (id) {
    const fullActivity = await getActivity(id)

    const found = fullActivity.find(a => a.type === 'activity')

    if (found) {
      activity = found
    }
  }

  return (
    <div>
      <h1 className='text-3xl text-center font-semibold mb-14'>
        {id ? `${activity?.name} - 编辑草案` : '创建新活动'}
      </h1>
      <div className='space-y-8'>
        <KeyContextProvider initialKey={id && sk ? { id, sk } : undefined}>
          <EditNameAndTime
            preValues={
              activity
                ? [activity.name, (activity.time || activity.timeRange)!]
                : undefined
            }
          />
          <Edits sections={activity?.sections || []} />
        </KeyContextProvider>
      </div>
    </div>
  )
}

export default Page
