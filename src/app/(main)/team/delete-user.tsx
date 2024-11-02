'use client'

import { useState } from 'react'
import { MdDeleteForever } from 'react-icons/md'

import NProgress from 'nprogress'

import { removeUserFromTeam } from '@/lib/actions/team'

const DeleteUser = ({ userId }: { userId: string }) => {
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)

  return (
    <>
      <button
        className='rounded-full text-white p-1 bg-red-500 hover:bg-red-700 absolute right-0 top-1/2 translate-y-[-50%] text-xl'
        type='button'
        onClick={() => setOpen(true)}
      >
        <MdDeleteForever />
      </button>
      <div
        className={`z-50 overflow-hidden whitespace-nowrap right-0 absolute flex-row gap-1 transition-all bg-page-bg flex items-center justify-end duration-300 ease-in-out ${open ? 'w-3/4' : 'w-0'}`}
      >
        <p>确定要移除此成员吗？</p>
        <button
          type='button'
          className={`bg-red-500 hover:bg-red-700 text-white rounded-md text-sm p-1 px-2 ${disabled ? 'cursor-not-allowed bg-gray-500 hover:bg-gray-500' : ''}`}
          onClick={async () => {
            NProgress.start()
            setDisabled(true)
            await removeUserFromTeam(userId)
            NProgress.done()
            setDisabled(false)
            setOpen(false)
          }}
        >
          确定
        </button>
        <button
          type='button'
          className={`bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm p-1 px-2 ${disabled ? 'cursor-not-allowed bg-gray-500 hover:bg-gray-500 text-white' : ''}`}
          onClick={() => setOpen(false)}
        >
          取消
        </button>
      </div>
    </>
  )
}

export default DeleteUser
