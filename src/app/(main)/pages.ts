const pages = [
  { name: '团队', url: '/team' },
  { name: '用户', url: '/user' },
  {name:'计划', url: '/schedule'}
] satisfies {
  name: string
  url: string
}[]

export default pages
