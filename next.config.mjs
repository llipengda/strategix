import nextPWA from 'next-pwa'

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

export default withPWA(nextConfig)
