import { useState } from 'react'
import { GoArrowSwitch } from 'react-icons/go'
import { MdEdit, MdError } from 'react-icons/md'

import MultiSelectDropdown from '@/components/multi-select-dropdown'
import type { MergedTask } from '@/lib/merge-tasks'
import { localFormat } from '@/lib/time'
import type { Team } from '@/types/team'

interface TaskRowProps {
  task: MergedTask
  total: number
  managers: Team['members']
  users: Team['members']
  onEdit: () => void
  fakeUsers: string[]
  assignedUsers: Array<{ id: string; name: string }>
  assignedManager: { id: string; name: string } | undefined
  onFakeUsersChange: (users: string[]) => void
  onAssignedUsersChange: (users: Array<{ id: string; name: string }>) => void
  onAssignedManagerChange: (manager: { id: string; name: string }) => void
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  total,
  managers,
  users,
  onEdit,
  fakeUsers,
  assignedUsers,
  assignedManager,
  onFakeUsersChange,
  onAssignedUsersChange,
  onAssignedManagerChange
}) => {
  const [useFakeUsers, setUseFakeUsers] = useState(assignedUsers.length === 0)

  const handleUseFakeUsersChange = () => {
    if (useFakeUsers) {
      onFakeUsersChange([])
    } else {
      onAssignedUsersChange([])
    }
    setUseFakeUsers(prev => !prev)
  }

  return (
    <tr className='border-b border-gray-200 hover:bg-gray-50 transition-colors w-full'>
      <td className='py-3 px-4 text-gray-800 w-1/6 break-all'>
        <div className='flex items-center gap-2'>
          {task.name}{' '}
          <button onClick={onEdit}>
            <MdEdit className='text-blue-500 text-lg' />
          </button>
        </div>
      </td>
      <td className='py-3 px-4 text-gray-800 w-1/6 break-all'>
        {task.description}
      </td>
      <td className='py-3 px-4 text-gray-800 w-1/6 break-all'>
        {localFormat(task.dueDate, 'yyyy-MM-dd HH:mm')}
      </td>
      <td className='py-3 px-4 text-gray-800 w-1/6 break-all'>
        <MultiSelectDropdown
          options={managers.map(manager => manager.name)}
          value={assignedManager ? [assignedManager.name] : []}
          onChange={v => {
            const manager = managers.find(m => m.name === v[0])
            if (manager) {
              onAssignedManagerChange({
                id: manager.id,
                name: manager.name
              })
            }
          }}
          multiple={false}
        />
      </td>
      <td className='py-3 px-4 text-gray-800 w-1/6 break-all'>
        <div className='flex flex-col items-center gap-2'>
          {useFakeUsers ? (
            <div className='flex items-center gap-2'>
              <button
                className='text-gray-500 break-keep bg-gray-100 px-2 py-1 rounded-md flex items-center gap-2'
                onClick={handleUseFakeUsersChange}
              >
                虚拟 <GoArrowSwitch />
              </button>
              <MultiSelectDropdown
                options={Array.from({ length: total }).map((_, index) =>
                  String.fromCharCode(65 + index)
                )}
                value={fakeUsers}
                onChange={onFakeUsersChange}
              />
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <button
                className='text-blue-500 break-keep bg-blue-100 px-2 py-1 rounded-md flex items-center gap-2'
                onClick={handleUseFakeUsersChange}
              >
                真实 <GoArrowSwitch />
              </button>
              <MultiSelectDropdown
                options={users.map(user => user.name)}
                value={assignedUsers.map(u => u.name)}
                onChange={v => {
                  const selectedUsers = v.map(name => {
                    const user = users.find(u => u.name === name)
                    return {
                      id: user!.id,
                      name: user!.name
                    }
                  })
                  onAssignedUsersChange(selectedUsers)
                }}
              />
            </div>
          )}
          {task.requiredPeople !==
            (assignedUsers?.length || 0) + (fakeUsers?.length || 0) && (
            <div className='text-red-500 flex items-center gap-2'>
              <MdError /> 已选人数与需求({task.requiredPeople})不符
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

export default TaskRow
