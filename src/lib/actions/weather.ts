'use server'

import { localDate, localISOFormat } from '@/lib/time'
import type { WeatherData } from '@/types/weather'

process.env.TZ = 'Asia/Shanghai'

export async function getWeather(latitude: number, longitude: number) {
  const today = localISOFormat().split('T')[0]
  const tomorrow = new Date(localDate().getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const data = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}/${today}/${tomorrow}?key=${process.env.VISUAL_CROSSING_API_KEY}&lang=zh&unitGroup=metric`,
    { next: { revalidate: 3600, tags: ['weather'] } }
  )

  return (await data.json()) as WeatherData
}

export async function getWeatherByCity(city: string) {
  const today = localISOFormat().split('T')[0]
  const tomorrow = new Date(localDate().getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  const data = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${today}/${tomorrow}?key=${process.env.VISUAL_CROSSING_API_KEY}&lang=zh&unitGroup=metric`,
    { next: { revalidate: 3600, tags: ['weather'] } }
  )

  return (await data.json()) as WeatherData
}
