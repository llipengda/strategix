import AdaptiveContentLoader from '@/components/adaptive-content-loader'

export const WeatherFallback = () => {
  return (
    <AdaptiveContentLoader className='min-h-[280px] min-w-[360px] max-xl:min-w-[512px] max-lg:min-w-min max-lg:w-full' />
  )
}

export const ScheduleFallback = () => {
  return (
    <AdaptiveContentLoader className='h-80 min-w-[360px] max-xl:min-w-[512px] max-lg:min-w-min max-lg:w-full' />
  )
}

export const AnnouncementFallback = () => {
  return (
    <AdaptiveContentLoader className='min-w-[512px] max-lg:min-w-min max-lg:w-full min-h-80' />
  )
}

export const ClockFallback = () => {
  return <AdaptiveContentLoader className='w-[200px] h-[200px] rounded-full' />
}
