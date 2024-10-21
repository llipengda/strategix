export default async function validateCaptcha(captchaToken: string): Promise<boolean> {
  const minimumCaptchaScore = 0.7
  const secretKey = process.env.NEXT_PRIVATE_RECHAPTCHA_SECRET_KEY || ''
  const data = new FormData()
  data.append('secret', secretKey)
  data.append('response', captchaToken)
  const captchaResponse = await fetch(
    'https://www.recaptcha.net/recaptcha/api/siteverify',
    {
      method: 'POST',
      body: data
    }
  )
  const res = await captchaResponse.json()
  return res.score && res.score >= minimumCaptchaScore
}
