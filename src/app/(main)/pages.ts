const pages = [
  { name: '团队', url: '/team' },
  { name: '日程', url: '/schedule' },
  { name: '用户', url: '/user' }
] satisfies {
  name: string
  url: string
}[]

export default pages
