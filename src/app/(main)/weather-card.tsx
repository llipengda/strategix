import React from 'react'

import Image from 'next/image'

import clearDay from '@/assets/icons/clear-day.svg'
import clearNight from '@/assets/icons/clear-night.svg'
import cloudy from '@/assets/icons/cloudy.svg'
import fog from '@/assets/icons/fog.svg'
import partlyCloudyDay from '@/assets/icons/partly-cloudy-day.svg'
import partlyCloudyNight from '@/assets/icons/partly-cloudy-night.svg'
import rain from '@/assets/icons/rain.svg'
import snow from '@/assets/icons/snow.svg'
import wind from '@/assets/icons/wind.svg'
import Card from '@/components/card'
import Tooltip from '@/components/tool-tip'
import { getWeatherByCity } from '@/lib/actions/weather'
import { localDate } from '@/lib/time'
import type { WeatherData } from '@/types/weather'

const getIcon = (iconString: WeatherData['currentConditions']['icon']) => {
  switch (iconString) {
    case 'snow':
      return snow as string
    case 'rain':
      return rain as string
    case 'fog':
      return fog as string
    case 'wind':
      return wind as string
    case 'cloudy':
      return cloudy as string
    case 'partly-cloudy-day':
      return partlyCloudyDay as string
    case 'partly-cloudy-night':
      return partlyCloudyNight as string
    case 'clear-day':
      return clearDay as string
    case 'clear-night':
      return clearNight as string
    default:
      throw new Error('Unknown weather icon')
  }
}

const WeatherCard = async () => {
  const weatherData = await getWeatherByCity('Shanghai')

  if (!weatherData) {
    return (
      <Card className='min-h-[280px] min-w-[360px] max-xl:min-w-[512px] max-lg:min-w-min max-lg:w-full flex items-center justify-center'>
        <Tooltip message='联系管理员以获取更多信息' className='cursor-help'>
          天气信息不可用
        </Tooltip>
      </Card>
    )
  }

  const today = weatherData.days[0]
  const tomorrow = weatherData.days[1]
  const currentConditions = weatherData.currentConditions

  const hours = today.hours.concat(
    tomorrow.hours
      .filter(h => parseInt(h.datetime.split(':')[0]) < 6)
      .map(h => ({
        ...h,
        datetime: `${parseInt(h.datetime.split(':')[0]) + 24}:00`
      }))
  )

  const nowHour = localDate().getHours()

  return (
    <Card className='min-h-[280px] min-w-[360px] max-xl:min-w-[512px] max-lg:min-w-min max-lg:w-full'>
      <div className='flex flex-row items-center justify-center gap-12 mt-1 p-2 py-1'>
        <div className='flex flex-col items-center justify-center gap-1'>
          <Image
            src={getIcon(currentConditions.icon)}
            alt={today.conditions}
            className='w-[70px]'
          />
          <p className='text-3xl font-semibold text-gray-900 dark:text-gray-100'>
            {currentConditions.temp}
            <span className='text-lg align-top'>°C</span>
          </p>
          <p className='text-gray-600 dark:text-gray-400'>
            {currentConditions.conditions}
          </p>
        </div>
        <div className='text-gray-700 dark:text-gray-300 text-left space-y-1 whitespace-nowrap'>
          <p className='text-3xl font-bold'>
            {today.tempmin}~{today.tempmax}
            <span className='text-lg align-top'>°C</span>
          </p>
          <p>
            体感 {today.feelslikemin}~{today.feelslikemax}°C
          </p>
          <p>湿度 {today.humidity}%</p>
          <p>风速 {today.windspeed} km/h</p>
        </div>
      </div>
      <div className='flex flex-row gap-3 text-sm mt-4 items-center justify-center'>
        {hours.map(hour => {
          const h = parseInt(hour.datetime.split(':')[0])
          if (h < nowHour || h > nowHour + 5) {
            return null
          }
          return (
            <div
              key={hour.datetime}
              className='text-gray-700 dark:text-gray-300 flex items-center justify-center flex-col gap-1'
            >
              <p>{h >= 24 ? h - 24 : h}:00</p>
              <Image
                className='w-[20px] h-[20px]'
                src={getIcon(hour.icon)}
                alt={hour.conditions}
              />
              <p>{hour.temp}°C</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default WeatherCard
