import Activity from '@/app/(main)/activity/activity'
import { getBriefActivities } from '@/lib/actions/activity'

const Page = async () => {
  const activities = await getBriefActivities()

  return (
    <div className='flex max-lg:flex-col gap-8'>
      {activities.length === 0 ? (
        <div className='w-full min-h-56 flex items-center justify-center'>
          <p className='text-center my-auto text-gray-400 italic'>
            暂时没有活动
          </p>
        </div>
      ) : (
        <div className='p-8 bg-white dark:bg-gray-900 rounded-md shadow-md w-full max-lg:w-full'>
          <h1 className='text-3xl font-bold mb-6'>活动</h1>
          <div className='flex flex-col gap-4'>
            {activities.map(a => (
              <Activity key={a.id} activity={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
