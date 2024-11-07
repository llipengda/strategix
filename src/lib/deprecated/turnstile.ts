/**
 * @deprecated
 * @param response
 * @param ip
 */
export const verifyTurnstile = async (response: string, ip: string) => {
  const verifyFormData = new FormData()
  verifyFormData.append(
    'secret',
    process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY!
  )
  verifyFormData.append('response', String(response))
  verifyFormData.append('remoteip', String(ip))

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: verifyFormData
    })

    const outcome = (await res.json()) as { success?: boolean } | undefined

    return outcome?.success || false
  } catch (e) {
    console.error(e)
    return false
  }
}
