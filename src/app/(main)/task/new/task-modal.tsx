'use client'

import { useEffect } from 'react'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'

import { getTaskById } from '@/lib/actions/activity'
import type { Task } from '@/types/activity/task'

import TaskForm from './task-form'

interface TaskModalProps {
  id: string | undefined
  taskId?: string
  onAddTask: (task: Task) => void
  onClose: () => void
}

export default function TaskModal({
  id,
  taskId,
  onAddTask,
  onClose
}: TaskModalProps) {
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    if (id && taskId) {
      console.log(id, taskId)
      void getTaskById(id, taskId).then(task => {
        console.log(task)
        setTask(task)
      })
    }
  }, [id, taskId])

  const handleCreated = (task: Task) => {
    onAddTask(task)
    onClose()
  }

  return (
    <div className='relative'>
      <div className='sticky top-0 right-0 z-10 bg-white py-4 px-6 border-b-2 border-gray-200'>
        <h1 className='text-3xl font-semibold text-gray-800 flex items-center justify-between'>
          {taskId ? '编辑任务' : '创建任务'}{' '}
          <button onClick={onClose}>
            <div className='p-2 rounded-full bg-white shadow-md'>
              <MdClose className='text-gray-800 text-2xl hover:text-red-500 transition-colors' />
            </div>
          </button>
        </h1>
      </div>
      <div className='p-6'>
        {id ? (
          <TaskForm id={id} task={task} onCreated={handleCreated} />
        ) : (
          <h1 className='text-2xl font-semibold text-gray-800 text-center mt-20'>
            请保存活动名称和活动时间
          </h1>
        )}
      </div>
    </div>
  )
}
