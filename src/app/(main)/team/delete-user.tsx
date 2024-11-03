'use client'

import { useState } from 'react'
import { MdDeleteForever } from 'react-icons/md'

import NProgress from 'nprogress'

import { removeUserFromTeam } from '@/lib/actions/team'

const DeleteUser = ({
  userId,
  canNotDel
}: {
  userId: string
  canNotDel: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [_disabled, setDisabled] = useState(false)

  const disabled = canNotDel || _disabled

  return (
    <>
      <button
        className={`rounded-full absolute right-0 top-1/2 translate-y-[-50%] p-1 text-xl ${disabled ? 'cursor-not-allowed bg-gray-300 text-gray-400' : 'text-white bg-red-500 hover:bg-red-700'}`}
        disabled={disabled}
        type='button'
        onClick={() => !disabled && setOpen(true)}
      >
        <MdDeleteForever />
      </button>
      <div
        className={`z-50 overflow-hidden whitespace-nowrap right-0 absolute flex-row gap-1 transition-all bg-page-bg flex items-center justify-end duration-300 ease-in-out min-h-8 ${open ? 'w-3/4' : 'w-0'}`}
      >
        <p>确定要移除此成员吗？</p>
        <button
          type='button'
          disabled={disabled}
          className={`text-white rounded-md text-sm p-1 px-2 ${disabled ? 'cursor-not-allowed bg-gray-500 hover:bg-gray-500' : 'bg-red-500 hover:bg-red-700'}`}
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
          disabled={disabled}
          className={`rounded-md text-sm p-1 px-2 ${disabled ? 'cursor-not-allowed bg-gray-500 hover:bg-gray-500 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
          onClick={() => setOpen(false)}
        >
          取消
        </button>
      </div>
    </>
  )
}

export default DeleteUser
