export interface WeatherData {
  queryCost: number
  latitude: number
  longitude: number
  resolvedAddress: string
  address: string
  timezone: string
  tzoffset: number
  description: string
  days: Day[]
  currentConditions: Conditions
}

interface Day extends Conditions {
  hours: Conditions[]
}

interface Conditions {
  datetime: string
  datetimeEpoch: number
  tempmax: number
  tempmin: number
  temp: number
  feelslikemax: number
  feelslikemin: number
  feelslike: number
  dew: number
  humidity: number
  windspeed: number
  conditions: string
  description: string
  icon: Icon
  stations: string[]
  source: string
}

type Icon =
  | 'snow'
  | 'rain'
  | 'fog'
  | 'wind'
  | 'cloudy'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'clear-day'
  | 'clear-night'
