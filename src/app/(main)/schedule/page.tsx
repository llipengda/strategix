import {getCurrentUser} from "@/lib/actions/user";

const Page = async () => {
  const user = await getCurrentUser()

  return (

      <div className='w-full h-full bg-white flex flex-col *:w-full'>
        <div className='w-full flex flex-row max-lg:flex-col gap-2'>
          <div className=' bg-pink-500 flex flex-col aspect-video w-1/2 max-lg:w-full'>
            <div className=' h-6 text-xl bg-blue-300'>
              日历
            </div>
            <div className=' w-full grid grid-cols-7 grid-rows-5 flex-grow gap-1'>
              {'1'.repeat(31).split('').map((v, index) => (
                <div className='bg-amber-300 rounded-sm' key={index}>
                  {index}
                </div>
              ))}
            </div>
          </div>
          <div className='w-1/2 bg-red-400 max-lg:w-full max-lg:aspect-video'>
            今日头版
          </div>
        </div>

        <div className=' bg-blue-500 flex flex-col mt-4 gap-0.5 *:rounded-md *:bg-blue-400'>


            {'1'.repeat(40).split('').map(
              (v, i) => (
                <div key={i} className='flex justify-between p-2'>
                  <div>schedule title</div>
                  <div className='bg-red-300 p-0.5 rounded-md text-sm'>teamA</div>
                </div>
              )
            )}

        </div>
      </div>

  )
}

export default Page
