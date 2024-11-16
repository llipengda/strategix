'use client'

import { useState } from 'react'

import FileUpload from '@/components/file-upload'
import { uploadFiles } from '@/lib/b2'

import StageCard, { type Stage } from './stage-card'

export default function TaskForm() {
  const [taskName, setTaskName] = useState('')
  const [referenceFiles, setReferenceFiles] = useState<File[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [activeStageIndex, setActiveStageIndex] = useState(0)

  const handleAddStage = () => {
    setStages([
      ...stages,
      {
        id: Date.now().toString(),
        name: '',
        approval: 'none',
        content: ''
      }
    ])
  }

  const handleUpdateStage = (updatedStage: Stage) => {
    setStages(
      stages.map(stage => (stage.id === updatedStage.id ? updatedStage : stage))
    )
  }

  const handleDeleteStage = (id: string) => {
    setStages(stages.filter(stage => stage.id !== id))
  }

  const handleFileUpload = async (files: File[]) => {
    const keys = await uploadFiles(files)
    setReferenceFiles([...referenceFiles, ...files])
    return keys
  }

  const handleFileRemove = (file: File) => {
    setReferenceFiles(referenceFiles.filter(f => f !== file))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e)
    e.preventDefault()
    const taskData = { taskName, referenceFiles, stages }
    console.log('提交的任务数据:', taskData)
    alert('任务创建成功！')
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <label className='block text-lg font-medium text-gray-700'>
          任务名称
        </label>
        <input
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          className='w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-transparent leading-8'
          placeholder='输入内容...'
          required
        />
      </div>

      <div>
        <label className='block text-lg font-medium text-gray-700 mb-2'>
          参考文件
        </label>
        <FileUpload onUpload={handleFileUpload} onRemove={handleFileRemove} />
      </div>

      <div>
        <label className='block text-lg font-medium text-gray-700'>流程</label>
        <div className='flex mt-2'>
          {/* 左侧阶段导航 */}
          <div className='flex flex-col items-center mr-8 relative'>
            {stages.map((stage, index) => (
              <div key={stage.id} className='flex flex-col items-center'>
                <button
                  type='button'
                  onClick={() => setActiveStageIndex(index)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
                    ${activeStageIndex === index ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'}
                  `}
                >
                  {index + 1}
                </button>
                {/* 连接箭头 */}
                {index < stages.length - 1 && (
                  <div className='h-8 w-0.5 bg-gray-300 relative'>
                    <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 border-r-2 border-b-2 border-gray-300' />
                  </div>
                )}
              </div>
            ))}
            {/* 添加阶段按钮 */}
            {stages.length > 0 && <div className='mt-4' />}
            <button
              type='button'
              onClick={handleAddStage}
              className='w-10 h-10 rounded-full border-2 border-dashed border-indigo-300 flex items-center justify-center text-indigo-600 hover:bg-indigo-50'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
            </button>
          </div>

          {/* 右侧阶段内容 */}
          <div className='flex-1'>
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                className={activeStageIndex === index ? 'block' : 'hidden'}
              >
                <StageCard
                  stage={stage}
                  onUpdate={handleUpdateStage}
                  onDelete={handleDeleteStage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type='submit'
        className='w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700'
      >
        创建任务
      </button>
    </form>
  )
}
