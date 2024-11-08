export const getHashColorByTeamName = (team: string) => {
  let hash = 0
  for (let i = 0; i < team.length; i++) {
    hash = team.charCodeAt(i) + (hash << 5) - hash
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).slice(-2)
  }
  return (color += '70')
}

export const getDayName = (day: number) => {
  switch (day) {
    case 0:
      return '日'
    case 1:
      return '一'
    case 2:
      return '二'
    case 3:
      return '三'
    case 4:
      return '四'
    case 5:
      return '五'
    case 6:
      return '六'
    default:
      return '未知'
  }
}
