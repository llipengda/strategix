// UTC+8. This is because vercel's server uses UTC time.
const localTime = () => new Date(new Date().getTime() + 8 * 60 * 60 * 1000)

export default localTime
