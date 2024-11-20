'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import Modal from 'react-modal'

import { KeyContext } from '@/app/(main)/activity/new/key-context'
import TaskRow from '@/app/(main)/activity/new/task-row'
import TaskModal from '@/app/(main)/task/new/task-modal'
import ErrorMessage from '@/components/error-message'
import ToggleButtonGroup from '@/components/toggle-button-group'
import {
  addAssignmentsAction,
  deleteAssignmentAction,
  updateActivityAction,
  updateTaskAction
} from '@/lib/actions/activity'
import { type MergedTask, mergeTasks } from '@/lib/task-process'
import { localDate, localFormat } from '@/lib/time'
import { Assignment } from '@/types/activity/assignment'
import type { Task } from '@/types/activity/task'
import type { Team } from '@/types/team'

import './assignments.css'

Modal.setAppElement('#modal-root')

interface AssignmentsProps {
  totalUsers?: number
  assignType?: 'preference' | 'time'
  team: Team
  tasks: Task[]
  assignments: Assignment[]
}

const Assignments: React.FC<AssignmentsProps> = ({
  totalUsers,
  assignType: _assignType,
  team,
  tasks,
  assignments
}) => {
  const mergedTasks = mergeTasks(tasks, assignments)

  const users = team.members
  const managers = team.members.filter(member => member.role !== 'user')

  const [total, setTotal] = useState<number | string>(
    totalUsers || team.members.filter(m => m.role === 'user').length || 1
  )
  const [error, setError] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveTime, setSaveTime] = useState<Date>()

  const [isOpen, setIsOpen] = useState(false)
  const [col, setCol] = useState<MergedTask[]>(mergedTasks)
  const [taskId, setTaskId] = useState<string | undefined>(undefined)

  const [fakeUsers, setFakeUsers] = useState<{ [key: string]: string[] }>(
    mergedTasks.reduce(
      (acc, task) => ({ ...acc, [task.taskId]: task.fakeAssignedTo }),
      {}
    )
  )
  const [assignedUsers, setAssignedUsers] = useState<{
    [key: string]: Array<{ id: string; name: string }>
  }>(
    mergedTasks.reduce(
      (acc, task) => ({
        ...acc,
        [task.taskId]: task.users.map(user => ({
          id: user.userId,
          name: user.userName
        }))
      }),
      {}
    )
  )
  const [assignedManagers, setAssignedManagers] = useState<{
    [key: string]: { id: string; name: string } | undefined
  }>(
    mergedTasks.reduce(
      (acc, task) => ({
        ...acc,
        [task.taskId]: task.managerId
          ? {
              id: task.managerId,
              name: task.managerName || ''
            }
          : undefined
      }),
      {}
    )
  )

  const [assignType, setAssignType] = useState<
    'preference' | 'time' | undefined
  >(_assignType)

  const { key } = use(KeyContext)

  useEffect(() => {
    setTotal(
      totalUsers || team.members.filter(m => m.role === 'user').length || 1
    )
  }, [totalUsers, team.members])

  useEffect(() => {
    setAssignType(_assignType)
  }, [_assignType])

  useEffect(() => {
    const newMergedTasks = mergeTasks(tasks, assignments)
    setCol(newMergedTasks)

    setFakeUsers(
      newMergedTasks.reduce(
        (acc, task) => ({ ...acc, [task.taskId]: task.fakeAssignedTo }),
        {}
      )
    )

    setAssignedUsers(
      newMergedTasks.reduce(
        (acc, task) => ({
          ...acc,
          [task.taskId]: task.users.map(user => ({
            id: user.userId,
            name: user.userName
          }))
        }),
        {}
      )
    )

    setAssignedManagers(
      newMergedTasks.reduce(
        (acc, task) => ({
          ...acc,
          [task.taskId]: task.managerId
            ? {
                id: task.managerId,
                name: task.managerName || ''
              }
            : undefined
        }),
        {}
      )
    )
  }, [tasks, assignments])

  const handleOpen = (taskId?: string) => {
    setTaskId(taskId)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const save = useCallback(async () => {
    setError('')

    if (!key) {
      return
    }

    for (const task of mergedTasks) {
      const _fakeUsers = fakeUsers[task.taskId]
      const manager = assignedManagers[task.taskId]
      const users = assignedUsers[task.taskId]

      if (!manager) {
        setError('有任务未指定负责人')
        return
      }

      if (users?.length === 0 && _fakeUsers?.length === 0) {
        setError('有任务未指定分配人员')
        return
      }

      if (
        task?.requiredPeople !==
        (users?.length || 0) + (_fakeUsers?.length || 0)
      ) {
        setError('有任务已选人数与需求不符')
        return
      }
    }

    await updateActivityAction(
      {
        id: key.id,
        sk: key.sk
      },
      {
        totalUsers: Number(total),
        assignType
      }
    )

    await Promise.all(
      assignments.map(assignment =>
        deleteAssignmentAction({
          id: assignment.id,
          sk: assignment.sk
        })
      )
    )

    mergedTasks.forEach(async task => {
      const _fakeUsers = fakeUsers[task.taskId]
      const manager = assignedManagers[task.taskId]
      const users = assignedUsers[task.taskId]

      const taskPromises: Promise<void>[] = []

      taskPromises.push(
        updateTaskAction(
          {
            id: task.id,
            sk: task.sk
          },
          {
            fakeAssignedTo: _fakeUsers
          }
        )
      )

      if (manager) {
        taskPromises.push(
          addAssignmentsAction([
            Assignment.parse({
              id: task.id,
              taskId: task.taskId,
              managerName: manager.name,
              managerId: manager.id,
              isManager: true
            })
          ])
        )
      }

      if (users?.length > 0) {
        taskPromises.push(
          addAssignmentsAction(
            users.map(user =>
              Assignment.parse({
                id: task.id,
                taskId: task.taskId,
                userId: user.id,
                userName: user.name,
                isManager: false
              })
            )
          )
        )
      }

      await Promise.all(taskPromises)
    })

    setSaveTime(localDate())
  }, [
    key,
    total,
    assignments,
    mergedTasks,
    fakeUsers,
    assignedManagers,
    assignedUsers,
    assignType
  ])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      await save()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setIsSaving(false)
    }
  }, [save])

  const handleSaveRef = useRef(handleSave)

  useEffect(() => {
    handleSaveRef.current = handleSave
  }, [handleSave])

  useEffect(() => {
    const interval = setInterval(() => {
      void handleSaveRef.current()
    }, 60000)

    return () => clearInterval(interval)
  }, [total, fakeUsers, assignedUsers, assignedManagers])

  const handleAddTask = (task: Task) => {
    const foundIndex = col.findIndex(t => t.taskId === task.taskId)

    if (foundIndex !== -1) {
      setCol(prev => [
        ...prev.slice(0, foundIndex),
        { ...prev[foundIndex], ...task },
        ...prev.slice(foundIndex + 1)
      ])
    } else {
      setCol(prev => [
        ...prev,
        { ...task, managerId: null, managerName: null, users: [] }
      ])
      setAssignedUsers(prev => ({ ...prev, [task.taskId]: [] }))
      setFakeUsers(prev => ({ ...prev, [task.taskId]: [] }))
      setAssignedManagers(prev => ({ ...prev, [task.taskId]: undefined }))
    }
  }

  const handleFakeUsersChange = (taskId: string, users: string[]) => {
    setFakeUsers(prev => ({ ...prev, [taskId]: users }))
  }

  const handleAssignedUsersChange = (
    taskId: string,
    users: Array<{ id: string; name: string }>
  ) => {
    setAssignedUsers(prev => ({ ...prev, [taskId]: users }))
  }

  const handleAssignedManagerChange = (
    taskId: string,
    manager: { id: string; name: string }
  ) => {
    setAssignedManagers(prev => ({ ...prev, [taskId]: manager }))
  }

  const hasFakeUsers = Object.values(fakeUsers).some(users => users?.length > 0)

  return (
    <div
      className={`space-y-8 rounded-lg p-4 bg-white border-2 border-gray-300 ${
        !!saveTime ? '' : 'border-dashed'
      }`}
    >
      <h2 className='text-2xl font-bold'>分工安排</h2>

      <div className='space-y-2'>
        <h3 className='text-xl font-bold'>总人数</h3>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setTotal(Math.max(1, Number(total) - 1))}
            className='w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors'
          >
            -
          </button>
          <input
            className='w-16 text-center border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            type='number'
            value={total}
            onChange={e => setTotal(e.target.value)}
          />
          <button
            onClick={() => setTotal(Number(total) + 1)}
            className='w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors'
          >
            +
          </button>
        </div>
        <div className='flex gap-2 flex-wrap'>
          {Array.from({ length: Number(total) }).map((_, index) => (
            <div
              key={index}
              className='w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium'
            >
              {String.fromCharCode(65 + index)}
            </div>
          ))}
        </div>
      </div>
      <div className='mt-4 h-fit'>
        <table className='w-full border-collapse border-2 border-gray-300 min-w-[800px]'>
          <thead>
            <tr className='bg-gray-50 border-b-2 border-gray-200'>
              <th className='text-left py-3 px-4 font-semibold text-gray-600'>
                任务
              </th>
              <th className='text-left py-3 px-4 font-semibold text-gray-600'>
                描述
              </th>
              <th className='text-left py-3 px-4 font-semibold text-gray-600'>
                截止时间
              </th>
              <th className='text-left py-3 px-4 font-semibold text-gray-600'>
                负责人
              </th>
              <th className='text-left py-3 px-4 font-semibold text-gray-600'>
                分配
              </th>
            </tr>
          </thead>
          <tbody>
            {col.map(task => (
              <TaskRow
                key={task.taskId}
                task={task}
                managers={managers}
                users={users}
                total={Number(total)}
                onEdit={() => handleOpen(task.taskId)}
                fakeUsers={fakeUsers[task.taskId] || []}
                assignedUsers={assignedUsers[task.taskId] || []}
                assignedManager={assignedManagers[task.taskId]}
                onFakeUsersChange={users =>
                  handleFakeUsersChange(task.taskId, users)
                }
                onAssignedUsersChange={users =>
                  handleAssignedUsersChange(task.taskId, users)
                }
                onAssignedManagerChange={manager =>
                  handleAssignedManagerChange(task.taskId, manager)
                }
              />
            ))}
            <tr className='border-b border-gray-200 bg-blue-50 hover:bg-blue-100 transition-colors w-full'>
              <td colSpan={5} className='py-3 px-4'>
                <div className='flex items-center gap-2 w-full justify-center'>
                  <button
                    className='text-blue-500 text-lg flex items-center gap-2'
                    onClick={() => handleOpen()}
                  >
                    <MdAdd /> 添加任务
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {hasFakeUsers && (
        <div className='flex gap-2 flex-col'>
          <h3 className='text-xl font-bold'>分配方式</h3>
          <ToggleButtonGroup
            options={[
              { key: 'preference', value: '意愿值' },
              { key: 'time', value: '时间' }
            ]}
            value={assignType}
            onChange={value => setAssignType(value as 'preference' | 'time')}
          />
        </div>
      )}
      <div className='space-y-2'>
        <hr className='border-gray-300 !mt-8' />
        <ErrorMessage defaultHeight={false} errorMessage={error} />
        <div className='flex justify-between items-center'>
          <div>
            <button
              className={`text-white px-2 py-1 rounded-md text-sm ${isSaving ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500'}`}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
            <span className='text-gray-400 text-sm italic ml-2'>
              每60秒将进行一次自动保存
            </span>
          </div>
          {saveTime && (
            <span className='text-gray-500 text-sm'>
              保存于{localFormat(saveTime, 'HH:mm:ss')}
            </span>
          )}
        </div>
      </div>
      <Modal isOpen={isOpen} onRequestClose={handleClose}>
        <TaskModal
          id={key?.id}
          taskId={taskId}
          onClose={handleClose}
          onAddTask={handleAddTask}
        />
      </Modal>
    </div>
  )
}

export default Assignments
