import { getPosts, getPostsStartingToday } from '@/lib/actions/post'

export const getSchedules = async (year: number, month: number) => {
  const posts = getPosts(year, month)

  // TODO: 其他类型的 schedule
  return await posts
}

export const getSchedulesStartingToday = async () => {
  const posts = getPostsStartingToday()

  // TODO: 其他类型的 schedule
  return await posts
}
