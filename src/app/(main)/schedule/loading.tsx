import AdaptiveContentLoader from '@/components/adaptive-content-loader'

const dateInfo = Array.from({ length: 5 }, () =>
  Array.from({ length: 7 }, () => 0)
)

const Loading = () => {
  return (
    <>
      <div className='flex items-center justify-center gap-3'>
        <AdaptiveContentLoader className='w-[160px] h-[40px]' />
      </div>
      <div className=' w-full flex flex-col flex-grow gap-1 mt-4'>
        {dateInfo.map((vv, index) => {
          return (
            <div key={`row-${index}`} className='flex flex-row gap-1 max-h-28'>
              {vv.map((v, index) => (
                <AdaptiveContentLoader
                  key={index}
                  className='rounded-md w-[14.285%] min-h-28 max-sm:min-h-16 max-lg:md:min-h-16 h-auto relative overflow-hidden block'
                />
              ))}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Loading
