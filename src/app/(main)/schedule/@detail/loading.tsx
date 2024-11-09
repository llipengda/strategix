import AdaptiveContentLoader from '@/components/adaptive-content-loader'

const Loading = () => {
  return (
    <div
      id='detail'
      className='flex w-full h-full gap-8 max-md:gap-2 max-md:flex-col'
    >
      <AdaptiveContentLoader className='w-3/5 h-full dark:border-white/20 border-2 rounded-md max-lg:w-full' />
      <AdaptiveContentLoader className='flex flex-col gap-2 w-2/5 h-[360px] dark:border-white/20 border-2 rounded-md max-lg:w-full' />
    </div>
  )
}

export default Loading
