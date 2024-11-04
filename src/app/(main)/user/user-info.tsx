'use client'

import React, { useState } from 'react'
import { MdEdit, MdLink, MdSave } from 'react-icons/md'

import Link from 'next/link'

import Input from '@/components/input'
import Select from '@/components/select'
import SelectArrow from '@/components/select-arrow'
import SubmitButton from '@/components/submit-button'
import Tooltip from '@/components/tool-tip'
import { updateUser } from '@/lib/actions/user'
import { type Role, role as _role, roleMap, roleOrder } from '@/lib/role'
import type { User } from '@/types/role'

interface Props {
  user: User
  currentUser: User
}

const UserInfo: React.FC<Props> = ({ user, currentUser }) => {
  const { id, name, email, role, team } = user

  const [isEditing, setIsEditing] = useState(false)

  const canChangeRole =
    _role.superAdmin(currentUser) ||
    (_role.admin(currentUser) && team === currentUser.team)

  return (
    <div className='p-6 bg-white dark:bg-black shadow-lg rounded-lg mt-8 max-w-lg transition-all duration-300 ease-in-out'>
      <h2 className='text-2xl font-semibold mb-4 text-title'>您的信息</h2>
      <form
        action={async formData => {
          await updateUser(formData)
          setIsEditing(false)
        }}
      >
        <div className='text-label mb-4'>
          <strong>ID:</strong>{' '}
          <pre className='inline-block dark:bg-gray-700 bg-gray-200 px-2 rounded-md whitespace-pre-wrap break-all'>
            {id}
          </pre>
          <input type='hidden' name='id' value={id} />
        </div>
        <div className='mb-4'>
          <label className='block text-label mb-1 font-bold'>姓名</label>
          {isEditing ? (
            <Input
              type='text'
              name='name'
              defaultValue={name}
              required
              className='w-full px-3 py-2 border rounded-lg'
            />
          ) : (
            <p>{name}</p>
          )}
        </div>
        <div className='mb-4'>
          <label className='block text-label mb-1 font-bold'>电子邮箱</label>
          {isEditing ? (
            <Tooltip
              className='w-full'
              message='电子邮箱是用于唯一确定您身份的方式之一，因此不能修改。您可以使用您的新电子邮件地址创建新账号。'
            >
              <Input
                type='email'
                name='email'
                value={email}
                required
                disabled
                className='w-full px-3 py-2 border rounded-lg'
              />
            </Tooltip>
          ) : (
            <p>{email}</p>
          )}
        </div>
        <div className='mb-4'>
          <label className='block text-label mb-1 font-bold'>权限</label>
          {isEditing ? (
            <div className='relative'>
              <Tooltip
                message='您的权限不足以进行此操作。'
                className='w-full'
                disabled={canChangeRole}
              >
                <Select
                  name='role'
                  defaultValue={role}
                  disabled={!canChangeRole}
                >
                  {Object.entries(roleMap).map(
                    ([key, value]) =>
                      roleOrder[key as Role] <= roleOrder[user.role] &&
                      (key === 'temp-user'
                        ? _role.superAdmin(currentUser)
                        : true) && (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      )
                  )}
                </Select>
              </Tooltip>
              <SelectArrow />
            </div>
          ) : (
            <p>{roleMap[role]}</p>
          )}
        </div>
        <div className='mb-4'>
          <label className='block text-label mb-1 font-bold'>所在团队</label>
          {isEditing ? (
            <>
              <Tooltip className='w-full' message='请联系负责人进行操作。'>
                <Input
                  type='text'
                  disabled
                  defaultValue={team || 'N/A'}
                  className='w-full px-3 py-2 border rounded-lg'
                />
              </Tooltip>
              <div>
                {_role.admin(currentUser) && (
                  <>
                    <Link
                      href='/team'
                      className='text-blue-500 mt-3 flex gap-1 ml-2 border-b w-fit border-blue-500 items-center'
                    >
                      <MdLink /> 管理团队
                    </Link>
                  </>
                )}
              </div>
            </>
          ) : (
            <p>{team || 'N/A'}</p>
          )}
        </div>
        <div className='flex justify-end'>
          {isEditing ? (
            <>
              <button
                onClick={e => {
                  e.preventDefault()
                  setIsEditing(false)
                }}
                className='px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 font-bold'
              >
                取消
              </button>
              <SubmitButton className='px-4 py-2 bg-blue-500 text-white rounded-lg font-bold gap-1 flex items-center !w-fit'>
                <MdSave /> 保存
              </SubmitButton>
            </>
          ) : (
            <button
              type='button'
              onClick={e => {
                e.preventDefault()
                setIsEditing(true)
              }}
              className='px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg flex items-center gap-1 font-bold'
            >
              <MdEdit /> 编辑
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default UserInfo
