import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

export const localDate = () => toZonedTime(new Date(), 'Asia/Shanghai')

export const localNow = () => toZonedTime(Date.now(), 'Asia/Shanghai')

export const localISOFormat = () =>
  formatInTimeZone(new Date(), 'Asia/Shanghai', "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

export const localFormat = (date: Date | string) =>
  formatInTimeZone(date, 'Asia/Shanghai', 'yyyy-MM-dd HH:mm:ss')
