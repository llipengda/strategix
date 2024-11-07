import AnnouncementCard from '@/app/(main)/announcement-card'
import TimeCard from '@/app/(main)/time-card'
import WeatherCard from '@/app/(main)/weather-card'
import '@/lib/database'

export default function Page() {
  return (
    <main className='flex flex-col items-center justify-center gap-8 max-md:px-2'>
      <div className='flex flex-row gap-8 max-md:gap-4 justify-center items-center max-xl:flex-col'>
        <TimeCard />
        <WeatherCard />
      </div>
      <div className='flex flex-row gap-8 max-md:gap-4 justify-center items-center max-xl:flex-col'>
        <AnnouncementCard />
      </div>
    </main>
  )
}
