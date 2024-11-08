import { getPosts, getPostsStartingToday } from '@/lib/actions/post'

export const getSchedules = async (
  year: number,
  month: number,
  day?: number
) => {
  const posts = getPosts(year, month, day)

  // TODO: 其他类型的 schedule
  return await posts
}

export const getSchedulesStartingToday = async () => {
  const posts = getPostsStartingToday()

  // TODO: 其他类型的 schedule
  return await posts
}
