'use client'

import ContentLoader from 'react-content-loader'

import useTheme from '@/lib/hooks/use-theme'

export const WeatherFallback = () => {
  const theme = useTheme()

  const isDark = theme === 'dark'

  return (
    <ContentLoader
      className='min-h-[280px] min-w-[360px] max-xl:min-w-[512px] max-lg:min-w-min max-lg:w-full'
      backgroundColor={isDark ? '#111' : '#eee'}
      foregroundColor={isDark ? '#333' : '#f5f5f5'}
      uniqueKey='weather-fallback'
    >
      <rect x='0' y='0' rx='4' ry='4' width='100%' height='100%' />
    </ContentLoader>
  )
}

export const ScheduleFallback = () => {
  const theme = useTheme()

  const isDark = theme === 'dark'

  return (
    <ContentLoader
      className='h-80 min-w-[360px] max-xl:min-w-[512px] max-lg:min-w-min max-lg:w-full'
      backgroundColor={isDark ? '#111' : '#eee'}
      foregroundColor={isDark ? '#333' : '#f5f5f5'}
      uniqueKey='schedule-fallback'
    >
      <rect x='0' y='0' rx='4' ry='4' width='100%' height='100%' />
    </ContentLoader>
  )
}

export const AnnouncementFallback = () => {
  const theme = useTheme()

  const isDark = theme === 'dark'

  return (
    <ContentLoader
      className='min-w-[512px] max-lg:min-w-min max-lg:w-full min-h-80'
      backgroundColor={isDark ? '#111' : '#eee'}
      foregroundColor={isDark ? '#333' : '#f5f5f5'}
      uniqueKey='announcement-fallback'
    >
      <rect x='0' y='0' rx='4' ry='4' width='100%' height='100%' />
    </ContentLoader>
  )
}

export const ClockFallback = () => {
  const theme = useTheme()

  const isDark = theme === 'dark'

  return (
    <ContentLoader
      speed={2}
      width={200}
      height={200}
      backgroundColor={isDark ? '#111' : '#eee'}
      foregroundColor={isDark ? '#333' : '#f5f5f5'}
      uniqueKey='clock-fallback'
    >
      <circle r={80} cx={100} cy={100} />
    </ContentLoader>
  )
}
