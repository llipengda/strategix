'use client'

import Input from '@/components/input'
import SubmitButton from '@/components/submit-button'
import { addAnnouncementAction } from '@/lib/actions/announcement'
import { User } from '@/types/user'

export const AddAnnouncement = ({ user }: { user: User | null }) => {
  return (
    <div className='p-8 bg-white dark:bg-gray-900 rounded-md shadow-md w-2/5 max-lg:w-full'>
      <form action={addAnnouncementAction} className='flex flex-col gap-2'>
        <div>
          <label htmlFor='content' className='text-label font-bold'>
            公告内容
          </label>
          <Input id='content' name='content' required />
        </div>
        <div>
          <label htmlFor='publisherName' className='text-label font-bold'>
            发布者
          </label>
          <Input
            id='publisherName'
            name='publisherName'
            value={user?.name}
            readOnly
            required
          />
        </div>
        <div>
          <label htmlFor='publisherId' className='text-label font-bold'>
            发布者ID
          </label>
          <Input
            id='publisherId'
            name='publisherId'
            value={user?.id}
            readOnly
            required
          />
        </div>
        <div className='flex items-center gap-1 mt-2'>
          <input id='pin' name='pin' type='checkbox' />
          置顶
          <label htmlFor='pin'></label>
        </div>
        <SubmitButton text='添加公告' />
      </form>
    </div>
  )
}
