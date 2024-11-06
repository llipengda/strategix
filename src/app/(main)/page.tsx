import TimeCard from '@/app/(main)/components/time-card'
import WeatherCard from '@/app/(main)/components/weather-card'
import '@/lib/database'

export default async function Page() {
  return (
    <main className='flex flex-row gap-8 max-md:gap-4 max-md:px-2 justify-center items-center max-xl:flex-col'>
      <TimeCard />
      <WeatherCard />
    </main>
  )
}
