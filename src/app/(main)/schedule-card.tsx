import Schedules from '@/app/(main)/schedules'
import Card from '@/components/card'

const ScheduleCard = () => {
  return (
    <Card className='h-80 min-w-[360px] max-xl:min-w-[512px] max-lg:min-w-min max-lg:w-full flex flex-col'>
      <h1 className='text-2xl font-bold border-b-2 border-gray-200 pb-1 mb-2'>
        日程
      </h1>
      <Schedules />
    </Card>
  )
}

export default ScheduleCard
