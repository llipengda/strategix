const pages = [
  { name: '团队', url: '/team' },
  { name: '用户', url: '/user' },
  { name: '日程', url: '/schedule' }
] satisfies {
  name: string
  url: string
}[]

export default pages
