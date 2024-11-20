'use client'

import { useEffect, useRef, useState } from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'nextjs-toploader/app'

import type { MDXEditorMethods } from '@mdxeditor/editor'
import { v4 } from 'uuid'

import AiDialog from '@/components/ai-dialog'
import FileUpload from '@/components/file-upload'
import MdEditorFallback from '@/components/md-editor-fallback'
import { generateTaskTemplate } from '@/lib/actions/ai'
import { addTaskTemplate } from '@/lib/actions/task'
import { uploadFiles } from '@/lib/b2'
import { TaskTemplate, TaskTemplateStage } from '@/types/activity/task'

import StageCard from './stage-card'

const MarkdownEditor = dynamic(() => import('@/components/markdown-editor'), {
  ssr: false,
  loading: () => <MdEditorFallback />
})

interface TaskTemplateFormProps {
  template: TaskTemplate | null
}

export default function TaskTemplateForm({ template }: TaskTemplateFormProps) {
  const [templateName, setTemplateName] = useState(template?.name || '')
  const [referenceFiles, setReferenceFiles] = useState<string[]>(
    template?.references || []
  )
  const [requiredPeople, setRequiredPeople] = useState(
    template?.requiredPeople || 1
  )
  const [stages, setStages] = useState<TaskTemplateStage[]>(
    template?.stages || [
      {
        id: v4(),
        name: '',
        approval: 'none',
        content: '',
        assignedTo: requiredPeople === 1 ? [0] : []
      }
    ]
  )
  const [activeStageIndex, setActiveStageIndex] = useState(0)
  const [templateDescription, setTemplateDescription] = useState(
    template?.description || ''
  )

  const editorRef = useRef<MDXEditorMethods>(null)

  useEffect(() => {
    if (template) {
      setTemplateName(template.name)
      setReferenceFiles(template.references)
      setRequiredPeople(template.requiredPeople)
      setTemplateDescription(template.description)
      setStages(template.stages)

      editorRef.current?.setMarkdown(template.description)
    }
  }, [template])

  const handleTemplateDescriptionChange = (markdown: string) => {
    editorRef.current?.setMarkdown(markdown)
    setTemplateDescription(markdown)
  }

  const handleAddStage = () => {
    setStages([
      ...stages,
      {
        id: v4(),
        name: '',
        approval: 'none',
        content: '',
        assignedTo: requiredPeople === 1 ? [0] : []
      }
    ])
    setActiveStageIndex(stages.length)
  }

  const handleUpdateStage = (updatedStage: TaskTemplateStage) => {
    setStages(
      stages.map(stage => (stage.id === updatedStage.id ? updatedStage : stage))
    )
  }

  const handleDeleteStage = (id: string) => {
    const toBeDeletedIndex = stages.findIndex(stage => stage.id === id)
    if (
      toBeDeletedIndex === activeStageIndex &&
      toBeDeletedIndex > 0 &&
      toBeDeletedIndex === stages.length - 1
    ) {
      setActiveStageIndex(toBeDeletedIndex - 1)
    }
    setStages(stages.filter(stage => stage.id !== id))
  }

  const handleFileUpload = async (files: File[]) => {
    const keys = await uploadFiles(files)
    setReferenceFiles([...referenceFiles, ...keys])
    return keys
  }

  const handleFileRemove = (key: string) => {
    setReferenceFiles(referenceFiles.filter(f => f !== key))
  }

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const _template = TaskTemplate.parse({
      ...template,
      name: templateName,
      description: templateDescription,
      references: referenceFiles,
      requiredPeople,
      stages: stages.map(stage => ({
        ...stage,
        completed: false
      }))
    })
    await addTaskTemplate(_template)
    setIsLoading(false)
    router.push('/task')
  }

  const [aiError, setAiError] = useState<string | undefined>(undefined)

  const templateRef = useRef<TaskTemplate | null>(null)

  const handleAiGenerate = async (additionalInfo: string) => {
    setAiError(undefined)
    const _template = TaskTemplate.parse({
      ...template,
      name: templateName,
      description: templateDescription,
      references: referenceFiles,
      requiredPeople,
      stages: stages.map(stage => ({
        ...stage,
        completed: false
      }))
    })

    templateRef.current = _template

    if (!_template.name) {
      setAiError('请至少输入模板名称')
      return
    }

    const improvedTemplate = TaskTemplate.parse(
      JSON.parse((await generateTaskTemplate(_template, additionalInfo))!)
    )

    setStages(improvedTemplate.stages)
    setTemplateDescription(improvedTemplate.description)
    setTemplateName(improvedTemplate.name)
    setTemplateDescription(improvedTemplate.description)
    setRequiredPeople(improvedTemplate.requiredPeople)
    editorRef.current?.setMarkdown(improvedTemplate.description)
    setActiveStageIndex(0)
  }

  const handleAiConfirm = () => {}

  const handleAiRevert = () => {
    if (templateRef.current) {
      setStages(templateRef.current.stages)
      setTemplateDescription(templateRef.current.description)
      setTemplateName(templateRef.current.name)
      setReferenceFiles(templateRef.current.references)
      setRequiredPeople(templateRef.current.requiredPeople)
      setActiveStageIndex(0)
      editorRef.current?.setMarkdown(templateRef.current.description)
    }
  }

  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label className='block text-lg font-medium text-gray-700'>
            模板名称 <span className='text-red-500'>*</span>
          </label>
          <input
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            className='w-full border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors duration-200 bg-transparent leading-8'
            placeholder='输入内容...'
            required
          />
        </div>

        <div>
          <label className='block text-lg font-medium text-gray-700'>
            模板描述
          </label>
          <MarkdownEditor
            editorRef={editorRef}
            markdown={templateDescription}
            onChange={handleTemplateDescriptionChange}
            className='mt-2'
            additionalContentEditableClassName='bg-white dark:bg-gray-900'
          />
        </div>

        <div>
          <label className='block text-lg font-medium text-gray-700'>
            工作人员数量
          </label>
          <div className='flex items-center space-x-2 mt-4'>
            <button
              type='button'
              onClick={() => setRequiredPeople(Math.max(1, requiredPeople - 1))}
              className='w-8 h-8 rounded-full bg-gray-100 hover:bg-indigo-50 flex items-center justify-center text-gray-600 border-2 border-indigo-300 border-dashed transition-colors duration-200'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M20 12H4'
                />
              </svg>
            </button>
            <span className='text-xl font-medium text-gray-700 min-w-[2rem] text-center'>
              {requiredPeople}
            </span>
            <button
              type='button'
              onClick={() => setRequiredPeople(requiredPeople + 1)}
              className='w-8 h-8 rounded-full bg-gray-100 hover:bg-indigo-50 flex items-center justify-center text-gray-600 border-2 border-indigo-300 border-dashed transition-colors duration-200'
            >
              <svg
                className='w-4 h-4'
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
          <div className='flex items-center mt-4 flex-wrap gap-2'>
            {Array.from({ length: requiredPeople }).map((_, index) => (
              <span
                key={index}
                className='text-lg font-medium rounded-full w-8 h-8 flex items-center justify-center bg-blue-500 text-white'
              >
                {String.fromCharCode(65 + index)}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className='block text-lg font-medium text-gray-700 mb-2'>
            参考文件
          </label>
          <FileUpload
            initialFiles={template?.references.map(key => ({ key })) || []}
            onUpload={handleFileUpload}
            onRemove={handleFileRemove}
          />
        </div>

        <div>
          <label className='block text-lg font-medium text-gray-700'>
            流程
          </label>
          <div className='flex mt-2'>
            {/* 左侧阶段导航 */}
            <div className='flex flex-col items-center mr-8 relative'>
              {stages.map((stage, index) => (
                <div key={stage.id} className='flex flex-col items-center'>
                  <button
                    type='button'
                    onClick={() => setActiveStageIndex(index)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10
                    ${activeStageIndex === index ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'}
                  `}
                  >
                    {index + 1}
                  </button>
                  {index < stages.length - 1 && (
                    <div className='h-8 w-0.5 bg-gray-300 relative'>
                      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 border-r-2 border-b-2 border-gray-300' />
                    </div>
                  )}
                </div>
              ))}
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
                    isTaskTemplate={true}
                    requiredPeople={requiredPeople}
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
          disabled={isLoading}
          className={`w-full mt-4 py-2 px-4 text-white font-semibold rounded-md shadow ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>处理中...</span>
            </div>
          ) : (
            template ? '更新任务模板' : '创建任务模板'
          )}
        </button>
      </form>

      <AiDialog
        onAiGenerate={handleAiGenerate}
        onConfirm={handleAiConfirm}
        onRevert={handleAiRevert}
        aiError={aiError}
      />
    </>
  )
}
