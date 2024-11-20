'use client'

import { useEffect } from 'react'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'

import MultiSelectDropdown from '@/components/multi-select-dropdown'
import { getTaskById } from '@/lib/actions/activity'
import { getTaskTemplates } from '@/lib/actions/task'
import type { Task, TaskTemplate } from '@/types/activity/task'

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
  const [task, setTask] = useState<Partial<Task> | null>(null)

  useEffect(() => {
    if (id && taskId) {
      void getTaskById(id, taskId).then(task => {
        console.log(task)
        setTask(task)
      })
    }
  }, [id, taskId])

  const [templates, setTemplates] = useState<TaskTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate>()

  useEffect(() => {
    void getTaskTemplates().then(setTemplates)
  }, [])

  const handleCreated = (task: Task) => {
    onAddTask(task)
    onClose()
  }

  const handleSelectTemplate = (templateName: string) => {
    const template = templates.find(t => t.name === templateName)
    setSelectedTemplate(template)

    const toInherit = Object.fromEntries(
      Object.entries(template!).filter(
        ([key]) => key !== 'id' && key !== 'sk' && key !== 'type'
      )
    )

    setTask(prev => ({
      ...prev,
      ...toInherit
    }))
  }

  return (
    <div className='relative'>
      <div className='sticky top-0 right-0 z-10 bg-white py-4 px-6 border-b-2 border-gray-200'>
        <h1 className='text-3xl font-semibold text-gray-800 flex items-center justify-between'>
          <div className='flex items-center gap-10'>
            {taskId ? '编辑任务' : '创建任务'}{' '}
            <div className='text-gray-700 text-base flex items-center gap-1'>
              从{' '}
              <MultiSelectDropdown
                multiple={false}
                placeholder='选择模板'
                options={templates.map(t => t.name)}
                value={selectedTemplate ? [selectedTemplate.name] : []}
                onChange={v => handleSelectTemplate(v[0])}
              />{' '}
              继承
              <button
                className='text-base rounded-md text-red-600 px-2 py-1 hover:bg-gray-100 transition-colors'
                onClick={() => setSelectedTemplate(undefined)}
              >
                清除
              </button>
            </div>
          </div>
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
