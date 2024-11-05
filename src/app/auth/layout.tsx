import { ReCaptchaProvider } from 'next-recaptcha-v3'

const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-page-bg max-sm:bg-card-bg'>
      <div className='w-full max-w-md p-8 space-y-6 rounded-lg shadow-md bg-card-bg max-sm:max-w-full max-sm:rounded-none max-sm:my-auto max-sm:shadow-none'>
        <ReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECHAPTCHA_SITE_KEY}
          useRecaptchaNet
        >
          {children}
        </ReCaptchaProvider>
      </div>
    </div>
  )
}

export default Layout
