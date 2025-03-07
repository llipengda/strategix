import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js'
})

export default withSerwist({
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: '5mb'
    }
  }
})
