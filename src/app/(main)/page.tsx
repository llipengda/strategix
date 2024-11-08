import AnnouncementCard from '@/app/(main)/announcement-card'
import ScheduleCard from '@/app/(main)/schedule-card'
import TimeCard from '@/app/(main)/time-card'
import WeatherCard from '@/app/(main)/weather-card'
import '@/lib/database'

export default function Page() {
  return (
    <main className='flex items-center justify-center w-full'>
      <div className='flex flex-col items-center justify-center gap-8 max-md:px-2 max-lg:w-min max-md:gap-4 max-md:flex-col-reverse'>
        <div className='flex flex-row gap-8 max-md:gap-4 justify-center items-center max-xl:flex-col'>
          <TimeCard />
          <WeatherCard />
        </div>
        <div className='flex flex-row gap-8 max-md:gap-4 justify-center items-center max-xl:flex-col max-lg:w-full max-md:flex-col-reverse'>
          <ScheduleCard />
          <AnnouncementCard />
        </div>
      </div>
    </main>
  )
}
