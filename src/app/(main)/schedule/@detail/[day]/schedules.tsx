import { FaCheckCircle } from 'react-icons/fa'

import { DeleteButton } from '@/components/delete-button'
import { deletePostAction } from '@/lib/actions/post'
import { getSchedules } from '@/lib/actions/schedule'
import { getHashColorByTeamName } from '@/lib/schedule'
import { getCurrentUser } from '@/lib/actions/user'

interface SchedulesProps {
  year: number
  month: number
  day: number
}

const Schedules: React.FC<SchedulesProps> = async ({ year, month, day }) => {
  const schedules = await getSchedules(year, month, day)
  const user = await getCurrentUser()
  const baseRight = user?.role === 'admin' || user?.role === 'super-admin'
  return (
    <div className='w-3/5 h-full dark:border-white/20 border-2 rounded-md p-6 max-lg:w-full'>
      <h2 className='text-2xl font-bold text-center'>
        日程：{year} 年 {month} 月 {day} 日
      </h2>
      {schedules.length === 0 ? (
        <div className='flex text-center text-lg my-auto h-full items-center justify-center italic text-gray-400 dark:text-gray-600'>
          <p>当前日期暂无日程</p>
        </div>
      ) : (
        <ul className='flex mt-8 items-center w-full h-full flex-col gap-2'>
          {schedules.map(p => {
            const pushed =
              new Date(p.publishDate).getTime() <= new Date().getTime()
            return (
              <div
                key={p.id}
                className='text-base py-3 px-4 rounded-lg relative w-full space-y-1'
                style={{
                  backgroundColor: getHashColorByTeamName(p.team)
                }}
              >
                <p>
                  {p.isFrontPage && (
                    <span className='dark:bg-yellow-600/50 bg-yellow-400 rounded-md text-base px-1 py-0.5 mr-1'>
                      头版
                    </span>
                  )}
                  <span className={!pushed ? '' : ' line-through'}>
                    {p.title}
                  </span>
                </p>
                <p className='dark:bg-black/30 bg-white/35 w-fit py-0.5 px-1 rounded-lg text-sm'>
                  {p.team}
                </p>
                {pushed && (
                  <div className='absolute right-4 top-2'>
                    <FaCheckCircle className='text-green-700 text-lg' />
                  </div>
                )}
                {baseRight && (<form
                  action={deletePostAction.bind(
                    null,
                    p,
                    `/schedule/${day}?year=${year}&month=${month}#detail`
                  )}
                >
                  <DeleteButton />
                </form>
                )}
              </div>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Schedules
