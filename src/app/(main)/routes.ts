const pages = [
  { name: '公告', url: '/announcement' },
  { name: '活动', url: '/activity' },
  { name: '任务', url: '/task' },
  { name: '日程', url: '/schedule' },
  { name: '团队', url: '/team' },
  { name: '用户', url: '/user' }
] satisfies {
  name: string
  url: string
}[]

export default pages
