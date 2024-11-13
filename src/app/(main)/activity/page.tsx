import { getActivities } from '@/lib/actions/activity'

const Page = async () => {
  const activities = await getActivities()

  return (
    <>
      <pre>{JSON.stringify(activities, null, 2)}</pre>
    </>
  )
}

export default Page
