import nextPWA from 'next-pwa'

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const withPWA = nextPWA({
  dest: 'public'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: '5mb'
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default withPWA(nextConfig)
